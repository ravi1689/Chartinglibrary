// src/components/TimeframeSelector.js
import React from 'react';

const TimeframeSelector = ({ onSelect, timeframe }) => (
  <div style={{textAlign :'end', marginBottom:'0px',backgroundColor:'lightblue'}} >
    <select  onChange={(e) => onSelect(e.target.value)} value={timeframe} style={{backgroundColor:'lightblue', paddingTop:'5px', paddingLeft:'5px',paddingRight:'5px', paddingBottom:'5px', marginRight:'10px'}} >
      <option value="daily" style={{color:'green'}}>Daily</option>
      <option value="weekly" style={{color:'red'}}>Weekly</option>
      <option value="monthly" style={{color:'blue'}}>Monthly</option>
    </select>
  </div>
);

export default TimeframeSelector;
