import type { PhotoViewerLabels } from '../../components/photo-viewer/types';
import { DEFAULT_PHOTO_VIEWER_LABELS } from '../../utils/photo-viewer/constants';

export function usePhotoViewerLabels(overrides: Partial<PhotoViewerLabels>): PhotoViewerLabels {
  return { ...DEFAULT_PHOTO_VIEWER_LABELS, ...overrides };
}
