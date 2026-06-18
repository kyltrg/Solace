"use client";


import {
useMusic
} from "./MusicProvider";


import SongCard
from "./SongCard";



export default function SongArchive()
:React.JSX.Element {



const {
songs
}
=
useMusic();




return (

<section className="space-y-5">


{

songs.map(song=>(

<SongCard

key={song.id}

song={song}

/>

))

}



</section>

);

}