import React from "react";

interface ViewModeButtonsProps {
  changeView: (mode: string) => void;
  currentMode: string;
}

const ViewModeButtons: React.FC<ViewModeButtonsProps> = ({ changeView, currentMode }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        margin: "20px 0",
      }}
    >
      <button
        onClick={() => changeView("fit-width")}
        style={{ backgroundColor: currentMode === "fit-width" ? "#ccc" : "" }}
      >
        Fit Width
      </button>
      <button
        onClick={() => changeView("original")}
        style={{ backgroundColor: currentMode === "original" ? "#ccc" : "" }}
      >
        Original Size
      </button>
      <button
        onClick={() => changeView("two-page")}
        style={{ backgroundColor: currentMode === "two-page" ? "#ccc" : "" }}
      >
        Two Page
      </button>
      <button
        onClick={() => changeView("scroll")}
        style={{ backgroundColor: currentMode === "scroll" ? "#ccc" : "" }}
      >
        Scroll
      </button>
    </div>
  );
};

export default ViewModeButtons;
