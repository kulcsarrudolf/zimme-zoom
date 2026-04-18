export type OverlayPosition = 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'bottom' | 'left' | 'right';

export type OverlaySize = {
  maxWidth?: string | number;
  maxHeight?: string | number;
  width?: string | number;
  height?: string | number;
};

export enum ImageRatio {
  Square    = '1 / 1',
  Portrait  = '4 / 5',
  Tall      = '9 / 16',
  Landscape = '16 / 9',
  Classic   = '4 / 3',
  Cinematic = '21 / 9',
  Golden    = '1.618 / 1',
}

export type ImageSize = {
  ratio?: ImageRatio;
  width?: string | number;
  height?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
};

export type ZZImage = {
  id: string;
  src: string;
  alt?: string;
  title?: string;
  svgOverlay?: React.ReactNode | string; // Can be a React component or a URL string
  overlayPosition?: OverlayPosition;
  overlaySize?: OverlaySize;
};
