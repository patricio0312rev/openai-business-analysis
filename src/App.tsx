import React from 'react';
import logo from './logo.svg';
import './App.css';
import { OpenAITest } from './components/utils';
import { BarChart } from './components/charts';
import data from './data/people.json'

function App() {
  return (
    <div className="App">
      <OpenAITest />
      <BarChart data={data} />
    </div>
  );
}

export default App;
