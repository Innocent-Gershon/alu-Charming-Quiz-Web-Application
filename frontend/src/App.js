import React from "react";
import Quiz from "./components/Quiz";
import logo from './logo.svg';
import './App.css';



function App() {
  return (
    <div className="App">
       <img src={logo} alt="Logo" className="logo" />
      <Quiz />
    </div>
  );
}

  

export default App;
