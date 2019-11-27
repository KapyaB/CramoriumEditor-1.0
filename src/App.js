import React from "react";
import "./App.css";
import RichTEditor from "./components/editor/RTEditor";

function App() {
  return (
    <div className="App">
      <div className="editor-top">
        <h1>Cramorium Editor 1.0</h1>
      </div>
      <RichTEditor />
    </div>
  );
}

export default App;
