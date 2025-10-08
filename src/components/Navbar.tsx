// import React from "react";
import './Navbar.css';

export const Navbar =()=>
{
    return(
//       <div
//   style={{
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     flexWrap: "wrap",
//     padding: "10px 20px",
//     backgroundColor: "#007bff",
//     color: "white",
//   }}
// >
    <div className="Navbar">
      <nav className="navbar-inner">
        
        <div className="logo-section">
          <img src="/MangaVerse.svg" alt="MangaVerse Logo" className="logo-img"/>

          <h1 className="logo-text">MangaVerse</h1>
        </div>

       
        <button className="signin-btn">Sign In</button>
      </nav>
    </div>
        
    )
}

export default Navbar;