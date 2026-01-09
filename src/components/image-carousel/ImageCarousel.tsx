import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { ZZImage } from '../../types/image.type';

export type ImageCarouselProps = {
  images: ZZImage[];
  initialIndex?: number;
  onImageChange?: (image: ZZImage, index: number) => void;
  onImageClick?: (image: ZZImage, index: number) => void;
  height?: string | number;
  showIndicators?: boolean;
  showArrows?: boolean;
  preloadCount?: number;
};

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  initialIndex = 0,
  onImageChange,
  onImageClick,
  height = 300,
  showIndicators = true,
  showArrows = true,
  preloadCount = 1,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const hasMovedRef = useRef(false);

  // Track which images should be loaded
  const loadedIndices = useMemo(() => {
    const indices = new Set<number>();
    for (let i = -preloadCount; i <= preloadCount; i++) {
      const index = currentIndex + i;
      if (index >= 0 && index < images.length) {
        indices.add(index);
      }
    }
    return indices;
  }, [currentIndex, preloadCount, images.length]);

  const goToIndex = useCallback(
    (index: number, animate = true) => {
      const clampedIndex = Math.max(0, Math.min(images.length - 1, index));
      if (clampedIndex !== currentIndex) {
        if (animate) {
          setIsAnimating(true);
        }
        setCurrentIndex(clampedIndex);
        onImageChange?.(images[clampedIndex], clampedIndex);
      }
    },
    [currentIndex, images, onImageChange]
  );

  const goToNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      goToIndex(currentIndex + 1);
    }
  }, [currentIndex, images.length, goToIndex]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      goToIndex(currentIndex - 1);
    }
  }, [currentIndex, goToIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious]);

  // Mouse drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    dragStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    hasMovedRef.current = false;
    setIsDragging(true);
    setDragOffset(0);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !dragStartRef.current) return;
      const deltaX = e.clientX - dragStartRef.current.x;
      if (Math.abs(deltaX) > 5) {
        hasMovedRef.current = true;
      }
      setDragOffset(deltaX);
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !dragStartRef.current) return;

      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaTime = Date.now() - dragStartRef.current.time;
      const containerWidth = containerRef.current?.offsetWidth || 0;

      // Determine if it's a swipe
      const minSwipeDistance = containerWidth * 0.2;
      const isQuickSwipe = deltaTime < 300 && Math.abs(deltaX) > 50;

      if (isQuickSwipe || Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          goToPrevious();
        } else {
          goToNext();
        }
      }

      setIsDragging(false);
      setDragOffset(0);
      dragStartRef.current = null;
    },
    [isDragging, goToNext, goToPrevious]
  );

  // Touch drag handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    dragStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    hasMovedRef.current = false;
    setIsDragging(true);
    setDragOffset(0);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || !dragStartRef.current) return;
      const touch = e.touches[0];
      const deltaX = touch.clientX - dragStartRef.current.x;
      const deltaY = touch.clientY - dragStartRef.current.y;

      // Only prevent default if horizontal movement is greater than vertical
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        e.preventDefault();
      }

      if (Math.abs(deltaX) > 5) {
        hasMovedRef.current = true;
      }
      setDragOffset(deltaX);
    },
    [isDragging]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || !dragStartRef.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - dragStartRef.current.x;
      const deltaTime = Date.now() - dragStartRef.current.time;
      const containerWidth = containerRef.current?.offsetWidth || 0;

      // Determine if it's a swipe
      const minSwipeDistance = containerWidth * 0.2;
      const isQuickSwipe = deltaTime < 300 && Math.abs(deltaX) > 50;

      if (isQuickSwipe || Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          goToPrevious();
        } else {
          goToNext();
        }
      }

      setIsDragging(false);
      setDragOffset(0);
      dragStartRef.current = null;
    },
    [isDragging, goToNext, goToPrevious]
  );

  // Add global mouse event listeners for drag
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleImageClick = useCallback(
    (image: ZZImage, index: number) => {
      if (!hasMovedRef.current) {
        onImageClick?.(image, index);
      }
    },
    [onImageClick]
  );

  const handleTransitionEnd = useCallback(() => {
    setIsAnimating(false);
  }, []);

  // Handle single image case
  if (images.length === 0) {
    return null;
  }

  if (images.length === 1) {
    const image = images[0];
    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: typeof height === 'number' ? `${height}px` : height,
          overflow: 'hidden',
        }}
      >
        <img
          src={image.src}
          alt={image.alt || ''}
          onClick={() => onImageClick?.(image, 0)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            cursor: onImageClick ? 'pointer' : 'default',
          }}
        />
      </div>
    );
  }

  const containerWidth = containerRef.current?.offsetWidth || 0;
  const translateX = -currentIndex * containerWidth + dragOffset;

  // Add resistance at edges
  const resistedTranslateX = (() => {
    if (currentIndex === 0 && dragOffset > 0) {
      return -currentIndex * containerWidth + dragOffset * 0.3;
    }
    if (currentIndex === images.length - 1 && dragOffset < 0) {
      return -currentIndex * containerWidth + dragOffset * 0.3;
    }
    return translateX;
  })();

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: typeof height === 'number' ? `${height}px` : height,
        overflow: 'hidden',
        touchAction: 'pan-y pinch-zoom',
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Images container */}
      <div
        style={{
          display: 'flex',
          height: '100%',
          transform: `translateX(${resistedTranslateX}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          willChange: 'transform',
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {images.map((image, index) => (
          <div
            key={image.id}
            style={{
              flexShrink: 0,
              width: containerWidth || '100%',
              height: '100%',
              position: 'relative',
            }}
          >
            {loadedIndices.has(index) ? (
              <img
                src={image.src}
                alt={image.alt || ''}
                onClick={() => handleImageClick(image, index)}
                draggable={false}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  cursor: onImageClick ? 'pointer' : 'default',
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#e0e0e0',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {showArrows && (
        <>
          {currentIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              aria-label="Previous image"
              style={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                zIndex: 10,
              }}
            >
              ‹
            </button>
          )}
          {currentIndex < images.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              aria-label="Next image"
              style={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                zIndex: 10,
              }}
            >
              ›
            </button>
          )}
        </>
      )}

      {/* Dot indicators */}
      {showIndicators && (
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 8,
            zIndex: 10,
          }}
        >
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                goToIndex(index);
              }}
              aria-label={`Go to image ${index + 1}`}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                border: 'none',
                backgroundColor: index === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                padding: 0,
                transition: 'background-color 0.2s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
