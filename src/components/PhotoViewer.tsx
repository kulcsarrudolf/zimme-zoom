import React, { useState, useCallback, useRef, useEffect } from "react";
import Navigation from "./Navigation";
import { ZZImage } from "..";

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
  if (!selectedImage) {
    return null;
  }

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
  const [rotation, setRotation] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [currentSelectedImage, setCurrentSelectedImage] =
    useState<ZZImage | null>(selectedImage);

  const handleNext = useCallback(() => {
    const currentImageIndex = images.findIndex(
      (img) => img.id === currentSelectedImage?.id
    );

    if (images.length > 0) {
      const nextIndex = (currentImageIndex + 1) % images.length;
      const nextImage = images[nextIndex];

      setCurrentSelectedImage(nextImage);
      if (onImageChange) {
        onImageChange(nextImage);
      }
    }
  }, [images, currentSelectedImage, onImageChange]);

  const handlePrevious = useCallback(() => {
    const currentImageIndex = images.findIndex(
      (img) => img.id === currentSelectedImage?.id
    );

    if (images.length > 0) {
      const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
      const prevImage = images[prevIndex];
      setCurrentSelectedImage(prevImage);
      if (onImageChange) {
        onImageChange(prevImage);
      }
    }
  }, [images, currentSelectedImage, onImageChange]);

  const handleZoom = useCallback(
    (newZoom: number) => {
      const clampedZoom = Math.min(Math.max(newZoom, minZoom), maxZoom);
      setZoom(clampedZoom);
    },
    [maxZoom, minZoom]
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
        case "Escape":
          onClose();
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
        onClose();
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
      className="photo-viewer"
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
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Navigation
        title={selectedImage.title || "Photo Viewer"}
        onClose={onClose}
        onNext={images.length > 0 ? handleNext : undefined}
        onPrevious={images.length > 0 ? handlePrevious : undefined}
        onZoomIn={() => allowZoom && handleZoom(zoom + zoomStep)}
        onZoomOut={() => allowZoom && handleZoom(zoom - zoomStep)}
        onRotate={handleRotate}
        onReset={handleReset}
        showControls={isHovered}
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
          src={currentSelectedImage?.src}
          alt={currentSelectedImage?.alt || ""}
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
      </div>
    </div>
  );
};
