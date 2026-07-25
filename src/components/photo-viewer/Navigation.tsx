import React, { useState } from 'react';
import type { PhotoViewerLabels } from './types';
import {
  ResetIcon,
  ArrowIcon,
  ZoomInIcon,
  ZoomOutIcon,
  RotateIcon,
  CloseIcon,
  OverlayIcon,
  DownloadIcon,
} from '../../icons';
import NavigationActionButton from './NavigationActionButton';

interface NavigationProps {
  title: string;
  /** Already merged with the defaults by `PhotoViewer`. */
  labels: PhotoViewerLabels;
  onClose?: (e?: React.MouseEvent) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onRotate?: (direction: 'left' | 'right') => void;
  onReset?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onDownload?: () => void;
  onToggleOverlay?: () => void;
  showOverlay?: boolean;
  showControls?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  title,
  labels,
  onClose,
  onZoomIn,
  onZoomOut,
  onRotate,
  onReset,
  onNext,
  onPrevious,
  onDownload,
  onToggleOverlay,
  showOverlay = false,
  showControls = true,
}) => {
  // Tracked in state rather than with `:focus-within`, because the bar's
  // background is an inline style that a stylesheet rule could only beat with
  // `!important`. Without this a keyboard user sees a permanently dimmed bar.
  const [isFocusWithin, setIsFocusWithin] = useState(false);

  return (
    <>
      <style>
        {`
          .nav-action-button {
            appearance: none;
            -webkit-appearance: none;
            border: none;
            background-color: transparent;
            background-image: none;
            margin: 0;
            color: inherit;
            font: inherit;
            line-height: 1;
            text-align: center;
            -webkit-tap-highlight-color: transparent;
          }
          .nav-action-button:hover {
            background-color: rgba(0, 0, 0, 0.05);
          }
          .nav-action-button:hover .nav-action-icon {
            transform: scale(1.2);
          }
          .nav-action-button:focus-visible {
            outline: 2px solid #ffffff;
            outline-offset: 2px;
            background-color: rgba(255, 255, 255, 0.15);
          }
          .nav-action-button:focus:not(:focus-visible) {
            outline: none;
          }
          @media (max-width: 600px) {
            .photo-viewer-navigation {
              flex-direction: column !important;
              height: auto !important;
              padding: 1rem !important;
              gap: 0.75rem !important;
              width: 90% !important;
            }
            .photo-viewer-navigation-title {
              width: 100% !important;
              text-align: center !important;
            }
            .photo-viewer-navigation-controls {
              width: 100% !important;
              justify-content: center !important;
            }
          }
        `}
      </style>
      <div
        className="photo-viewer-navigation"
        style={{
          position: 'fixed',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60%',
          height: '3rem',
          backgroundColor:
            showControls || isFocusWithin ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '1.5rem',
          transition: 'background-color 0.2s ease',
          padding: '0 1.5rem',
          zIndex: 9999,
        }}
        onFocus={() => setIsFocusWithin(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setIsFocusWithin(false);
          }
        }}
      >
        <div
          className="photo-viewer-navigation-title"
          style={{ color: 'white', fontSize: '0.9rem' }}
        >
          {title}
        </div>
        <div
          className="photo-viewer-navigation-controls"
          style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
        >
          {onReset && (
            <NavigationActionButton icon={ResetIcon} label={labels.reset} onClick={onReset} />
          )}
          {onPrevious && (
            <NavigationActionButton icon={ArrowIcon} label={labels.previous} onClick={onPrevious} />
          )}
          {onNext && (
            <NavigationActionButton
              icon={ArrowIcon}
              label={labels.next}
              onClick={onNext}
              transform="rotateY(180deg)"
            />
          )}
          {onZoomOut && (
            <NavigationActionButton icon={ZoomOutIcon} label={labels.zoomOut} onClick={onZoomOut} />
          )}
          {onZoomIn && (
            <NavigationActionButton icon={ZoomInIcon} label={labels.zoomIn} onClick={onZoomIn} />
          )}
          {onRotate && (
            <NavigationActionButton
              icon={RotateIcon}
              label={labels.rotateLeft}
              onClick={() => onRotate('left')}
            />
          )}
          {onRotate && (
            <NavigationActionButton
              icon={RotateIcon}
              label={labels.rotateRight}
              onClick={() => onRotate('right')}
              transform="rotateY(180deg)"
            />
          )}
          {onToggleOverlay && (
            <NavigationActionButton
              icon={OverlayIcon}
              label={labels.toggleOverlay}
              onClick={onToggleOverlay}
              pressed={showOverlay}
              style={showOverlay ? { backgroundColor: 'rgba(255, 255, 255, 0.2)' } : undefined}
            />
          )}
          {onDownload && (
            <NavigationActionButton
              icon={DownloadIcon}
              label={labels.download}
              onClick={onDownload}
            />
          )}
          {onClose && (
            <NavigationActionButton icon={CloseIcon} label={labels.close} onClick={onClose} />
          )}
        </div>
      </div>
    </>
  );
};

export default Navigation;
