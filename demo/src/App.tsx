import { useState } from "react";
import { PhotoViewer } from "zimme-zoom";
import "./App.css";

function App() {
  const [zoom, setZoom] = useState(1);

  // Sample images - replace these with your own images
  const images = [
    "https://picsum.photos/800/600?random=1",
    "https://picsum.photos/800/600?random=2",
    "https://picsum.photos/800/600?random=3",
  ];

  return (
    <div className="app">
      <h1>Zimme Zoom Demo</h1>

      <div className="controls">
        <button onClick={() => setZoom((z) => Math.min(z + 0.1, 3))}>
          Zoom In
        </button>
        <button onClick={() => setZoom((z) => Math.max(z - 0.1, 0.5))}>
          Zoom Out
        </button>
        <span>Current Zoom: {zoom.toFixed(1)}x</span>
      </div>

      <div className="gallery">
        {images.map((src, index) => (
          <div key={index} className="photo-container">
            <PhotoViewer
              src={src}
              alt={`Sample image ${index + 1}`}
              initialZoom={zoom}
              maxZoom={3}
              minZoom={0.5}
              onZoomChange={setZoom}
              style={{ width: "100%", height: "400px" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
