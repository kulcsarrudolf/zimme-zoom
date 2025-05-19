import React, { useState, useCallback, useRef, useEffect } from "react";
import Navigation from "./Navigation";

const DEFAULT_ZOOM_STEP = 0.3;
const DEFAULT_LARGE_ZOOM = 4;

export interface PhotoViewerProps {
  src: string;
  alt?: string;
  initialZoom?: number;
  maxZoom?: number;
  minZoom?: number;
  onZoomChange?: (zoom: number) => void;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  zoomStep?: number;
  allowZoom?: boolean;
  allowRotate?: boolean;
  allowReset?: boolean;
  doubleClickZoom?: number;
  clickOutsideToExit?: boolean;
  keyboardInteraction?: boolean;
  onClose?: (e: any) => void;
  svgOverlay?: React.ReactNode;
  images?: string[];
  currentImageIndex?: number;
  onImageChange?: (index: number) => void;
}

export const PhotoViewer: React.FC<PhotoViewerProps> = ({
  src,
  alt = "",
  initialZoom = 1,
  maxZoom = 3,
  minZoom = 0.5,
  onZoomChange,
  className = "",
  style = {},
  title,
  zoomStep = DEFAULT_ZOOM_STEP,
  allowZoom = true,
  allowRotate = true,
  allowReset = true,
  doubleClickZoom = DEFAULT_LARGE_ZOOM,
  clickOutsideToExit = true,
  keyboardInteraction = true,
  onClose,
  svgOverlay,
  images = [],
  currentImageIndex = 0,
  onImageChange,
}) => {
  const [zoom, setZoom] = useState(initialZoom);
  const [rotation, setRotation] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleNext = useCallback(() => {
    if (images.length > 0 && onImageChange) {
      const nextIndex = (currentImageIndex + 1) % images.length;
      onImageChange(nextIndex);
    }
  }, [images, currentImageIndex, onImageChange]);

  const handlePrevious = useCallback(() => {
    if (images.length > 0 && onImageChange) {
      const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
      onImageChange(prevIndex);
    }
  }, [images, currentImageIndex, onImageChange]);

  const handleZoom = useCallback(
    (newZoom: number) => {
      const clampedZoom = Math.min(Math.max(newZoom, minZoom), maxZoom);
      setZoom(clampedZoom);
      onZoomChange?.(clampedZoom);
    },
    [maxZoom, minZoom, onZoomChange]
  );

  const handleRotate = useCallback(
    (direction: "left" | "right" = "right") => {
      if (allowRotate) {
        setRotation((prev) =>
          direction === "left" ? (prev - 90 + 360) % 360 : (prev + 90) % 360
        );
      }
    },
    [allowRotate]
  );

  const handleReset = useCallback(() => {
    if (allowReset) {
      setZoom(1);
      setRotation(0);
    }
  }, [allowReset, initialZoom]);

  const handleDoubleClick = useCallback(() => {
    if (allowZoom) {
      handleZoom(zoom === doubleClickZoom ? initialZoom : doubleClickZoom);
    }
  }, [allowZoom, doubleClickZoom, handleZoom, initialZoom, zoom]);

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
        case "Escape":
          onClose?.(e);
          break;
        case "+":
        case "=":
          handleZoom(zoom + zoomStep);
          break;
        case "-":
          handleZoom(zoom - zoomStep);
          break;
        case "r":
          handleRotate();
          break;
        case "0":
          handleReset();
          break;
        case "ArrowRight":
          handleNext();
          break;
        case "ArrowLeft":
          handlePrevious();
          break;
      }
    },
    [
      handleZoom,
      handleRotate,
      handleReset,
      handleNext,
      handlePrevious,
      keyboardInteraction,
      onClose,
      zoom,
      zoomStep,
    ]
  );

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (
        clickOutsideToExit &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose?.(e);
      }
    },
    [clickOutsideToExit, onClose]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleWheel, handleKeyDown, handleClickOutside]);

  return (
    <div
      ref={containerRef}
      className={`photo-viewer ${className}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        ...style,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Navigation
        title={title || "Photo Viewer"}
        onClose={onClose}
        onNext={images.length > 0 ? handleNext : undefined}
        onPrevious={images.length > 0 ? handlePrevious : undefined}
        onZoomIn={() => allowZoom && handleZoom(zoom + zoomStep)}
        onZoomOut={() => allowZoom && handleZoom(zoom - zoomStep)}
        onRotate={handleRotate}
        onReset={handleReset}
        showControls={isHovered}
        zoom={zoom}
        rotation={rotation}
      />
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          onDoubleClick={handleDoubleClick}
          style={{
            maxWidth: "90%",
            maxHeight: "90%",
            objectFit: "contain",
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transformOrigin: "center",
            transition: "transform 0.2s ease-out",
            cursor: allowZoom ? "zoom-in" : "default",
          }}
        />
        {svgOverlay && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: "none",
            }}
          >
            {svgOverlay}
          </div>
        )}
      </div>
    </div>
  );
};
