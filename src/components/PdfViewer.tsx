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
  const [pageRatios, setPageRatios] = useState<Record<number, number>>({}); 

  // View Mode State
  const [viewMode, setViewMode] = useState<"single" | "two-page" | "scroll">("single");
  const [fitWidth, setFitWidth] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Layout Measurement State
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [activeContainerWidth, setActiveContainerWidth] = useState(1200); // Defaults to a safe guess

  // Sync state with window resizing and container changes
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Measures the exact real-time width of our layout container block
  useEffect(() => {
    if (viewerRef.current) {
      setActiveContainerWidth(viewerRef.current.clientWidth);
    }
  }, [windowSize, isFullscreen, viewMode]);

  // Safe calculation for vertical monitor space
  const availableHeight = Math.max(windowSize.height - (isFullscreen ? 80 : 180), 300);

  // --- PDF LOAD HANDLERS ---
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const onPageLoadSuccess = (page: any) => {
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

  // --- THE AUTO-SIZING MATH ENGINE ---
  const getPageDimensions = (pageIndex: number) => {
    // 1. Scroll Mode (Webtoon-friendly fixed boundary width)
    if (viewMode === 'scroll') {
      return { width: Math.min(activeContainerWidth * 0.95, 800) };
    }

    // 2. Base our layout allocations entirely on the container box width!
    // We leave 40px of padding room for our container walls.
    const usableWidthSpace = activeContainerWidth - 40;

    const maxWidthSingle = usableWidthSpace; 
    const maxWidthTwoPage = (usableWidthSpace - 60) / 2; // Split space minus the middle gap
    const maxAllowedWidth = viewMode === 'two-page' ? maxWidthTwoPage : maxWidthSingle;

    // 3. Fit Width Mode
    if (fitWidth) {
      return { width: maxAllowedWidth };
    }

    // 4. Fit Size/Height Math (Ensures nothing ever bleeds vertically or horizontally)
    const currentRatio = pageRatios[pageIndex] || 0.7; 
    const estimatedWidthIfHeightMaxed = availableHeight * currentRatio;

    if (estimatedWidthIfHeightMaxed > maxAllowedWidth) {
      // If the page shape is too wide for our layout container block, lock it horizontally
      return { width: maxAllowedWidth };
    } else {
      // Otherwise, pin the height safely to match your screen height bounds perfectly
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
        width: '100%',
      }}
    >
      
      {/* --- TOOLBAR --- */}
      <div style={{ boxSizing: 'border-box', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '10px 20px', backgroundColor: '#1e1e1e', marginBottom: '20px', borderRadius: isFullscreen ? '0' : '8px', zIndex: 10 }}>
        
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

      {/* --- DOCUMENT RENDERER CONTAINER --- */}
      <div style={{ 
        boxSizing: 'border-box', 
        backgroundColor: '#111', 
        padding: '20px', 
        borderRadius: isFullscreen ? '0' : '8px', 
        boxShadow: '0 4px 8px rgba(0,0,0,0.5)', 
        width: '100%', // Locks perfectly to your App.css bounds
        height: (viewMode === 'scroll' || fitWidth) ? 'auto' : `${availableHeight + 40}px`,
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: (viewMode === 'scroll' || fitWidth) ? 'flex-start' : 'center',
        alignItems: 'center',
        overflow: 'auto'
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
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center'}}>
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