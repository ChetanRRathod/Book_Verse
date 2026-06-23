import React, { useState, useRef } from "react";
import ViewModeButtons from "./ViewModeButtons";
import "../App.css"; 
import type { Chapter } from "../types/manga";

interface MangaPageViewerProps {
  chapter: Chapter;
  onBack: () => void;
  viewMode: string;
  changeView: (mode: string) => void;
}

const MangaPageViewer: React.FC<MangaPageViewerProps> = ({ chapter, onBack, viewMode, changeView }) => {
  // 1. New State for Single Page Mode
  const [currentPage, setCurrentPage] = useState(0);
  
  // 2. New Ref for Fullscreen Mode
  const viewerRef = useRef<HTMLElement>(null);

  // Fullscreen Toggle Function
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen().catch(err => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Pagination Handlers
  const goToNextPage = () => {
    if (currentPage < chapter.pages.length - 1) setCurrentPage(prev => prev + 1);
  };
  const goToPrevPage = () => {
    if (currentPage > 0) setCurrentPage(prev => prev - 1);
  };

  // Updated Styles for all modes
  const getImageStyle = (): React.CSSProperties => {
    switch (viewMode) {
      case "fit-width":
        return { width: "100%", display: "block", margin: "0 auto" };
      case "original":
        return { width: "auto", maxWidth: "100%", display: "block", margin: "0 auto" };
      case "two-page":
      case "two-page-rtl":
        return { width: "48%", margin: "1%", display: "inline-block", verticalAlign: "top" };
      case "scroll":
        return { width: "100%", marginBottom: "10px" };
      case "webtoon":
        // Zero margins, zero gaps for continuous reading
        return { width: "100%", display: "block", margin: 0, padding: 0 };
      case "single-page":
        // Restrict height so the whole page fits on screen without scrolling
        return { maxWidth: "100%", maxHeight: "90vh", margin: "0 auto", display: "block", objectFit: "contain" };
      default:
        return {};
    }
  };

  return (
    <section className="section chapter-view" ref={viewerRef} style={{ backgroundColor: document.fullscreenElement ? '#000' : 'transparent', padding: document.fullscreenElement ? '20px' : '0' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>{chapter.title}</h3>
        <button onClick={toggleFullscreen} style={{ padding: '8px', cursor: 'pointer', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px' }}>
          {document.fullscreenElement ? "Exit Fullscreen" : "⛶ Fullscreen"}
        </button>
      </div>

      <ViewModeButtons changeView={changeView} currentMode={viewMode} />

      {/* Conditionally render Single Page Mode vs List Modes */}
      {viewMode === "single-page" ? (
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px' }}>
          <button onClick={goToPrevPage} disabled={currentPage === 0} style={{ padding: '20px', cursor: 'pointer' }}>◀</button>
          
          <div style={{ flex: 1, textAlign: 'center' }}>
            <img 
              src={chapter.pages[currentPage]} 
              alt={`Page ${currentPage + 1}`} 
              style={getImageStyle()} 
            />
            <p style={{ marginTop: '10px' }}>Page {currentPage + 1} of {chapter.pages.length}</p>
          </div>

          <button onClick={goToNextPage} disabled={currentPage === chapter.pages.length - 1} style={{ padding: '20px', cursor: 'pointer' }}>▶</button>
        </div>

      ) : (

        <div
          style={{
            // If it's traditional manga, flip the direction to Right-To-Left
            direction: viewMode === "two-page-rtl" ? "rtl" : "ltr",
            display: viewMode.includes("two-page") ? "flex" : "block",
            flexWrap: viewMode.includes("two-page") ? "wrap" : "nowrap",
            justifyContent: "center",
            // Remove all gaps for Webtoon mode
            gap: viewMode === "webtoon" ? "0" : "auto", 
          }}
        >
          {chapter.pages.map((page, index) => (
            <img key={index} src={page} alt={`Page ${index + 1}`} style={getImageStyle()} />
          ))}
        </div>

      )}

      <div className="center-button" style={{ marginTop: "20px" }}>
        <button onClick={onBack}>Back to Chapters</button>
      </div>
    </section>
  );
}

export default MangaPageViewer;