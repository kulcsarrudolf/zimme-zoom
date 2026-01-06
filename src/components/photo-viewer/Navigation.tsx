import React from 'react';
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
  return (
    <>
      <style>
        {`
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
          backgroundColor: showControls ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '1.5rem',
          transition: 'background-color 0.2s ease',
          padding: '0 1.5rem',
          zIndex: 9999,
        }}
      >
        <div className="photo-viewer-navigation-title" style={{ color: 'white', fontSize: '0.9rem' }}>
          {title}
        </div>
        <div className="photo-viewer-navigation-controls" style={{ display: 'flex', gap: '1rem' }}>
          {onReset && <NavigationActionButton icon={ResetIcon} onClick={onReset} />}
          {onPrevious && <NavigationActionButton icon={ArrowIcon} onClick={onPrevious} />}
          {onNext && <NavigationActionButton icon={ArrowIcon} onClick={onNext} transform="rotateY(180deg)" />}
          {onZoomOut && <NavigationActionButton icon={ZoomOutIcon} onClick={onZoomOut} />}
          {onZoomIn && <NavigationActionButton icon={ZoomInIcon} onClick={onZoomIn} />}
          {onRotate && <NavigationActionButton icon={RotateIcon} onClick={() => onRotate('left')} />}
          {onRotate && (
            <NavigationActionButton icon={RotateIcon} onClick={() => onRotate('right')} transform="rotateY(180deg)" />
          )}
          {onToggleOverlay && (
            <NavigationActionButton
              icon={OverlayIcon}
              onClick={onToggleOverlay}
              style={showOverlay ? { backgroundColor: 'rgba(255, 255, 255, 0.2)' } : undefined}
            />
          )}
          {onDownload && (
            <NavigationActionButton
              icon={DownloadIcon}
              onClick={onDownload}
              style={{ width: '20px', height: '20px', marginTop: '-3px' }}
            />
          )}
          {onClose && <NavigationActionButton icon={CloseIcon} onClick={onClose} />}
        </div>
      </div>
    </>
  );
};

export default Navigation;
