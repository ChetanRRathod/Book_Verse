import { useState, useEffect, useRef } from 'react';
import localforage from 'localforage';
import PdfViewer from '../components/PdfViewer';

// Define the shape of our local book data
interface LocalBook {
  id: string;
  name: string;
  size: number;
}

export default function LocalLibrary() {
  const [savedBooks, setSavedBooks] = useState<LocalBook[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeBookFile,setActiveBookFile] = useState<File|null>(null);

  // 1. Load books as soon as the page opens
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const keys = await localforage.keys();
      const bookList: LocalBook[] = [];
      
      for (const key of keys) {
        // Only grab items that we specifically saved as manga
        if (key.startsWith('manga_')) {
          const file = await localforage.getItem<File>(key);
          if (file) {
            bookList.push({ id: key, name: file.name, size: file.size });
          }
        }
      }
      setSavedBooks(bookList);
    } catch (error) {
      console.error("Error loading library:", error);
    }
  };

  // 2. Handle the file upload process
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    for (const file of fileArray) {
      // Create a unique ID using the timestamp and filename
      const uniqueId = `manga_${Date.now()}_${file.name}`;
      
      // Save the raw File object directly into IndexedDB
      await localforage.setItem(uniqueId, file);
    }
    
    loadBooks(); // Refresh the visual list
    if (fileInputRef.current) fileInputRef.current.value = ''; // Reset the input
  };

  // 3. Handle deleting a book
  const removeBook = async (id: string) => {
    await localforage.removeItem(id);
    loadBooks(); // Refresh the list after deletion
  };

  // Helper function to make the file sizes readable
  const formatBytes = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const openBook = async (id: string) =>{
    try{
        const file = await localforage.getItem<File>(id);
        if(file){
            setActiveBookFile(file);
        }
    }
    catch(error){
        console.error("Error opening book:", error);
    }
  };

  // If a book is active, hide the shelf and show the reader!
  if (activeBookFile) {
    return (
      <main className="main-content" style={{ padding: '20px' }}>
        <PdfViewer 
          file={activeBookFile} 
          onBack={() => setActiveBookFile(null)} // Closes the book
        />
      </main>
    );
  }

  return (
    <main className="main-content" style={{ color: 'white', padding: '20px' }}>
      <h2>My Shelf</h2>
      
      {/* Hidden File Input */}
      <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileUpload} accept=".pdf,.cbz,.cbr,.epub" multiple />
      
      {/* <p>line white small </p> */}
      <hr style={{ border: 'none', borderTop: '1px solid #555', margin: '15px 0 20px 0', width: '100%' }}/>
      
      {/* <p> search bar </p> */}

        <input type='text' placeholder='Search my shelf...' style={{ 
          width: '100%', 
          maxWidth: '300px', 
          padding: '10px', 
          marginBottom: '20px', 
          borderRadius: '5px', 
          border: '1px solid #444', 
          backgroundColor: '#1e1e1e', 
          color: 'white' 
        }}></input>

        <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileUpload} accept=".pdf,.cbz,.cbr,.epub" multiple />

        <br /> {/* Optional: forces the Add button to the next line if you want it below the search */}
      
      <button 
        onClick={() => fileInputRef.current?.click()}
        style={{ padding: '10px 20px', cursor: 'pointer', marginBottom: '30px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        + Add / Upload New Books
      </button>

      {/* The Grid of Saved Books */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {savedBooks.length === 0 ? (
          <p style={{ color: '#aaa' }}>Your offline library is empty. Add some manga to read without internet!</p>
        ) : (
          savedBooks.map((book) => (
            <div key={book.id} style={{ border: '1px solid #444', backgroundColor: '#1e1e1e', padding: '15px', borderRadius: '8px', width: '250px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.1rem', margin: '0 0 10px 0', wordBreak: 'break-word', flexGrow: 1 }}>
                {book.name}
              </h3>
              <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '15px' }}>
                {formatBytes(book.size)}
              </p>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => openBook(book.id)}
                  style={{ flex: 1, padding: '8px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                  Read
                </button>
                <button 
                  onClick={() => removeBook(book.id)} 
                  style={{ flex: 1, padding: '8px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}