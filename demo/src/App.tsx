import { useState } from "react";
import { PhotoViewer } from "zimme-zoom";
import "./App.css";

function App() {
  const [zoom, setZoom] = useState(1);

  // Sample images - replace these with your own images
  const images = ["https://picsum.photos/800/600?random=1"];

  return (
    <div className="app">
      <div className="gallery">
        {images.map((src, index) => (
          <div key={index}>
            <PhotoViewer
              src={src}
              // alt={`Sample image ${index + 1}`}
              initialZoom={zoom}
              maxZoom={3}
              minZoom={0.5}
              onZoomChange={setZoom}
              // style={{ width: "100%", height: "400px" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
