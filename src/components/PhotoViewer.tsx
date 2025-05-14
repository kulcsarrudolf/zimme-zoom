import React, { useState, useCallback } from "react";

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

  const handleZoom = useCallback(
    (newZoom: number) => {
      const clampedZoom = Math.min(Math.max(newZoom, minZoom), maxZoom);
      setZoom(clampedZoom);
      onZoomChange?.(clampedZoom);
    },
    [maxZoom, minZoom, onZoomChange]
  );

  return (
    <div
      className={`photo-viewer ${className}`}
      style={{
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          transform: `scale(${zoom})`,
          transformOrigin: "center",
          transition: "transform 0.2s ease-out",
        }}
      />
    </div>
  );
};
