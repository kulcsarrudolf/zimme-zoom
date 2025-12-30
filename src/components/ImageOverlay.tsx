import React from 'react';
import { OverlayPosition, OverlaySize } from '../types/image.type';

interface ImageOverlayProps {
  overlay: React.ReactNode | string; // Can be a React component or a URL string
  position?: OverlayPosition;
  size?: OverlaySize;
}

export const ImageOverlay: React.FC<ImageOverlayProps> = ({ overlay, position = 'center', size = {} }) => {
  // Calculate position styles
  const getPositionStyles = (pos: OverlayPosition): React.CSSProperties => {
    const styles: React.CSSProperties = {};

    switch (pos) {
      case 'center':
        styles.top = '50%';
        styles.left = '50%';
        styles.transform = 'translate(-50%, -50%)';
        styles.display = 'flex';
        styles.alignItems = 'center';
        styles.justifyContent = 'center';
        break;
      case 'top-left':
        styles.top = 0;
        styles.left = 0;
        break;
      case 'top-right':
        styles.top = 0;
        styles.right = 0;
        break;
      case 'bottom-left':
        styles.bottom = 0;
        styles.left = 0;
        break;
      case 'bottom-right':
        styles.bottom = 0;
        styles.right = 0;
        break;
      case 'top':
        styles.top = 0;
        styles.left = '50%';
        styles.transform = 'translateX(-50%)';
        break;
      case 'bottom':
        styles.bottom = 0;
        styles.left = '50%';
        styles.transform = 'translateX(-50%)';
        break;
      case 'left':
        styles.top = '50%';
        styles.left = 0;
        styles.transform = 'translateY(-50%)';
        break;
      case 'right':
        styles.top = '50%';
        styles.right = 0;
        styles.transform = 'translateY(-50%)';
        break;
    }

    return styles;
  };

  // Calculate size styles
  const getSizeStyles = (): React.CSSProperties => {
    const sizeStyles: React.CSSProperties = {};

    if (size.maxWidth !== undefined) {
      sizeStyles.maxWidth = typeof size.maxWidth === 'number' ? `${size.maxWidth}px` : size.maxWidth;
    }

    if (size.maxHeight !== undefined) {
      sizeStyles.maxHeight = typeof size.maxHeight === 'number' ? `${size.maxHeight}px` : size.maxHeight;
    }

    if (size.width !== undefined) {
      sizeStyles.width = typeof size.width === 'number' ? `${size.width}px` : size.width;
    }

    if (size.height !== undefined) {
      sizeStyles.height = typeof size.height === 'number' ? `${size.height}px` : size.height;
    }

    // Keep aspect ratio if only one dimension is specified
    if (size.width && !size.height) {
      sizeStyles.height = 'auto';
    } else if (size.height && !size.width) {
      sizeStyles.width = 'auto';
    }

    // If maxWidth or maxHeight is set, ensure aspect ratio is maintained
    if (size.maxWidth && !size.maxHeight && !size.width && !size.height) {
      sizeStyles.height = 'auto';
    } else if (size.maxHeight && !size.maxWidth && !size.width && !size.height) {
      sizeStyles.width = 'auto';
    }

    return sizeStyles;
  };

  const positionStyles = getPositionStyles(position);
  const sizeStyles = getSizeStyles();

  // If no size is specified, assume the overlay should cover the full image
  const hasSizeConstraints =
    size.maxWidth !== undefined ||
    size.maxHeight !== undefined ||
    size.width !== undefined ||
    size.height !== undefined;
  const shouldCoverFullImage = !hasSizeConstraints;

  // Check if overlay is a URL string
  const isUrlOverlay = typeof overlay === 'string';

  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        top: shouldCoverFullImage ? 0 : positionStyles.top,
        left: shouldCoverFullImage ? 0 : positionStyles.left,
        right: shouldCoverFullImage ? 0 : positionStyles.right,
        bottom: shouldCoverFullImage ? 0 : positionStyles.bottom,
        width: shouldCoverFullImage ? '100%' : sizeStyles.width,
        height: shouldCoverFullImage ? '100%' : sizeStyles.height,
        maxWidth: shouldCoverFullImage ? undefined : sizeStyles.maxWidth,
        maxHeight: shouldCoverFullImage ? undefined : sizeStyles.maxHeight,
        transform: shouldCoverFullImage ? undefined : positionStyles.transform,
        display: shouldCoverFullImage ? 'block' : positionStyles.display,
        alignItems: positionStyles.alignItems,
        justifyContent: positionStyles.justifyContent,
      }}
    >
      {isUrlOverlay ? (
        <img
          src={overlay}
          alt="Overlay"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      ) : (
        overlay
      )}
    </div>
  );
};

export default ImageOverlay;
