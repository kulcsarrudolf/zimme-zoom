/**
 * Accessible names for the viewer and its controls.
 *
 * Keys are per control rather than per icon: previous/next and rotate
 * left/right share an icon component and differ only by a CSS transform.
 */
export type PhotoViewerLabels = {
  /** Falls back to the image title when one is set. */
  dialog: string;
  close: string;
  previous: string;
  next: string;
  zoomIn: string;
  zoomOut: string;
  rotateLeft: string;
  rotateRight: string;
  reset: string;
  download: string;
  toggleOverlay: string;
};

export type PhotoViewerSettings = {
  allowZoom: boolean;
  allowRotate: boolean;
  allowReset: boolean;
  allowDownload: boolean;
  doubleClickZoom: number;
  clickOutsideToExit: boolean;
  keyboardInteraction: boolean;
  maxZoom: number;
  minZoom: number;
  zoomStep: number;
  showOverlayByDefault?: boolean;
  showOverlayButton?: boolean;
};
