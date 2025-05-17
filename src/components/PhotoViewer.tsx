import React, { useState, useCallback } from "react";
import Navigation from "./Navigation";

export interface PhotoViewerProps {
  src: string;
  alt?: string;
  initialZoom?: number;
  maxZoom?: number;
  minZoom?: number;
  onZoomChange?: (zoom: number) => void;
  className?: string;
  style?: React.CSSProperties;
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
}) => {
  const [zoom, setZoom] = useState(initialZoom);
  const [isHovered, setIsHovered] = useState(false);

  const handleZoom = useCallback(
    (newZoom: number) => {
      const clampedZoom = Math.min(Math.max(newZoom, minZoom), maxZoom);
      setZoom(clampedZoom);
      onZoomChange?.(clampedZoom);
    },
    [maxZoom, minZoom, onZoomChange]
  );

  return (
    <>
      <Navigation title="Photo Viewer" />
      <div className={`photo-viewer ${className}`}>
        <img
          src={src}
          alt={alt}
          style={{
            width: "50%",
            height: "50%",
            objectFit: "contain",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
    </>
  );
};
