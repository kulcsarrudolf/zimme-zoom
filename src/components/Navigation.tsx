import React, { useState } from "react";
import {
  IconReset,
  IconArrow,
  IconZoomIn,
  IconZoomOut,
  IconRotate,
  IconClose,
} from "./icons";

export const Navigation = ({ title }: { title: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [initialZoom, setInitialZoom] = useState(1);
  const [zoom, setZoom] = useState(1);

  const handleZoom = (zoom: number) => {
    setZoom(zoom);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 30,
        left: "50%",
        transform: "translateX(-50%)",
        width: "60%",
        height: "3rem",
        backgroundColor: isHovered
          ? "rgba(0, 0, 0, 0.8)"
          : "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: "1.5rem",
        transition: "background-color 0.2s ease",
        cursor: "pointer",
        padding: "0 1.5rem",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ color: "white", fontSize: "0.9rem" }}>{title}</div>
      <div style={{ display: "flex", gap: "1.5rem" }}>
        <div
          style={{
            width: "24px",
            height: "24px",
            backgroundImage: IconReset,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            cursor: "pointer",
          }}
          onClick={() => handleZoom(initialZoom)}
        />
        <div
          style={{
            width: "24px",
            height: "24px",
            backgroundImage: IconArrow,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            cursor: "pointer",
          }}
        />
        <div
          style={{
            width: "24px",
            height: "24px",
            backgroundImage: IconArrow,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            cursor: "pointer",
            transform: "rotate(180deg)",
          }}
        />
        <div
          style={{
            width: "24px",
            height: "24px",
            backgroundImage: IconZoomIn,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            cursor: "pointer",
          }}
          onClick={() => handleZoom(zoom + 0.1)}
        />
        <div
          style={{
            width: "24px",
            height: "24px",
            backgroundImage: IconZoomOut,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            cursor: "pointer",
          }}
          onClick={() => handleZoom(zoom - 0.1)}
        />
        <div
          style={{
            width: "24px",
            height: "24px",
            backgroundImage: IconRotate,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            cursor: "pointer",
          }}
        />
        <div
          style={{
            width: "24px",
            height: "24px",
            backgroundImage: IconRotate,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            cursor: "pointer",
            transform: "rotateY(180deg)",
          }}
        />
        <div
          style={{
            width: "24px",
            height: "24px",
            backgroundImage: IconClose,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            cursor: "pointer",
          }}
        />
      </div>
    </div>
  );
};

export default Navigation;
