"use client";


import ReactPlayer
from "react-player";


import {
useMusic,
}
from "./MusicProvider";




export default function HiddenPlayer()
:React.JSX.Element {



const {

currentSong,

isPlaying,

nextSong,

}=useMusic();





if(!currentSong){

return <></>;

}





return (

<div

className="
fixed
left-0
top-0

h-0
w-0

overflow-hidden
pointer-events-none
"

>


<ReactPlayer


src={
currentSong.url
}


playing={
isPlaying
}


controls={false}


width="0"


height="0"



onEnded={
nextSong
}


/>


</div>


);


}