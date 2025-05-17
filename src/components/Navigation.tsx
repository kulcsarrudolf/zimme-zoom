import React from "react";
import {
  IconReset,
  IconArrow,
  IconZoomIn,
  IconZoomOut,
  IconRotate,
  IconClose,
} from "./icons";

interface NavigationProps {
  title: string;
  onClose?: (e: any) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onRotate?: () => void;
  onReset?: () => void;
  showControls?: boolean;
  zoom?: number;
  rotation?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  title,
  onClose,
  onZoomIn,
  onZoomOut,
  onRotate,
  onReset,
  showControls = true,
  zoom = 1,
  rotation = 0,
}) => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 30,
        left: "50%",
        transform: "translateX(-50%)",
        width: "60%",
        height: "3rem",
        backgroundColor: showControls
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
    >
      <div style={{ color: "white", fontSize: "0.9rem" }}>{title}</div>
      <div style={{ display: "flex", gap: "1rem" }}>
        {onReset && (
          <div
            style={{
              width: "24px",
              height: "24px",
              backgroundImage: IconReset,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              cursor: "pointer",
            }}
            onClick={onReset}
          />
        )}
        {onZoomOut && (
          <div
            style={{
              width: "24px",
              height: "24px",
              backgroundImage: IconZoomOut,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              cursor: "pointer",
            }}
            onClick={onZoomOut}
          />
        )}
        <div style={{ color: "white", fontSize: "0.9rem" }}>
          {Math.round(zoom * 100)}%
        </div>
        {onZoomIn && (
          <div
            style={{
              width: "24px",
              height: "24px",
              backgroundImage: IconZoomIn,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              cursor: "pointer",
            }}
            onClick={onZoomIn}
          />
        )}
        {onRotate && (
          <div
            style={{
              width: "24px",
              height: "24px",
              backgroundImage: IconRotate,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              cursor: "pointer",
              transform: `rotate(${rotation}deg)`,
            }}
            onClick={onRotate}
          />
        )}
        {onClose && (
          <div
            style={{
              width: "24px",
              height: "24px",
              backgroundImage: IconClose,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              cursor: "pointer",
            }}
            onClick={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default Navigation;
