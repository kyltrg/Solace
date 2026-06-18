"use client";


import {
  createContext,
  useContext,
  useState,
} from "react";



export type Song = {

  id:string;

  title:string;

  artist:string;

  url:string;

  note:string | null;

};





type MusicContextType = {


  songs:Song[];

  setSongs:(songs:Song[])=>void;


  currentSong:Song|null;


  isPlaying:boolean;


  setPlaying:(value:boolean)=>void;


  playSong:(song:Song)=>void;


  nextSong:()=>void;


  previousSong:()=>void;


  togglePlay:()=>void;


};





const MusicContext =
createContext<MusicContextType|null>(null);







export function MusicProvider({

children,

}:{
children:React.ReactNode;

}):React.JSX.Element {



const [
songs,
setSongs
]=useState<Song[]>([]);




const [
currentSong,
setCurrentSong
]=useState<Song|null>(null);




const [
isPlaying,
setPlaying
]=useState(false);







function playSong(
song:Song
){


setCurrentSong(song);

setPlaying(true);


}








function togglePlay(){


if(!currentSong)
return;


setPlaying(
prev=>!prev
);


}







function nextSong(){


if(
!currentSong ||
songs.length===0
)
return;




const index =
songs.findIndex(
song =>
song.id === currentSong.id
);




const next =
songs[
(index + 1)
%
songs.length
];



setCurrentSong(next);

setPlaying(true);


}









function previousSong(){


if(
!currentSong ||
songs.length===0
)
return;




const index =
songs.findIndex(
song =>
song.id === currentSong.id
);




const previous =
songs[
index <= 0
?
songs.length - 1
:
index - 1
];



setCurrentSong(previous);

setPlaying(true);


}









return (

<MusicContext.Provider

value={{

songs,

setSongs,

currentSong,

isPlaying,

setPlaying,

playSong,

nextSong,

previousSong,

togglePlay,

}}

>

{children}

</MusicContext.Provider>


);


}








export function useMusic(){


const context =
useContext(MusicContext);



if(!context){

throw new Error(
"MusicProvider missing"
);

}


return context;


}