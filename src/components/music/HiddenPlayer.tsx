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
-left-[9999px]
top-0
opacity-0
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


width="1"


height="1"



onEnded={
nextSong
}


/>
</div>


);
}
