"use client";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  useEffect,
  useState,
} from "react";

import {
  DotLottieReact,
} from "@lottiefiles/dotlottie-react";



export default function PageTransition()
:React.JSX.Element {


  const [
    visible,
    setVisible,
  ] = useState(false);



  useEffect(()=>{


    function showLoading(){


      setVisible(true);


      setTimeout(()=>{

        setVisible(false);

      },1200);

    }


    window.addEventListener(
      "solace-loading",
      showLoading
    );


    return ()=>{

      window.removeEventListener(
        "solace-loading",
        showLoading
      );

    };


  },[]);



  return (

    <AnimatePresence>

      {

      visible && (

        <motion.div

          initial={{
            opacity:0,
          }}

          animate={{
            opacity:1,
          }}

          exit={{
            opacity:0,
          }}

          transition={{
            duration:.25,
          }}

          className="
          fixed
          inset-0
          z-[9999]
          flex
          items-center
          justify-center
          bg-[var(--bg)]
          "

        >

          <div
            className="
            relative
            flex
            flex-col
            items-center
            "
          >

            <div
              className="
              h-[220px]
              w-[220px]
              "
            >

              <DotLottieReact
                src="https://lottie.host/bd408a07-cfe7-4661-9025-0ee7b4fd3e46/xTiN7Tolp6.lottie"
                autoplay
                loop={false}
              />

            </div>

            <p
              className="
              -mt-4
              font-display
              text-4xl
              tracking-[0.35em]
              text-[var(--text)]
              "
            >

              SOLACE

            </p>

          </div>

        </motion.div>

      )

      }

    </AnimatePresence>

  );

}