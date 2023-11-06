import React, { useEffect, useRef } from "react";
import "./App.css";
import { animate, init } from "../../src";

function App() {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (el.current) {
      init(el.current);
    }
  }, []);

  return <div>
    <button className="btn btn-primary" onClick={() => animate()}>animate</button>
    Hello World!
    <div ref={el}></div>
  </div>;
}

export default App;
