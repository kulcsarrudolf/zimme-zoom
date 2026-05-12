import React, { useEffect, useState } from 'react';
import ImageOverlay from './ImageOverlay';
import type { ZZImage } from '../../types/image.type';

type Props = {
  image: ZZImage;
  zoom: number;
  panX: number;
  panY: number;
  rotationCount: number;
  isDragging: boolean;
  showOverlay: boolean;
  imageRef: React.Ref<HTMLImageElement>;
  onDoubleClick: () => void;
};

const skeletonStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: '#f0f0f0',
  animation: 'pulse 1.5s infinite',
  zIndex: 1,
};

const baseImageStyle: React.CSSProperties = {
  maxWidth: '80vw',
  maxHeight: '80vh',
  objectFit: 'contain',
  display: 'block',
  userSelect: 'none',
  transition: 'opacity 0.3s ease',
  position: 'relative',
  zIndex: 2,
};

export const PhotoViewerImage: React.FC<Props> = ({
  image,
  zoom,
  panX,
  panY,
  rotationCount,
  isDragging,
  showOverlay,
  imageRef,
  onDoubleClick,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [image.id]);

  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    transform: `translate(${panX}px, ${panY}px) rotateZ(${rotationCount * 90}deg) scale(${zoom})`,
    transformOrigin: 'center',
    transition: isDragging ? 'none' : 'transform 0.2s ease',
    display: 'inline-block',
  };

  return (
    <div style={wrapperStyle}>
      {isLoading && <div style={skeletonStyle} />}
      <img
        ref={imageRef}
        src={image.src}
        alt={image.alt || ''}
        onDoubleClick={onDoubleClick}
        onLoad={() => setIsLoading(false)}
        draggable={false}
        style={{ ...baseImageStyle, opacity: isLoading ? 0 : 1 }}
      />
      {showOverlay && image.svgOverlay && (
        <ImageOverlay
          overlay={image.svgOverlay}
          position={image.overlayPosition}
          size={image.overlaySize}
        />
      )}
    </div>
  );
};

export default PhotoViewerImage;
