import MangaList from "../components/MangaList";
import { sampleMangas } from "../data/sampleMangas";

export default function Home({ onSelectManga }: { onSelectManga: (m: any) => void }) {
  return (
    <div style={{ padding: "20px" }}>
      <MangaList mangas={sampleMangas} onSelect={onSelectManga} />
    </div>
  );
}