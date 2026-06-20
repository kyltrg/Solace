"use client";


import {
  createContext,
  useCallback,
  useContext,
  useMemo,
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
  initialSong,
}: {
  children: React.ReactNode;
  initialSong?: Song | null;
}): React.JSX.Element {



const [
songs,
setSongs
]=useState<Song[]>([]);




const [
currentSong,
setCurrentSong
]=useState<Song|null>(initialSong ?? null);




const [
isPlaying,
setPlaying
]=useState(false);






const playSong = useCallback(
function(song: Song) {
setCurrentSong(song);
setPlaying(true);
},
[]
);









const togglePlay = useCallback(
function() {
if(!currentSong)
return;
setPlaying(
prev=>!prev
);
},
[currentSong]
);


const nextSong = useCallback(
function() {
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
},
[currentSong, songs]
);









const previousSong = useCallback(
function() {
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
},
[currentSong, songs]
);
















const value = useMemo(
() => ({
songs,
setSongs,
currentSong,
isPlaying,
setPlaying,
playSong,
nextSong,
previousSong,
togglePlay,
}),
[songs, currentSong, isPlaying, setPlaying, playSong, nextSong, previousSong, togglePlay]
);

return (

<MusicContext.Provider
value={value}
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