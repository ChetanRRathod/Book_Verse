import { useState } from "react";
import MangaList from "./components/MangaList";
import ChapterList from "./components/ChapterList";
import Footer from "./components/Footer";
import { sampleMangas } from "./data/sampleMangas";
import { type Manga, type Chapter } from "./types/manga";
import "./App.css";
import Navbar from "./components/Navbar";
import MangaPageViewer from "./components/MangaPageViewer";

function App() {
  const [selectedManga, setSelectedManga] = useState<Manga | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
 
  

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 0px", minWidth:"401px"}}>
      <Navbar/>
    <div className="app-container">
      <header className="navbar">
        <h1 className="logo">📖 MangaVerse</h1>
      </header>

      <main className="main-content">
        {/* Show All Manga List */}
        {!selectedManga && (
          <section className="section">
            <MangaList mangas={sampleMangas} onSelect={setSelectedManga} />
          </section>
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
              } }  />
        )}

        {/* {selectedChapter && (
          <section className="section chapter-view">
            <h3>{selectedChapter.title}</h3>
            <div className="chapter-pages">
              {selectedChapter.pages.map((page, index) => (
                <img
                key={index}
                src={page}
                alt={`Page ${index + 1}`}
                className="chapter-image"
                />
              ))}
            </div>

            <div className="center-button">
              <button onClick={() => setSelectedChapter(null)}>
                Back to Chapters
              </button>
            </div>
          </section>
        )} */}
      </main>

      <Footer />
    </div>
        {/* sab component yaha */}
      </div>
  );
}

export default App;
