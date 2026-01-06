import React, { useState } from 'react';
import { ZZImage } from '../../types/image.type';

type ImageProps = {
  image: ZZImage;
  onClick?: () => void;
};

export const Image = ({ image, onClick }: ImageProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      key={image.id}
      style={{
        aspectRatio: '4/4',
        overflow: 'hidden',
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease',
        position: 'relative',
      }}
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
          objectFit: 'cover',
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
