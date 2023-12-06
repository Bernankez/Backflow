import React, { useRef, useState } from "react";
import "./App.css";
import { type Color, backflow } from "../../src";

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [colors, setColors] = useState<Color[]>([]);

  async function onFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const colors = await backflow(file, 2);
      setColors(colors);
      e.target.value = "";
    }
  }

  return (
    <div className="m-3">
      <div className="flex gap-3">
        <input ref={inputRef} type="file" onChange={onFileUpload} className="hidden" />
        <button className="btn btn-primary" onClick={() => inputRef.current?.click()}>select file</button>
        {/* <button className="btn">extract</button> */}
      </div>
      <div className="m-t-3 flex flex-col gap-3">
        {colors.map((color, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-8 w-8" style={{ backgroundColor: `rgb(${color})`, border: "2px solid #000" }}></div>
            {color}
          </div>))}
      </div>
    </div>
  );
}

export default App;
