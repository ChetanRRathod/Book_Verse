import React from "react";
import type { Manga } from "../types/manga";


interface MangaListProps{
    mangas : Manga[];
    onSelect : (manga : Manga ) => void;
}


const MangaList: React.FC<MangaListProps> = ({mangas, onSelect})=>{
     console.log("in component manga list ",mangas);

    return (
        <div style={{ display:"flex" ,flexDirection:"row", gap:"50px ",flexWrap:"wrap" , justifyContent:"center"}}>
            {mangas.map((manga)=> (
                
                    <div key={manga.id} style={{cursor:"pointer",margin: "10px 0",transition: "transform 0.2s ease"}} onClick={() => onSelect(manga)}onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
                        
                        <img src={manga.coverImage} alt={manga.title} style={{ height: "27vh", objectFit: "cover", borderRadius: "6px", transition: "transform 0.2s ease"}}/>

                        <h3
    style={{
      marginTop: "10px",
      transition: "font-size 0.2s ease", textAlign:"center"
    }}
    onMouseEnter={(e) => (e.currentTarget.style.fontSize = "22px")}
    onMouseLeave={(e) => (e.currentTarget.style.fontSize = "18px")}
  >
    {manga.title} 
  </h3>
                    </div>
                
                ))}
        </div>
    )
}


export default MangaList;