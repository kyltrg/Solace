"use client";

import {
  useEffect,
} from "react";

import {
  Song,
  useMusic,
} from "./MusicProvider";


export default function MusicLoader({

  songs,

}:{

  songs: Song[];

})
: React.JSX.Element {


  const {
    setSongs,
  } = useMusic();



  useEffect(()=>{


    setSongs(
      songs
    );


  },[

    songs

  ]);



  return <></>;

}