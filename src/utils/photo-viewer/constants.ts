import type { PhotoViewerLabels, PhotoViewerSettings } from '../../components/photo-viewer/types';

export const DEFAULT_ZOOM_STEP = 0.3;
export const DEFAULT_LARGE_ZOOM = 4;
export const DEFAULT_MIN_ZOOM = 0.5;
export const DEFAULT_MAX_ZOOM = 4;

export const SWIPE_MIN_DISTANCE = 50;
export const SWIPE_MAX_TIME_MS = 300;

export const DEFAULT_PHOTO_VIEWER_SETTINGS: PhotoViewerSettings = {
  allowZoom: true,
  allowRotate: true,
  allowReset: true,
  allowDownload: false,
  doubleClickZoom: DEFAULT_LARGE_ZOOM,
  clickOutsideToExit: true,
  keyboardInteraction: true,
  maxZoom: DEFAULT_MAX_ZOOM,
  minZoom: DEFAULT_MIN_ZOOM,
  zoomStep: DEFAULT_ZOOM_STEP,
};

export const EMPTY_PHOTO_VIEWER_SETTINGS: Partial<PhotoViewerSettings> = {};

export const DEFAULT_PHOTO_VIEWER_LABELS: PhotoViewerLabels = {
  dialog: 'Photo viewer',
  close: 'Close',
  previous: 'Previous image',
  next: 'Next image',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  rotateLeft: 'Rotate left',
  rotateRight: 'Rotate right',
  reset: 'Reset zoom and rotation',
  download: 'Download image',
  toggleOverlay: 'Toggle overlay',
};

export const EMPTY_PHOTO_VIEWER_LABELS: Partial<PhotoViewerLabels> = {};
