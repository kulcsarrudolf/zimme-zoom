import { Gallery, type ZZImage } from "zimme-zoom";

function App() {
  const images: ZZImage[] = [
    {
      id: "4d9c3e6d-c0c5-4fa8-be78-123c42b4ca33",
      src: "https://picsum.photos/3840/2160?random=8",
      alt: "Image 9",
      title: "Image 9",
    },
    {
      id: "4d9c3e6d-c0c5-4fa8-be78-123c42b4ca26",
      src: "https://picsum.photos/3840/2160?random=10",
      alt: "Image 10",
      title: "Image 10",
    },
    {
      id: "4d9c3e6d-c0c5-4fa8-be78-123c42b4ca27",
      src: "https://picsum.photos/3840/2160?random=11",
      alt: "Image 11",
      title: "Image 11",
    },
    {
      id: "4d9c3e6d-c0c5-4fa8-be78-123c42b4ca28",
      src: "https://picsum.photos/800/600?random=1",
      alt: "Image 1",
      title: "Image 1",
    },
    {
      id: "4d9c3e6d-c0c5-4fa8-be78-123c42b4ca29",
      src: "https://picsum.photos/800/600?random=2",
      alt: "Image 2",
      title: "Image 2",
    },
    {
      id: "4d9c3e6d-c0c5-4fa8-be78-123c42b4ca2a",
      src: "https://picsum.photos/800/600?random=3",
      alt: "Image 3",
      title: "Image 3",
    },
    {
      id: "4d9c3e6d-c0c5-4fa8-be78-123c42b4ca2b",
      src: "https://picsum.photos/1920/1080?random=4",
      alt: "Image 4",
      title: "Image 4",
    },
    {
      id: "4d9c3e6d-c0c5-4fa8-be78-123c42b4ca2c",
      src: "https://picsum.photos/1920/1080?random=5",
      alt: "Image 5",
      title: "Image 5",
    },
    {
      id: "4d9c3e6d-c0c5-4fa8-be78-123c42b4ca31",
      src: "https://picsum.photos/1920/1080?random=6",
      alt: "Image 6",
      title: "Image 6",
    },
    {
      id: "4d9c3e6d-c0c5-4fa8-be78-123c42b4ca32",
      src: "https://picsum.photos/1920/1080?random=7",
      alt: "Image 7",
      title: "Image 7",
    },
    {
      id: "4d9c3e6d-c0c5-4fa8-be78-123c42b4ca33",
      src: "https://picsum.photos/3840/2160?random=8",
      alt: "Image 8",
      title: "Image 8",
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
