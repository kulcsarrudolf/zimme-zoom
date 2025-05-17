import { useState } from "react";
import { PhotoViewer } from "zimme-zoom";

function App() {
  const [zoom, setZoom] = useState(1);

  const images = ["https://picsum.photos/800/600?random=1"];

  return (
    <div className="app">
      <div className="gallery">
        {images.map((src, index) => (
          <div key={index}>
            <PhotoViewer
              src={src}
              initialZoom={zoom}
              maxZoom={3}
              minZoom={0.5}
              onZoomChange={setZoom}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
