import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import LocalLibrary from "./pages/LocalLibrary"; 
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        
        {/* Navbar sits at the top and will span 100% width on ALL pages */}
        <Navbar />

        {/* The Routes determine what loads in the middle of the screen */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/offline-library" element={<LocalLibrary />} />
        </Routes>

        {/* Footer stays at the bottom of ALL pages */}
        <Footer />
        
      </div>
    </BrowserRouter>
  );
}

export default App;