import React, { useState } from 'react';
import { Image } from './Image';
import { ZZImage } from '../types/image.type';
import { PhotoViewer } from './PhotoViewer';

const GalleryGrid = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      {children}
    </div>
  );
};

type GalleryProps = {
  images: ZZImage[];
};

export const Gallery = ({ images }: GalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<ZZImage | null>(null);

  return (
    <>
      <div
        style={{
          textAlign: 'center',
          marginBottom: '2rem',
          marginTop: '2rem',
        }}
      >
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            margin: 0,
            color: '#333',
          }}
        >
          zimme-zoom
        </h1>
      </div>
      <GalleryGrid>
        {images.map(image => (
          <Image
            key={image.id}
            image={image}
            onClick={() => {
              setSelectedImage(image);
            }}
          />
        ))}
      </GalleryGrid>

      <PhotoViewer selectedImage={selectedImage} images={images} onClose={() => setSelectedImage(null)} />
    </>
  );
};
