import React, { useState } from 'react';
import { ImageSize, ZZImage } from '../../types/image.type';

type ImageProps = {
  image: ZZImage;
  size?: ImageSize;
  onClick?: () => void;
};

export const Image = ({ image, size, onClick }: ImageProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const containerStyle: React.CSSProperties = {
    overflow: 'hidden',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: size?.width,
    height: size?.height,
    maxWidth: size?.maxWidth,
    maxHeight: size?.maxHeight,
    ...(size?.ratio
      ? { aspectRatio: size.ratio }
      : size?.width || size?.height || size?.maxWidth || size?.maxHeight
        ? {}
        : { aspectRatio: '1 / 1' }),
  };

  return (
    <div
      key={image.id}
      style={containerStyle}
      onClick={onClick}
    >
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#f0f0f0',
            animation: 'pulse 1.5s infinite',
          }}
        />
      )}
      <img
        src={image.src}
        alt={image.alt}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          objectFit: 'contain',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
        onLoad={() => setIsLoading(false)}
      />
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 0.8; }
            100% { opacity: 0.6; }
          }
        `}
      </style>
    </div>
  );
};
