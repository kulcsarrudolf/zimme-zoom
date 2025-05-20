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
  const [selectedImage, setSelectedImage] = useState<ZZImage | null>(null);

  return (
    <>
      <GalleryGrid>
        {images.map((image) => (
          <Image
            key={image.id}
            image={image}
            onClick={() => {
              setSelectedImage(image);
            }}
          />
        ))}
      </GalleryGrid>

      <PhotoViewer
        selectedImage={selectedImage}
        images={images}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
};
