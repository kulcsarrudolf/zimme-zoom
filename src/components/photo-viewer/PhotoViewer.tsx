import React, { useCallback, useEffect, useRef, useState } from 'react';
import Navigation from './Navigation';
import PhotoViewerImage from './PhotoViewerImage';
import type { PhotoViewerSettings } from './types';
import { ZZImage } from '../../types/image.type';
import { downloadImage } from '../../utils/downloadImage';
import { EMPTY_PHOTO_VIEWER_SETTINGS } from '../../utils/photo-viewer/constants';
import { useClickOutsideToClose } from '../../hooks/photo-viewer/useClickOutsideToClose';
import { useImageNavigation } from '../../hooks/photo-viewer/useImageNavigation';
import { useImagePreloader } from '../../hooks/photo-viewer/useImagePreloader';
import { useKeyboardShortcuts } from '../../hooks/photo-viewer/useKeyboardShortcuts';
import { useMouseDrag } from '../../hooks/photo-viewer/useMouseDrag';
import { usePhotoViewerSettings } from '../../hooks/photo-viewer/usePhotoViewerSettings';
import { useTouchGestures } from '../../hooks/photo-viewer/useTouchGestures';
import { useTransform } from '../../hooks/photo-viewer/useTransform';
import { useWheelZoom } from '../../hooks/photo-viewer/useWheelZoom';

export type { PhotoViewerSettings } from './types';

export type PhotoViewerProps = {
  selectedImage: ZZImage | null;
  images: ZZImage[];
  onClose: () => void;
  onImageChange?: (image: ZZImage) => void;
  settings?: Partial<PhotoViewerSettings>;
};

const backdropStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const imageContainerBaseStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  touchAction: 'none',
};

const keyframesStyle = (
  <style>{`@keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 0.8; } 100% { opacity: 0.6; } }`}</style>
);

export const PhotoViewer: React.FC<PhotoViewerProps> = ({
  selectedImage,
  images,
  onClose,
  onImageChange,
  settings = EMPTY_PHOTO_VIEWER_SETTINGS,
}) => {
  const {
    allowZoom,
    allowRotate,
    allowReset,
    allowDownload,
    doubleClickZoom,
    clickOutsideToExit,
    keyboardInteraction,
    maxZoom,
    minZoom,
    zoomStep,
    showOverlayByDefault = false,
    showOverlayButton = false,
  } = usePhotoViewerSettings(settings);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const transform = useTransform({ minZoom, maxZoom });
  const {
    zoom,
    panX,
    panY,
    rotationCount,
    setZoom,
    setPan,
    zoomTo,
    rotate,
    reset: resetTransform,
  } = transform;

  const { currentImage, next, previous } = useImageNavigation({
    initialImage: selectedImage,
    images,
    onImageChange,
  });

  const [isHovered, setIsHovered] = useState(false);
  const [showOverlay, setShowOverlay] = useState(
    () => showOverlayByDefault && !!selectedImage?.svgOverlay,
  );

  useEffect(() => {
    setShowOverlay(showOverlayByDefault && !!selectedImage?.svgOverlay);
  }, [selectedImage, showOverlayByDefault]);

  const currentImageId = currentImage?.id;
  const currentHasOverlay = !!currentImage?.svgOverlay;
  useEffect(() => {
    resetTransform();
    setShowOverlay((prev) => (currentHasOverlay ? prev : false));
  }, [currentImageId, currentHasOverlay, resetTransform]);

  useImagePreloader({ currentImage, images });

  const handleZoomIn = useCallback(() => setZoom(zoom + zoomStep), [setZoom, zoom, zoomStep]);
  const handleZoomOut = useCallback(() => setZoom(zoom - zoomStep), [setZoom, zoom, zoomStep]);

  const handleDoubleClick = useCallback(() => {
    if (!allowZoom) return;
    setZoom(zoom === doubleClickZoom ? 1 : doubleClickZoom);
  }, [allowZoom, doubleClickZoom, setZoom, zoom]);

  const handleRotate = useCallback(
    (direction: 'left' | 'right' = 'right') => {
      if (allowRotate) rotate(direction);
    },
    [allowRotate, rotate],
  );

  const handleReset = useCallback(() => {
    if (allowReset) resetTransform();
  }, [allowReset, resetTransform]);

  const handleDownload = useCallback(async () => {
    if (!allowDownload || !currentImage) return;
    const filename = currentImage.title || currentImage.alt || 'image';
    await downloadImage(currentImage.src, filename, imageRef.current);
  }, [allowDownload, currentImage]);

  const { isDragging, onMouseDown } = useMouseDrag({
    enabled: zoom > 1,
    panX,
    panY,
    onPan: setPan,
  });

  const {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    reset: resetTouchGestures,
  } = useTouchGestures({
    allowZoom,
    zoom,
    panX,
    panY,
    minZoom,
    maxZoom,
    imagesCount: images.length,
    imageContainerRef,
    onZoomTo: zoomTo,
    onPan: setPan,
    onNext: next,
    onPrevious: previous,
  });

  useEffect(() => {
    resetTouchGestures();
  }, [currentImageId, resetTouchGestures]);

  useWheelZoom({
    enabled: allowZoom,
    containerRef,
    imageContainerRef,
    zoom,
    panX,
    panY,
    zoomStep,
    minZoom,
    maxZoom,
    onZoomTo: zoomTo,
  });

  useKeyboardShortcuts({
    enabled: keyboardInteraction,
    handlers: {
      onClose,
      onZoomIn: handleZoomIn,
      onZoomOut: handleZoomOut,
      onRotate: () => handleRotate(),
      onReset: handleReset,
      onNext: next,
      onPrevious: previous,
    },
  });

  useClickOutsideToClose({ enabled: clickOutsideToExit, onClose });

  if (!selectedImage || !currentImage) return null;

  const imageContainerStyle: React.CSSProperties = {
    ...imageContainerBaseStyle,
    cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
  };

  const hasMultipleImages = images.length > 1;
  const canReset = zoom !== 1 || rotationCount % 4 !== 0;

  return (
    <div
      ref={containerRef}
      className="photo-viewer"
      role="dialog"
      aria-modal="true"
      aria-label={currentImage.title || 'Photo viewer'}
      style={backdropStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Navigation
        title={currentImage.title || 'Photo Viewer'}
        onClose={onClose}
        onNext={hasMultipleImages ? next : undefined}
        onPrevious={hasMultipleImages ? previous : undefined}
        onZoomIn={allowZoom ? handleZoomIn : undefined}
        onZoomOut={allowZoom ? handleZoomOut : undefined}
        onRotate={allowRotate ? handleRotate : undefined}
        onReset={canReset ? handleReset : undefined}
        onDownload={allowDownload ? handleDownload : undefined}
        onToggleOverlay={
          showOverlayButton && currentImage.svgOverlay
            ? () => setShowOverlay((prev) => !prev)
            : undefined
        }
        showOverlay={showOverlay}
        showControls={isHovered}
      />

      <div
        ref={imageContainerRef}
        style={imageContainerStyle}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <PhotoViewerImage
          image={currentImage}
          zoom={zoom}
          panX={panX}
          panY={panY}
          rotationCount={rotationCount}
          isDragging={isDragging}
          showOverlay={showOverlay}
          imageRef={imageRef}
          onDoubleClick={handleDoubleClick}
        />
      </div>

      {keyframesStyle}
    </div>
  );
};
