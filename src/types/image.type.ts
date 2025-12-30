export type OverlayPosition = 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'bottom' | 'left' | 'right';

export type OverlaySize = {
  maxWidth?: string | number;
  maxHeight?: string | number;
  width?: string | number;
  height?: string | number;
};

export type ZZImage = {
  id: string;
  src: string;
  alt?: string;
  title?: string;
  svgOverlay?: React.ReactNode;
  overlayPosition?: OverlayPosition;
  overlaySize?: OverlaySize;
};
