import { Gallery, type ZZImage } from "zimme-zoom";

function App() {
  const images: ZZImage[] = [
    {
      id: "4d9c3e6d-c0c5-4fa8-be78-123c42b4ca26",
      src: "https://picsum.photos/800/600?random=1",
      alt: "Image 1",
      title: "Image 1",
    },
    {
      id: "4d9c3e6d-c0c5-4fa8-be78-123c42b4ca27",
      src: "https://picsum.photos/800/600?random=2",
      alt: "Image 2",
      title: "Image 2",
    },
    {
      id: "4d9c3e6d-c0c5-4fa8-be78-123c42b4ca28",
      src: "https://picsum.photos/800/600?random=3",
      alt: "Image 3",
      title: "Image 3",
    },
  ];

  return (
    <div className="app" style={{ padding: "2rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
        Photo Gallery
      </h1>
      <Gallery images={images} />
    </div>
  );
}

export default App;
