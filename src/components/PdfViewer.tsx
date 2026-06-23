import React, { useRef, useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Import standard PDF styles so text highlights and formatting work
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// CRITICAL: Set up the PDF worker. 
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  file: File;
  onBack: () => void;
}

export default function PdfViewer({ file, onBack }: PdfViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  
  // Document State
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  
  // NEW: Store the exact aspect ratio of each individual page!
  const [pageRatios, setPageRatios] = useState<Record<number, number>>({}); 

  // View Mode State
  const [viewMode, setViewMode] = useState<"single" | "two-page" | "scroll">("single");
  const [fitWidth, setFitWidth] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Window Size State for Responsiveness
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- PDF LOAD HANDLERS ---
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  // Extracts the exact shape of THIS specific page so we can scale it perfectly
  const onPageLoadSuccess = (page: any) => {
    // react-pdf has changed how dimensions are stored across versions, this checks all possibilities
    const w = page.originalWidth || page.width || page.getViewport({ scale: 1 }).width;
    const h = page.originalHeight || page.height || page.getViewport({ scale: 1 }).height;
    
    if (w && h) {
      setPageRatios(prev => ({ ...prev, [page.pageNumber]: w / h }));
    }
  };

  // --- PAGINATION ---
  const goToPrevPage = () => {
    const jump = viewMode === 'two-page' ? 2 : 1;
    setPageNumber((prev) => Math.max(prev - jump, 1));
  };
  
  const goToNextPage = () => {
    const jump = viewMode === 'two-page' ? 2 : 1;
    setPageNumber((prev) => Math.min(prev + jump, numPages || 1));
  };

  // --- FULLSCREEN ---
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen().catch(err => {
        console.error("Error attempting to enable fullscreen:", err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // --- THE BULLETPROOF DIMENSION MATH ---
  // Notice we now pass the specific pageIndex to calculate its exact size
  const getPageDimensions = (pageIndex: number) => {
    const screenWidth = windowSize.width;
    
    // Buffer protects the bottom. 80px for Fullscreen toolbar, 160px for normal mode.
    const availableHeight = Math.max(windowSize.height - (isFullscreen ? 80 : 160), 300); 

    // 1. Scroll Mode
    if (viewMode === 'scroll') {
      return { width: Math.min(screenWidth * 0.9, 800) };
    }

    // 2. Define Maximum Widths
    const maxWidthSingle = screenWidth * 0.9; 
    const maxWidthTwoPage = ((screenWidth * 0.9) - 40) / 2; // Split screen minus the gap
    const maxAllowedWidth = viewMode === 'two-page' ? maxWidthTwoPage : maxWidthSingle;

    // 3. Fit Width Mode
    if (fitWidth) {
      return { width: maxAllowedWidth };
    }

    // 4. FIT SIZE MATH
    const currentRatio = pageRatios[pageIndex] || 0.7; // Fallback to 0.7 before it loads
    const estimatedWidthIfHeightMaxed = availableHeight * currentRatio;

    if (estimatedWidthIfHeightMaxed > maxAllowedWidth) {
      // If making it full-height makes it too wide (like landscape slides), force the width.
      return { width: maxAllowedWidth };
    } else {
      // *** THE FIX ***
      // If height is the constraint, FORCE the height. react-pdf will calculate the width perfectly.
      // This mathematically guarantees the page cannot exceed your screen's vertical space!
      return { height: availableHeight };
    }
  };

  return (
    <div 
      ref={viewerRef} 
      style={{ 
        boxSizing: 'border-box', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        color: 'white', 
        backgroundColor: isFullscreen ? '#000000' : 'white', 
        minHeight: '100vh', 
        padding: isFullscreen ? '0' : '20px', 
        width:'100%',// even without it the pages are going outside the box
      }}
    >
      
      {/* --- TOOLBAR --- */}
      <div style={{ boxSizing: 'border-box', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: fitWidth ? '95%' : '70%', padding: '2px 20px', backgroundColor: '#1e1e1e', marginBottom: '20px', borderRadius: isFullscreen ? '0' : '8px', zIndex: 10 }}>
        
        <button onClick={onBack} style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>
          Leave Book
        </button>

        {/* View Mode Controls */}
        <div style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
          <button onClick={() => setFitWidth(!fitWidth)} style={{ padding: '6px 12px', cursor: 'pointer', backgroundColor: fitWidth ? '#007bff' : '#444', color: 'white', border: 'none', borderRadius: '4px' }}>
            {fitWidth ? 'Fit Height' : 'Fit Width'}
          </button>
          
          <button onClick={() => setViewMode('single')} style={{ padding: '6px 12px', cursor: 'pointer', backgroundColor: viewMode === 'single' ? '#007bff' : '#444', color: 'white', border: 'none', borderRadius: '4px' }}>
            Single
          </button>
          <button onClick={() => setViewMode('two-page')} style={{ padding: '6px 12px', cursor: 'pointer', backgroundColor: viewMode === 'two-page' ? '#007bff' : '#444', color: 'white', border: 'none', borderRadius: '4px' }}>
            Two-Page
          </button>
          <button onClick={() => setViewMode('scroll')} style={{ padding: '6px 12px', cursor: 'pointer', backgroundColor: viewMode === 'scroll' ? '#007bff' : '#444', color: 'white', border: 'none', borderRadius: '4px' }}>
            Scroll
          </button>

          <button onClick={toggleFullscreen} style={{ padding: '6px 12px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
        </div>

        {/* Pagination (Hide in Scroll Mode) */}
        {viewMode !== 'scroll' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={goToPrevPage} disabled={pageNumber <= 1} style={{ padding: '8px', cursor: 'pointer' }}>
              {'<'}
            </button>
            <span>Pg {pageNumber} {viewMode === 'two-page' && pageNumber + 1 <= (numPages || 1) ? `- ${pageNumber + 1}` : ''} / {numPages || '--'}</span>
            <button onClick={goToNextPage} disabled={pageNumber >= (numPages || 1)} style={{ padding: '8px', cursor: 'pointer' }}>
              {'>'}
            </button>
          </div>
        )}
      </div>

      {/* --- DOCUMENT RENDERER --- */}
      <div style={{ 
        boxSizing: 'border-box', 
        backgroundColor: '#111', 
        padding: '0px', 
        borderRadius: isFullscreen ? '0' : '8px', 
        boxShadow: '0 4px 8px rgba(0,0,0,0.5)', 
        width: fitWidth ? '100%' : 'auto', 
        display: 'flex', 
        justifyContent: 'center'

      }}>
        <Document 
          file={file} 
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<p style={{ color: 'white' }}>Loading your book...</p>}
        >
          
          {/* 1. SINGLE PAGE MODE */}
          {viewMode === 'single' && (
            <Page 
              pageNumber={pageNumber} 
              onLoadSuccess={onPageLoadSuccess}
              {...getPageDimensions(pageNumber)} 
              renderTextLayer={false} 
              renderAnnotationLayer={false} 
            />
          )}

          {/* 2. TWO-PAGE MODE (Side by Side) */}
          {viewMode === 'two-page' && (
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center'}}>
              <Page 
                pageNumber={pageNumber} 
                onLoadSuccess={onPageLoadSuccess}
                {...getPageDimensions(pageNumber)} 
                renderTextLayer={false} 
                renderAnnotationLayer={false} 
              />
              {pageNumber + 1 <= (numPages || 1) && (
                 <Page 
                   pageNumber={pageNumber + 1} 
                   onLoadSuccess={onPageLoadSuccess}
                   {...getPageDimensions(pageNumber + 1)} 
                   renderTextLayer={false} 
                   renderAnnotationLayer={false} 
                 />
              )}
            </div>
          )}

          {/* 3. SCROLL MODE (Webtoon Style) */}
          {viewMode === 'scroll' && numPages && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Array.from(new Array(numPages), (el, index) => (
                <Page 
                  key={`page_${index + 1}`} 
                  pageNumber={index + 1} 
                  onLoadSuccess={onPageLoadSuccess}
                  {...getPageDimensions(index + 1)}
                  renderTextLayer={false} 
                  renderAnnotationLayer={false} 
                />
              ))}
            </div>
          )}

        </Document>
      </div>

    </div>
  );
}