import { act, renderHook } from '@testing-library/react';
import { useImageLoading } from '../useImageLoading';

function refTo(complete: boolean) {
  return { current: { complete } as HTMLImageElement };
}

describe('useImageLoading', () => {
  it('is loading until the image settles', () => {
    const { result } = renderHook(() => useImageLoading('a', refTo(false)));
    expect(result.current.isLoading).toBe(true);

    act(() => result.current.onSettled());
    expect(result.current.isLoading).toBe(false);
  });

  it('is not loading when the image was complete before the handlers attached', () => {
    const { result } = renderHook(() => useImageLoading('a', refTo(true)));
    expect(result.current.isLoading).toBe(false);
  });

  it('stays settled across re-renders of the same source', () => {
    const ref = refTo(false);
    const { result, rerender } = renderHook(({ key }) => useImageLoading(key, ref), {
      initialProps: { key: 'a' },
    });

    act(() => result.current.onSettled());
    rerender({ key: 'a' });
    expect(result.current.isLoading).toBe(false);
  });

  it('goes back to loading when the source changes', () => {
    const ref = refTo(false);
    const { result, rerender } = renderHook(({ key }) => useImageLoading(key, ref), {
      initialProps: { key: 'a' },
    });

    act(() => result.current.onSettled());
    rerender({ key: 'b' });
    expect(result.current.isLoading).toBe(true);

    act(() => result.current.onSettled());
    expect(result.current.isLoading).toBe(false);
  });
});
