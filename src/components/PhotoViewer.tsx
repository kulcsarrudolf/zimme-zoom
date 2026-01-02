import React, { useState, useCallback, useRef, useEffect } from 'react';
import Navigation from './Navigation';
import ImageOverlay from './ImageOverlay';
import { ZZImage } from '../types/image.type';

const DEFAULT_ZOOM_STEP = 0.3;
const DEFAULT_LARGE_ZOOM = 4;

type PhotoViewerSettings = {
  allowZoom: boolean;
  allowRotate: boolean;
  allowReset: boolean;
  doubleClickZoom: number;
  clickOutsideToExit: boolean;
  keyboardInteraction: boolean;
  maxZoom: number;
  minZoom: number;
  zoomStep: number;
};

const defaultSettings: PhotoViewerSettings = {
  allowZoom: true,
  allowRotate: true,
  allowReset: true,
  doubleClickZoom: DEFAULT_LARGE_ZOOM,
  clickOutsideToExit: true,
  keyboardInteraction: true,
  maxZoom: 4,
  minZoom: 0.5,
  zoomStep: DEFAULT_ZOOM_STEP,
};

export type PhotoViewerProps = {
  selectedImage: ZZImage | null;
  images: ZZImage[];
  onClose: () => void;
  onImageChange?: (image: ZZImage) => void;
  settings?: Partial<PhotoViewerSettings>;
};

