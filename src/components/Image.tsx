import React from "react";
import { ZZImage } from "../types/image.type";

type ImageProps = {
  image: ZZImage;
  onClick?: () => void;
};

export const Image = ({ image, onClick }: ImageProps) => {
  return (
    <div
      key={image.id}
      style={{
        aspectRatio: "4/3",
        overflow: "hidden",
        borderRadius: "8px",
        cursor: "pointer",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        transition: "transform 0.2s ease",
      }}
      onClick={onClick}
    >
      <img
        src={image.src}
        alt={image.alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
};
