import React from "react";
import {
  IconReset,
  IconArrow,
  IconZoomIn,
  IconZoomOut,
  IconRotate,
  IconClose,
} from "./icons";
import NavigationActionButton from "./NavigationActionButton";

interface NavigationProps {
  title: string;
  onClose?: (e: any) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onRotate?: (direction: "left" | "right") => void;
  onReset?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  showControls?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  title,
  onClose,
  onZoomIn,
  onZoomOut,
  onRotate,
  onReset,
  onNext,
  onPrevious,
  showControls = true,
}) => {
  return (
    <div
      className="photo-viewer-navigation"
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
        padding: "0 1.5rem",
        zIndex: 9999,
      }}
    >
      <div style={{ color: "white", fontSize: "0.9rem" }}>{title}</div>
      <div style={{ display: "flex", gap: "1rem" }}>
        {onReset && (
          <NavigationActionButton icon={IconReset} onClick={onReset} />
        )}
        {onPrevious && (
          <NavigationActionButton icon={IconArrow} onClick={onPrevious} />
        )}
        {onNext && (
          <NavigationActionButton
            icon={IconArrow}
            onClick={onNext}
            transform="rotateY(180deg)"
          />
        )}
        {onZoomOut && (
          <NavigationActionButton icon={IconZoomOut} onClick={onZoomOut} />
        )}
        {onZoomIn && (
          <NavigationActionButton icon={IconZoomIn} onClick={onZoomIn} />
        )}
        {onRotate && (
          <NavigationActionButton
            icon={IconRotate}
            onClick={() => onRotate("left")}
          />
        )}
        {onRotate && (
          <NavigationActionButton
            icon={IconRotate}
            onClick={() => onRotate("right")}
            transform="rotateY(180deg)"
          />
        )}
        {onClose && (
          <NavigationActionButton
            icon={IconClose}
            onClick={(e) => {
              onClose(e);
              console.log("clicked");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Navigation;
