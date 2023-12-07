import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { type Color, backflow } from "../../src";

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [colors, setColors] = useState<Color[]>([]);
  const [file, setFile] = useState<File>();
  const [count, setCount] = useState(3);

  async function onFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      e.target.value = "";
    }
  }

  useEffect(() => {
    extract();
  }, [file]);

  async function extract() {
    if (file) {
      const colors = await backflow(file, count);
      setColors(colors);
    }
  }

  return (
    <div className="m-3">
      <div className="flex gap-3">
        <input ref={inputRef} type="file" onChange={onFileUpload} className="hidden" />
        <button className="btn btn-primary" onClick={() => inputRef.current?.click()}>select file</button>
        <select defaultValue={count} className="max-w-xs w-full select select-bordered" onChange={e => setCount(Number(e.target.value))}>
          {Array.from({ length: 11 }, (_, i) => (
            <option key={i}>{i + 2}</option>
          ))}
        </select>
      </div>
      <div className="m-t-3 flex flex-col gap-3">
        {colors.map((color, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-8 w-8" style={{ backgroundColor: `rgb(${color})`, border: "2px solid #000" }}></div>
            rgb({color.map(c => c.toFixed(0)).join(",")})
          </div>))}
      </div>
    </div>
  );
}

export default App;