export const PhotoViewer: React.FC<PhotoViewerProps> = ({
  selectedImage,
  images,
  onClose,
  onImageChange,
  settings = {},
}) => {
  const mergedSettings = { ...defaultSettings, ...settings };
  const {
    allowZoom,
    allowRotate,
    allowReset,
    doubleClickZoom,
    clickOutsideToExit,
    keyboardInteraction,
    maxZoom,
    minZoom,
    zoomStep,
  } = mergedSettings;

  const [zoom, setZoom] = useState(1);
  const [rotationCount, setRotationCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [currentSelectedImage, setCurrentSelectedImage] = useState<ZZImage | null>(selectedImage);

  useEffect(() => {
    setCurrentSelectedImage(selectedImage);
    setZoom(1);
    setRotationCount(0);
    setShowOverlay(false);
    setPanX(0);
    setPanY(0);
  }, [selectedImage]);

  const handleNext = useCallback(() => {
    const currentImageIndex = images.findIndex(img => img.id === currentSelectedImage?.id);

    if (images.length > 0) {
      const nextIndex = (currentImageIndex + 1) % images.length;
      const nextImage = images[nextIndex];
      setCurrentSelectedImage(nextImage);
      setZoom(1);
      setRotationCount(0);
      setShowOverlay(false);
      setPanX(0);
      setPanY(0);
      onImageChange?.(nextImage);
    }
  }, [images, currentSelectedImage, onImageChange]);

  const handlePrevious = useCallback(() => {
    const currentImageIndex = images.findIndex(img => img.id === currentSelectedImage?.id);
    if (images.length > 0) {
      const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
      const prevImage = images[prevIndex];
      setCurrentSelectedImage(prevImage);
      setZoom(1);
      setRotationCount(0);
      setShowOverlay(false);
      setPanX(0);
      setPanY(0);
      onImageChange?.(prevImage);
    }
  }, [images, currentSelectedImage, onImageChange]);

  const handleZoom = useCallback(
    (newZoom: number) => {
      const clampedZoom = Math.min(Math.max(newZoom, minZoom), maxZoom);
      setZoom(clampedZoom);
      // Reset pan when zooming back to 1
      if (clampedZoom === 1) {
        setPanX(0);
        setPanY(0);
      }
    },
    [maxZoom, minZoom]
  );

  const handleRotate = useCallback(
    (direction: 'left' | 'right' = 'right') => {
      if (allowRotate) {
        setRotationCount(prev => prev + (direction === 'left' ? -1 : 1));
      }
    },
    [allowRotate]
  );

  const handleReset = useCallback(() => {
    if (allowReset) {
      setZoom(1);
      setRotationCount(0);
      setPanX(0);
      setPanY(0);
    }
  }, [allowReset]);

  const handleDoubleClick = useCallback(() => {
    if (allowZoom) {
      handleZoom(zoom === doubleClickZoom ? 1 : doubleClickZoom);
    }
  }, [allowZoom, doubleClickZoom, handleZoom, zoom]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!allowZoom) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
      handleZoom(zoom + delta);
    },
    [allowZoom, handleZoom, zoom, zoomStep]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!keyboardInteraction) return;
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case '+':
        case '=':
          handleZoom(zoom + zoomStep);
          break;
        case '-':
          handleZoom(zoom - zoomStep);
          break;
        case 'r':
          handleRotate();
          break;
        case '0':
          handleReset();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
      }
    },
    [handleZoom, handleRotate, handleReset, handleNext, handlePrevious, keyboardInteraction, onClose, zoom, zoomStep]
  );

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (
        clickOutsideToExit &&
        containerRef.current &&
        !(e.target as HTMLElement).closest('.photo-viewer img') &&
        !(e.target as HTMLElement).closest('.photo-viewer-navigation') &&
        !(e.target as HTMLElement).closest('.nav-action-button')
      ) {
        onClose();
      }
    },
    [clickOutsideToExit, onClose]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only allow panning when zoomed in, and only on left mouse button
      if (zoom > 1 && e.button === 0) {
        e.preventDefault();
        setIsDragging(true);
        setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
      }
    },
    [zoom, panX, panY]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      if (isDragging && zoom > 1) {
        e.preventDefault();
        const newPanX = e.clientX - dragStart.x;
        const newPanY = e.clientY - dragStart.y;
        setPanX(newPanX);
        setPanY(newPanY);
      }
    },
    [isDragging, zoom, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => handleMouseMove(e);
      const handleGlobalMouseUp = () => handleMouseUp();

      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleClickOutside);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleWheel, handleKeyDown, handleClickOutside]);

  if (!selectedImage) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="photo-viewer"
      style={{
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
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Navigation
        title={currentSelectedImage?.title || 'Photo Viewer'}
        onClose={onClose}
        onNext={images.length > 1 ? handleNext : undefined}
        onPrevious={images.length > 1 ? handlePrevious : undefined}
        onZoomIn={allowZoom ? () => handleZoom(zoom + zoomStep) : undefined}
        onZoomOut={allowZoom ? () => handleZoom(zoom - zoomStep) : undefined}
        onRotate={allowRotate ? handleRotate : undefined}
        onReset={zoom !== 1 || rotationCount !== 0 ? handleReset : undefined}
        onToggleOverlay={currentSelectedImage?.svgOverlay ? () => setShowOverlay(!showOverlay) : undefined}
        showOverlay={showOverlay}
        showControls={isHovered}
      />

      <div
        ref={imageContainerRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          style={{
            position: 'relative',
            transform: `translate(${panX}px, ${panY}px) rotateZ(${rotationCount * 90}deg) scale(${zoom})`,
            transformOrigin: 'center',
            transition: isDragging ? 'none' : 'transform 0.2s ease',
            display: 'inline-block',
          }}
        >
          <img
            ref={imageRef}
            src={currentSelectedImage?.src}
            alt={currentSelectedImage?.alt || ''}
            onDoubleClick={handleDoubleClick}
            draggable={false}
            style={{
              maxWidth: '80vw',
              maxHeight: '80vh',
              objectFit: 'contain',
              display: 'block',
              userSelect: 'none',
            }}
          />
          {showOverlay && currentSelectedImage?.svgOverlay && (
            <ImageOverlay
              overlay={currentSelectedImage.svgOverlay}
              position={currentSelectedImage.overlayPosition}
              size={currentSelectedImage.overlaySize}
            />
          )}
        </div>
      </div>
    </div>
  );
};
