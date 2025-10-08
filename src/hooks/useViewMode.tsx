import { useState } from "react";

export function useViewMode() {
  const [viewMode, setViewMode] = useState("fit-width");
  const changeView = (mode: string) => setViewMode(mode);
  return { viewMode, changeView };
}