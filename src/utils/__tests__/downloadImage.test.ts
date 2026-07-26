import { downloadImage } from '../downloadImage';

const mockLoadedImage = () => {
  const image = document.createElement('img');
  Object.defineProperties(image, {
    complete: { value: true },
    naturalWidth: { value: 100 },
    naturalHeight: { value: 50 },
  });
  return image;
};

const mockCanvasDownload = (blob: Blob | null = new Blob(['canvas'])) => {
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    configurable: true,
    value: jest.fn(() => ({ drawImage: jest.fn() })),
  });
  Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
    configurable: true,
    value: jest.fn((callback: BlobCallback) => callback(blob)),
  });
};

describe('downloadImage', () => {
  let clickSpy: jest.SpiedFunction<HTMLAnchorElement['click']>;
  let consoleWarnSpy: jest.SpiedFunction<typeof console.warn>;
  let createObjectURL: jest.MockedFunction<(blob: Blob | MediaSource) => string>;
  let revokeObjectURL: jest.MockedFunction<(url: string) => void>;

  beforeEach(() => {
    clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    createObjectURL = jest.fn((_blob: Blob | MediaSource) => 'blob:download');
    revokeObjectURL = jest.fn((_url: string) => undefined);

    Object.defineProperty(window.URL, 'createObjectURL', {
      configurable: true,
      value: createObjectURL,
    });
    Object.defineProperty(window.URL, 'revokeObjectURL', {
      configurable: true,
      value: revokeObjectURL,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('downloads with canvas when the loaded image can be drawn', async () => {
    mockCanvasDownload();
    const fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;
    global.fetch = fetchMock;

    const result = await downloadImage(
      'https://example.com/photo.jpg',
      'photo.jpg',
      mockLoadedImage(),
    );

    expect(result).toEqual({ method: 'canvas', errors: [] });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:download');
  });

  it('reports a canvas failure before falling back to fetch', async () => {
    const canvasError = new Error('tainted canvas');
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      configurable: true,
      value: jest.fn(() => {
        throw canvasError;
      }),
    });
    const response = {
      ok: true,
      blob: jest.fn().mockResolvedValue(new Blob(['fetch'])),
    } as unknown as Response;
    const fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;
    fetchMock.mockResolvedValue(response);
    global.fetch = fetchMock;

    const result = await downloadImage(
      'https://example.com/photo.jpg',
      'photo.jpg',
      mockLoadedImage(),
    );

    expect(result).toEqual({
      method: 'fetch',
      errors: [{ method: 'canvas', fallbackMethod: 'fetch', error: canvasError }],
    });
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Canvas download failed, trying fetch:',
      canvasError,
    );
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('reports a canvas failure when toBlob yields no blob before falling back to fetch', async () => {
    mockCanvasDownload(null);
    const response = {
      ok: true,
      blob: jest.fn().mockResolvedValue(new Blob(['fetch'])),
    } as unknown as Response;
    const fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;
    fetchMock.mockResolvedValue(response);
    global.fetch = fetchMock;

    const result = await downloadImage(
      'https://example.com/photo.jpg',
      'photo.jpg',
      mockLoadedImage(),
    );

    expect(result.method).toBe('fetch');
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].method).toBe('canvas');
    expect(result.errors[0].fallbackMethod).toBe('fetch');
    expect(result.errors[0].error).toEqual(new Error('Canvas conversion failed'));
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Canvas download failed, trying fetch:',
      result.errors[0].error,
    );
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('reports a fetch failure before opening the image in a new tab', async () => {
    const fetchError = new Error('CORS blocked');
    const fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;
    fetchMock.mockRejectedValue(fetchError);
    global.fetch = fetchMock;

    const result = await downloadImage('https://example.com/photo.jpg', 'photo.jpg');

    expect(result).toEqual({
      method: 'open-tab',
      errors: [{ method: 'fetch', fallbackMethod: 'open-tab', error: fetchError }],
    });
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Fetch download failed, using fallback:',
      fetchError,
    );
    expect(clickSpy).toHaveBeenCalledTimes(1);

    const fallbackLink = clickSpy.mock.contexts[0] as HTMLAnchorElement;
    expect(fallbackLink.href).toBe('https://example.com/photo.jpg');
    expect(fallbackLink.download).toBe('photo.jpg');
    expect(fallbackLink.target).toBe('_blank');
    expect(fallbackLink.rel).toBe('noopener noreferrer');
  });
});
