// src/App.js
import React, { useState } from 'react';
import ChartComponent from './components/ChartComponent';
import TimeframeSelector from './components/TimeframeSelector';

const App = () => {
  const [timeframe, setTimeframe] = useState('daily');

  const handleTimeframeChange = (selectedTimeframe) => {
    setTimeframe(selectedTimeframe);
  };

  return (
    <div style={{background:'lightblue', textAlign:'center', width:'100%'}}>
      <h1>React Chart with Zoom</h1>
      <TimeframeSelector onSelect={handleTimeframeChange} timeframe={timeframe} />
      <ChartComponent timeframe={timeframe} setTimeframe={setTimeframe} />
    </div>
  );
};

export default App;
