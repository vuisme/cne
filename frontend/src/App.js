import React from "react";
import { BrowserRouter } from "react-router-dom";
import Routing from "./Routing";

import "./assets/font/fontello/css/fontello.css";

function App() {

  return (
    <BrowserRouter>
      <Routing />
    </BrowserRouter>
  );
}

export default App;
