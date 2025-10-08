import React from "react";
import { useViewMode } from "../hooks/useViewMode";
import ViewModeButtons from "./ViewModeButtons";
import "../App.css"; // agar styling chahiye
import type { Chapter } from "../types/manga";

interface MangaPageViewerProps {
  chapter: Chapter;
  onBack: () => void;
  viewMode: string;
  changeView: (mode: string) => void;
}

const MangaPageViewer: React.FC<MangaPageViewerProps>= ({ chapter, onBack }) => {
  const { viewMode, changeView } = useViewMode();

  const getImageStyle = () => {
    switch (viewMode) {
      case "fit-width":
        return { width: "100%", display: "block", margin: "0 auto" };
      case "original":
        return { width: "auto", maxWidth: "100%", display: "block", margin: "0 auto" };
      case "two-page":
        return { width: "48%", margin: "1%", display: "inline-block", verticalAlign: "top" };
      case "scroll":
        return { width: "100%", marginBottom: "10px" };
      default:
        return {};
    }
  };

  return (
    <section className="section chapter-view">
      <h3>{chapter.title}</h3>
      <ViewModeButtons changeView={changeView} currentMode={viewMode} />

      <div
        style={{
          display: viewMode === "two-page" ? "flex" : "block",
          flexWrap: viewMode === "two-page" ? "wrap" : "nowrap",
          justifyContent: "center",
        }}
      >
        {chapter.pages.map((page, index) => (
          <img key={index} src={page} alt={`Page ${index + 1}`} style={getImageStyle()} />
        ))}
      </div>

      <div className="center-button" style={{ marginTop: "20px" }}>
        <button onClick={onBack}>Back to Chapters</button>
      </div>
    </section>
  );
}

export default MangaPageViewer;