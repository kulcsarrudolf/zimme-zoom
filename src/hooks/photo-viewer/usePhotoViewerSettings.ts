import type { PhotoViewerSettings } from '../../components/photo-viewer/types';
import { DEFAULT_PHOTO_VIEWER_SETTINGS } from '../../utils/photo-viewer/constants';

export function usePhotoViewerSettings(
  overrides: Partial<PhotoViewerSettings>
): PhotoViewerSettings {
  return { ...DEFAULT_PHOTO_VIEWER_SETTINGS, ...overrides };
}
