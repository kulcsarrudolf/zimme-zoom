import React, { useState } from "react";
import { Image } from "./Image";
import { ZZImage } from "../types/image.type";
import { PhotoViewer } from "..";

const GalleryGrid = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "1rem",
        maxWidth: "1200px",
        margin: "0 auto",
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
  const [zoom, setZoom] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <>
      <GalleryGrid>
        {images.map((image, index) => (
          <Image
            key={image.id}
            image={image}
            onClick={() => {
              setSelectedImageIndex(index);
              setIsOpen(true);
            }}
          />
        ))}
      </GalleryGrid>

      {isOpen && (
        <PhotoViewer
          src={images[selectedImageIndex].src}
          initialZoom={zoom}
          maxZoom={4}
          minZoom={0.5}
          onZoomChange={setZoom}
          title="Photo Viewer"
          zoomStep={0.2}
          allowZoom={true}
          allowRotate={true}
          allowReset={true}
          doubleClickZoom={3}
          clickOutsideToExit={true}
          keyboardInteraction={true}
          onClose={() => setIsOpen(false)}
          images={images.map((image) => image.src)}
          currentImageIndex={selectedImageIndex}
          onImageChange={setSelectedImageIndex}
        />
      )}
    </>
  );
};
