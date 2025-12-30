import React from 'react';
import { OverlayPosition, OverlaySize } from '../types/image.type';

interface ImageOverlayProps {
  overlay: React.ReactNode;
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

  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        ...getPositionStyles(position),
        ...getSizeStyles(),
      }}
    >
      {overlay}
    </div>
  );
};

export default ImageOverlay;

