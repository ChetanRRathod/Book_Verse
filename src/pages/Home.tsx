import { useState } from "react";
import MangaList from "../components/MangaList"; 
import ChapterList from "../components/ChapterList";
import MangaPageViewer from "../components/MangaPageViewer";
import { sampleMangas } from "../data/sampleMangas";
import { type Manga, type Chapter } from "../types/manga";

export default function Home() {
  const [selectedManga, setSelectedManga] = useState<Manga | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  return (
    <main className="main-content">
      {/* Show All Manga List */}
      {!selectedManga && (
        <div className="dashboard-container">
          <section className="manga-category">
            <h2 className="category-title">Trending </h2>
            <MangaList mangas={sampleMangas} onSelect={setSelectedManga} />
          </section>

          <section className="manga-category">
            <h2 className="category-title">New Arrivals</h2>
            <MangaList mangas={sampleMangas} onSelect={setSelectedManga} />
          </section>
          
          <section className="manga-category">
            <h2 className="category-title">Continue Reading</h2>
            <MangaList mangas={sampleMangas} onSelect={setSelectedManga} />
          </section>
        </div>
      )}

      {/* Show Selected Manga + Chapters */}
      {selectedManga && !selectedChapter && (
        <section className="section">
          <h2>{selectedManga.title} Chapters</h2>

          <div className="manga-info">
            <img
              src={selectedManga.coverImage}
              alt={selectedManga.title}
              className="manga-image"
            />
            <div className="manga-description">
              <h3>Description</h3>
              <p>{selectedManga.description}</p>
            </div>
          </div>

          <ChapterList
            chapters={selectedManga.chapters}
            onSelect={setSelectedChapter}
          />

          <div className="center-button">
            <button onClick={() => setSelectedManga(null)}>
              Back to Manga List
            </button>
          </div>
        </section>
      )}

      {/* Show Chapter Pages */}
      {selectedChapter && (
        <MangaPageViewer
          chapter={selectedChapter}
          onBack={() => setSelectedChapter(null)} 
          viewMode={""} 
          changeView={function (): void {
            throw new Error("Function not implemented.");
          }}  
        />
      )}
    </main>
  );
}