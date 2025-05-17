import { useState } from "react";
import { PhotoViewer } from "zimme-zoom";

function App() {
  const [zoom, setZoom] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const images = [
    "https://picsum.photos/800/600?random=1",
    "https://picsum.photos/800/600?random=2",
    "https://picsum.photos/800/600?random=3",
  ];

  const handleImageClick = (src: string) => {
    setSelectedImage(src);
    setIsOpen(true);
  };

  return (
    <div className="app" style={{ padding: "2rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
        Photo Gallery
      </h1>
      <div
        className="gallery"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1rem",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {images.map((src, index) => (
          <div
            key={index}
            style={{
              aspectRatio: "4/3",
              overflow: "hidden",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              transition: "transform 0.2s ease",
            }}
            onClick={() => handleImageClick(src)}
          >
            <img
              src={src}
              alt={`Gallery image ${index + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        ))}
      </div>

      {isOpen && (
        <PhotoViewer
          src={selectedImage}
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
        />
      )}
    </div>
  );
}

export default App;
