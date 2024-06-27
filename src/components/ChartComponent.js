// src/components/ChartComponent.js
import React, { useState, useEffect, PureComponent } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts";
import data from "../data.json";

const getAxisYDomain = (from, to, ref, offset) => {
  const refData = data.slice(from - 1, to);
  let [bottom, top] = [refData[0][ref], refData[0][ref]];
  refData.forEach((d) => {
    if (d[ref] > top) top = d[ref];
    if (d[ref] < bottom) bottom = d[ref];
  });
  return [(bottom | 0) - offset, (top | 0) + offset];
};

const filterDataByTimeframe = (timeframe) => {
  // Assuming data has 20 points, distribute 20 points to daily, 5 points to weekly, and 2 points to monthly for simplicity.
  switch (timeframe) {
    case "daily":
      return data;
    case "weekly":
      return periodDataCalculation(7);
    case "monthly":
      return periodDataCalculation(30);
    default:
      return data;
  }
};

const periodDataCalculation = (period) => {
  let counter = 1,
    valueSum = 0,
    result = [];

  for (let i = 0; i < data.length; i++) {
    let currentData = data[i];
    if (counter === period) {
      result.push({
        ...currentData,
        value: Math.round(valueSum / period),
      });
      counter = 1;
      valueSum = 0;
    } else {
      valueSum += currentData.value;
      counter++;
    }
  }
  if (counter < period) {
    result.push({
      ...data[data.length - 1],
      value: Math.round(valueSum / counter),
    });
  }

  return result;
};
const ChartComponent = ({ timeframe, setTimeframe }) => {
  const [state, setState] = useState({
    data: filterDataByTimeframe(timeframe),
    left: "dataMin",
    right: "dataMax",
    refAreaLeft: "",
    refAreaRight: "",
    top: "dataMax+1",
    bottom: "dataMin-1",
    top2: "dataMax+20",
    bottom2: "dataMin-20",
    animation: true,
  });

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      data: filterDataByTimeframe(timeframe),
    }));
  }, [timeframe]);

  const zoom = () => {
    let { refAreaLeft, refAreaRight } = state;
    const { data } = state;

    if (refAreaLeft === refAreaRight || refAreaRight === "") {
      setState((prevState) => ({
        ...prevState,
        refAreaLeft: "",
        refAreaRight: "",
      }));
      return;
    }

    if (refAreaLeft > refAreaRight)
      [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];

    const [bottom, top] = getAxisYDomain(refAreaLeft, refAreaRight, "value", 1);
    const [bottom2, top2] = getAxisYDomain(
      refAreaLeft,
      refAreaRight,
      "datetime",
      50
    );

    setState((prevState) => ({
      ...prevState,
      refAreaLeft: "",
      refAreaRight: "",
      data: data.slice(),
      left: refAreaLeft,
      right: refAreaRight,
      bottom,
      top,
      bottom2,
      top2,
    }));
  };

  const zoomOut = () => {
    setTimeframe("daily");
    setState((prevState) => ({
      ...prevState,
      data: filterDataByTimeframe(timeframe),
      refAreaLeft: "",
      refAreaRight: "",
      left: "dataMin",
      right: "dataMax",
      top: "dataMax+1",
      bottom: "dataMin",
      top2: "dataMax+50",
      bottom2: "dataMin+50",
    }));
  };

  const { left, right, refAreaLeft, refAreaRight, top, bottom } =
    state;

  return (
    <div
      className="highlight-bar-charts"
      style={{ userSelect: "none", width: "100%", backgroundColor:'pink' }}
    >
      <button
        type="button"
        style={{
          marginLeft: "20px",
          marginBottom: " 10px",
          backgroundColor: "lightgreen",
          color: "blue",
          borderRadius:'5px'
        }}
        onClick={zoomOut}
      >
        Zoom Out
      </button>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={state.data}
          
          onMouseDown={(e) =>
            setState({ ...state, refAreaLeft: e.activeLabel })
          }
          onMouseMove={(e) =>
            refAreaLeft && setState({ ...state, refAreaRight: e.activeLabel })
          }
          onMouseUp={zoom}
        >
          <CartesianGrid strokeDasharray="1 1" />
          <XAxis
            allowDataOverflow
            dataKey="datetime"
            domain={[left, right]}
            type="date"
            tick={<CustomizedAxisTick />}
          />
          <YAxis
            allowDataOverflow
            domain={[bottom, top]}
            type="number"
            yAxisId="1"
          />

          <Tooltip  labelFormatter={(label) => {
          const date = new Date(label);
          return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        }}
         />
          <Line
            yAxisId="1"
            type="natural"
            dataKey="value"
            stroke="#8884d8"
            animationDuration={300}
          />

          {refAreaLeft && refAreaRight ? (
            <ReferenceArea
              yAxisId="1"
              x1={refAreaLeft}
              x2={refAreaRight}
              strokeOpacity={0.3}
            />
          ) : null}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};


class CustomizedAxisTick extends PureComponent {
  render() {
    const { x, y, payload } = this.props;


    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-5)">
          {new Date(payload.value).toISOString().substring(0, 10)}
        </text>
      </g>
    );
  }
}

  export class CustomLabel extends PureComponent {
  render() {
    const { x, y, stroke, value } = this.props;

    console.log({value})
    return (
      <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">
        {new Date(value).toString()}
      </text>
    );
  }
}
export default ChartComponent;
