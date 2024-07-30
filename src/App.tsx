import React from 'react';
import MatchGame from './components/MatchGame';
import './App.css';

const data = {
  "Argentina": "Buenos Aires",
  "Australia": "Canberra",
  "Brazil": "Brasília",
  "Canada": "Ottawa",
  "China": "Beijing",
};

function App() {
  return (
    <div className="App">
      <h1>Country Capital Game</h1>
      <MatchGame data={data} />
    </div>
  );
}

export default App;
