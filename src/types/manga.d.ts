export interface Chapter{
    id: string;
    title: string;
    pages: string[];
}

export interface Manga{
    id:string;
    title : string;
    coverImage: string;
    description: string;
    chapters: Chapter[];
}