import React, { useState, useCallback, useRef, useEffect } from 'react';
import Navigation from './Navigation';
import ImageOverlay from './ImageOverlay';
import { ZZImage } from '../../types/image.type';
import { downloadImage } from '../../utils/downloadImage';

const DEFAULT_ZOOM_STEP = 0.3;
const DEFAULT_LARGE_ZOOM = 4;

type PhotoViewerSettings = {
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

const defaultSettings: PhotoViewerSettings = {
  allowZoom: true,
  allowRotate: true,
  allowReset: true,
  allowDownload: false,
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
    allowDownload,
    doubleClickZoom,
    clickOutsideToExit,
    keyboardInteraction,
    maxZoom,
    minZoom,
    zoomStep,
    showOverlayByDefault = false,
    showOverlayButton = false,
  } = mergedSettings;

  const [zoom, setZoom] = useState(1);
  const [rotationCount, setRotationCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showOverlay, setShowOverlay] = useState(() => showOverlayByDefault && !!selectedImage?.svgOverlay);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [currentSelectedImage, setCurrentSelectedImage] = useState<ZZImage | null>(selectedImage);

  // Touch gesture state
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTouchDistanceRef = useRef<number | null>(null);
  const initialZoomRef = useRef<number>(1);
  const touchPanStartRef = useRef<{ x: number; y: number } | null>(null);
  const isPinchingRef = useRef<boolean>(false);

  useEffect(() => {
    setCurrentSelectedImage(selectedImage);
    setZoom(1);
    setRotationCount(0);
    // Set overlay state based on showOverlayByDefault setting if image has svgOverlay
    setShowOverlay(showOverlayByDefault && !!selectedImage?.svgOverlay);
    setPanX(0);
    setPanY(0);
    setIsLoading(true);
    // Reset touch state
    touchStartRef.current = null;
    lastTouchDistanceRef.current = null;
    touchPanStartRef.current = null;
    isPinchingRef.current = false;
  }, [selectedImage, showOverlayByDefault]);

  const handleNext = useCallback(() => {
    const currentImageIndex = images.findIndex(img => img.id === currentSelectedImage?.id);

    if (images.length > 0) {
      const nextIndex = (currentImageIndex + 1) % images.length;
      const nextImage = images[nextIndex];
      setCurrentSelectedImage(nextImage);
      setZoom(1);
      setRotationCount(0);
      setShowOverlay(showOverlayByDefault && !!nextImage.svgOverlay);
      setPanX(0);
      setPanY(0);
      setIsLoading(true);
      onImageChange?.(nextImage);
    }
  }, [images, currentSelectedImage, onImageChange, showOverlayByDefault]);

  const handlePrevious = useCallback(() => {
    const currentImageIndex = images.findIndex(img => img.id === currentSelectedImage?.id);
    if (images.length > 0) {
      const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
      const prevImage = images[prevIndex];
      setCurrentSelectedImage(prevImage);
      setZoom(1);
      setRotationCount(0);
      setShowOverlay(showOverlayByDefault && !!prevImage.svgOverlay);
      setPanX(0);
      setPanY(0);
      setIsLoading(true);
      onImageChange?.(prevImage);
    }
  }, [images, currentSelectedImage, onImageChange, showOverlayByDefault]);

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

  const handleDownload = useCallback(async () => {
    if (!allowDownload || !currentSelectedImage) return;

    const filename = currentSelectedImage.title || currentSelectedImage.alt || 'image';
    await downloadImage(currentSelectedImage.src, filename, imageRef.current);
  }, [allowDownload, currentSelectedImage]);

  const handleDoubleClick = useCallback(() => {
    if (allowZoom) {
      handleZoom(zoom === doubleClickZoom ? 1 : doubleClickZoom);
    }
  }, [allowZoom, doubleClickZoom, handleZoom, zoom]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!allowZoom) return;
      e.preventDefault();

      const container = containerRef.current;
      const imageContainer = imageContainerRef.current;
      if (!container || !imageContainer) return;

      const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
      const newZoom = Math.min(Math.max(zoom + delta, minZoom), maxZoom);

      // Calculate mouse position relative to container center
      const containerRect = imageContainer.getBoundingClientRect();
      const containerCenterX = containerRect.left + containerRect.width / 2;
      const containerCenterY = containerRect.top + containerRect.height / 2;

      const mouseX = e.clientX - containerCenterX;
      const mouseY = e.clientY - containerCenterY;

      // Calculate the point on the image (before zoom change)
      // Account for current pan and zoom
      const imageX = (mouseX - panX) / zoom;
      const imageY = (mouseY - panY) / zoom;

      // Calculate new pan to keep the same point under the mouse after zoom
      const newPanX = mouseX - imageX * newZoom;
      const newPanY = mouseY - imageY * newZoom;

      setZoom(newZoom);
      // Reset pan when zooming back to 1
      if (newZoom === 1) {
        setPanX(0);
        setPanY(0);
      } else {
        setPanX(newPanX);
        setPanY(newPanY);
      }
    },
    [allowZoom, zoom, zoomStep, minZoom, maxZoom, panX, panY]
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

  // Calculate distance between two touches
  const getTouchDistance = (touch1: React.Touch | Touch, touch2: React.Touch | Touch): number => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!allowZoom && !images.length) return;

      const touches = e.touches;

      if (touches.length === 1) {
        // Single touch - prepare for swipe or pan
        const touch = touches[0];
        touchStartRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          time: Date.now(),
        };

        if (zoom > 1) {
          // Prepare for pan
          touchPanStartRef.current = { x: touch.clientX - panX, y: touch.clientY - panY };
        }
      } else if (touches.length === 2 && allowZoom) {
        // Two touches - prepare for pinch zoom
        e.preventDefault();
        isPinchingRef.current = true;
        lastTouchDistanceRef.current = getTouchDistance(touches[0], touches[1]);
        initialZoomRef.current = zoom;
      }
    },
    [allowZoom, zoom, panX, panY, images.length]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touches = e.touches;
      const imageContainer = imageContainerRef.current;
      if (!imageContainer) return;

      if (touches.length === 2 && allowZoom && isPinchingRef.current) {
        // Pinch zoom
        e.preventDefault();
        const distance = getTouchDistance(touches[0], touches[1]);

        if (lastTouchDistanceRef.current !== null) {
          const scale = distance / lastTouchDistanceRef.current;
          const newZoom = Math.min(Math.max(zoom * scale, minZoom), maxZoom);

          // Calculate center point between the two touches
          const centerX = (touches[0].clientX + touches[1].clientX) / 2;
          const centerY = (touches[0].clientY + touches[1].clientY) / 2;

          const containerRect = imageContainer.getBoundingClientRect();
          const containerCenterX = containerRect.left + containerRect.width / 2;
          const containerCenterY = containerRect.top + containerRect.height / 2;

          const mouseX = centerX - containerCenterX;
          const mouseY = centerY - containerCenterY;

          const imageX = (mouseX - panX) / zoom;
          const imageY = (mouseY - panY) / zoom;

          const newPanX = mouseX - imageX * newZoom;
          const newPanY = mouseY - imageY * newZoom;

          setZoom(newZoom);
          if (newZoom === 1) {
            setPanX(0);
            setPanY(0);
          } else {
            setPanX(newPanX);
            setPanY(newPanY);
          }

          // Update distance for next move
          lastTouchDistanceRef.current = distance;
        }
      } else if (touches.length === 1 && zoom > 1 && touchPanStartRef.current) {
        // Single touch pan when zoomed
        e.preventDefault();
        const touch = touches[0];
        const newPanX = touch.clientX - touchPanStartRef.current.x;
        const newPanY = touch.clientY - touchPanStartRef.current.y;
        setPanX(newPanX);
        setPanY(newPanY);
      }
    },
    [allowZoom, zoom, minZoom, maxZoom, panX, panY]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const touches = e.touches;

      if (touches.length === 0 || touches.length === 1) {
        // All fingers lifted or only one remaining
        if (isPinchingRef.current) {
          isPinchingRef.current = false;
          lastTouchDistanceRef.current = null;
          return;
        }

        if (touchStartRef.current && zoom === 1 && images.length > 1) {
          // Check for swipe gesture
          const touch = e.changedTouches[0];
          const deltaX = touch.clientX - touchStartRef.current.x;
          const deltaY = touch.clientY - touchStartRef.current.y;
          const deltaTime = Date.now() - touchStartRef.current.time;

          // Swipe threshold: at least 50px horizontal movement, less than 300ms, and more horizontal than vertical
          const minSwipeDistance = 50;
          const maxSwipeTime = 300;

          if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaX) > Math.abs(deltaY) && deltaTime < maxSwipeTime) {
            if (deltaX > 0) {
              // Swipe right - go to previous
              handlePrevious();
            } else {
              // Swipe left - go to next
              handleNext();
            }
          }
        }

        touchStartRef.current = null;
        touchPanStartRef.current = null;
      }
    },
    [zoom, images.length, handleNext, handlePrevious]
  );

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

  // Preload adjacent images
  useEffect(() => {
    if (!currentSelectedImage || images.length <= 1) return;

    const currentIndex = images.findIndex(img => img.id === currentSelectedImage.id);
    const nextImage = images[(currentIndex + 1) % images.length];
    const prevImage = images[(currentIndex - 1 + images.length) % images.length];

    // Preload adjacent images
    [nextImage, prevImage].forEach(img => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = img.src;
      document.head.appendChild(link);
    });
  }, [currentSelectedImage, images]);

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
        onReset={zoom !== 1 || rotationCount % 4 !== 0 ? handleReset : undefined}
        onDownload={allowDownload ? handleDownload : undefined}
        onToggleOverlay={
          showOverlayButton && currentSelectedImage?.svgOverlay ? () => setShowOverlay(!showOverlay) : undefined
        }
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
          touchAction: 'none',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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
          {isLoading && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: '#f0f0f0',
                animation: 'pulse 1.5s infinite',
                zIndex: 1,
              }}
            />
          )}
          <img
            ref={imageRef}
            src={currentSelectedImage?.src}
            alt={currentSelectedImage?.alt || ''}
            onDoubleClick={handleDoubleClick}
            onLoad={() => setIsLoading(false)}
            draggable={false}
            style={{
              maxWidth: '80vw',
              maxHeight: '80vh',
              objectFit: 'contain',
              display: 'block',
              userSelect: 'none',
              opacity: isLoading ? 0 : 1,
              transition: 'opacity 0.3s ease',
              position: 'relative',
              zIndex: 2,
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
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 0.8; }
            100% { opacity: 0.6; }
          }
        `}
      </style>
    </div>
  );
};
