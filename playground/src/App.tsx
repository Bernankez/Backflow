import { useEffect, useRef, useState } from "react";
import "./App.css";
import { init, isPlaying, pause, play } from "../../src";

function App() {
  const el = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let destroy: () => void;
    if (el.current) {
      destroy = init(el.current);
    }
    return () => {
      destroy?.();
      console.log("Destroyed");
    };
  }, []);

  function toggleAnimate() {
    if (isPlaying()) {
      pause();
      setPlaying(false);
    } else {
      play();
      setPlaying(true);
    }
  }

  return <div className="h-full w-full flex flex-col flex-gap-3 p-3">
    <div className="flex justify-center">
      <div role="button" className={`${playing ? "i-carbon:pause-filled" : "i-carbon:play-filled-alt"} text-20 btn btn-primary`} onClick={() => toggleAnimate()}></div>
    </div>
    <div className="h-full w-full" ref={el}></div>
  </div>;
}

export default App;
