import React from 'react';
import type { Chapter } from '../types/manga';

interface ChapterListProps{
    chapters : Chapter[];
    onSelect:(chapter: Chapter) =>void;   
}


const ChapterList: React.FC<ChapterListProps> = ({chapters,onSelect})=>{
    console.log("in component Chapter list ",chapters);

    return (
        <div>
            <h1 style={{textAlign:"center"}}>Chapters</h1>
            {chapters.map((ch)=>(
                <div key={ch.id}
                style={{cursor:'pointer',margin:"5px 0",textAlign:"center" , fontSize:"20px"}}
                onClick={()=>onSelect(ch)}>
                    <hr style={{ border: "1px solid white", margin: "10px 0" }} />
                    {ch.title}
                </div>
            ))}
        </div>
    )
}


export default ChapterList;