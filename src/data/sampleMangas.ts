import type { Manga } from "../types/manga";


export const sampleMangas: Manga[] =[
    {
        id: "1",
        title: "Dragon Ball",
        coverImage: "/Manga_Cover.jpg",
        description: "Son Goku, a monkey-tailed boy, and Bulma, a teenage girl, travel to find the seven Dragon Balls, which summon the dragon Shenlong to grant the user one wish. Their journey leads to the desert bandit Yamcha, who later becomes an ally; Chi-Chi, whom Goku unknowingly agrees to marry; and Pilaf, an impish man who seeks the Dragon Balls to fulfill his desire to rule the world. Goku undergoes rigorous training regimes under the martial arts master Kame-Sen'nin to fight in the Tenkaichi Budōkai (天下一武道会; lit. 'Strongest Under the Heavens Martial Arts Tournament'). He becomes friends with a monk named Kuririn, his training partner and initial rival. After the tournament, Goku searches for the Dragon Ball his grandfather left him and almost single-handedly defeats the Red Ribbon Army and their hired assassin, Taopaipai. Goku then reunites with his friends to defeat the fortune teller Baba Uranai's fighters and use her to find the last Dragon Ball in order to revive a friend killed by Taopaipai.",
        chapters: [
        {
            id: "c1",
            title: "Chapter 1",
            pages: [
                "/PAGE2.jpg",
                "/PAGE1.jpg",
                "/PAGE3.jpg",
                "/PAGE.jpg"
            ],
        },
        {
            id: "c2",
            title: "Chapter 2",
            pages: [
                "/PAGE.jpg",
                "/PAGE4.jpg"
            ],
        },
        ],
    },
    {
        id: "3",
        title: "Naruto",
        coverImage: "/Naruto_Cover.jpg",
        description: ", a monkey type boy, and his friend Sasuske.",
        chapters: 
        [
        {
            id: "c1",
            title: "Chapter 1",
            pages: [
                "/PAGE.jpg",
                "/PAGE3.jpg"
            ],
        },
        ],
    }, 
    {
        id: "4",
        title: "Dragon Ball",
        coverImage: "/Manga_Cover.jpg",
        description: "",
        chapters: 
        [
        {
            id: "c1",
            title: "Chapter 1",
            pages: [
                "/PAGE1.jpg",
                "/PAGE2.jpg"
            ],
        },
        ],
    }, {
        id: "2",
        title: "Naruto",
        coverImage: "/Naruto_Cover.jpg",
        description: "",
        chapters: 
        [
        {
            id: "c1",
            title: "Chapter 1",
            pages: [
                "/PAGE1.jpg",
                "/PAGE2.jpg"
            ],
        },
        ],
    }, 
]


export default sampleMangas;