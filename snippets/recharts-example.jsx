import { useId } from "react";
import {
  Area,
  AreaChart,
  Brush,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { day: "Oct 1", requests: 16600, latency: 142 },
  { day: "Oct 2", requests: 21900, latency: 154 },
  { day: "Oct 3", requests: 18800, latency: 148 },
  { day: "Oct 4", requests: 25800, latency: 182 },
  { day: "Oct 5", requests: 28200, latency: 176 },
  { day: "Oct 6", requests: 19700, latency: 136 },
  { day: "Oct 7", requests: 22900, latency: 151 },
  { day: "Oct 8", requests: 24100, latency: 158 },
  { day: "Oct 9", requests: 26400, latency: 171 },
  { day: "Oct 10", requests: 21300, latency: 149 },
];

const tick = { fill: "currentColor", fillOpacity: 0.6, fontSize: 12 };
const grid = { stroke: "currentColor", strokeOpacity: 0.15 };
const tooltip = {
  contentStyle: {
    backgroundColor: "rgba(17, 24, 39, 0.92)",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    fontSize: 12,
  },
  itemStyle: { color: "#fff" },
  isAnimationActive: false,
};

export const SynchronizedCharts = () => {
  const syncId = useId();

  return (
    <div style={{ width: "100%" }}>
      <div style={{ width: "100%", height: 180 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart data={data} syncId={syncId} accessibilityLayer>
            <CartesianGrid vertical={false} {...grid} />
            <XAxis dataKey="day" tick={tick} stroke="currentColor" strokeOpacity={0.3} />
            <YAxis width={72} tick={tick} stroke="currentColor" strokeOpacity={0.3} />
            <Tooltip {...tooltip} />
            <Area
              dataKey="requests"
              name="Requests"
              type="monotone"
              stroke="#166E3F"
              fill="#26BD6C"
              fillOpacity={0.25}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={{ width: "100%", height: 230 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <LineChart data={data} syncId={syncId} accessibilityLayer>
            <CartesianGrid vertical={false} {...grid} />
            <XAxis dataKey="day" tick={tick} stroke="currentColor" strokeOpacity={0.3} />
            <YAxis
              width={72}
              domain={[0, 240]}
              tick={tick}
              stroke="currentColor"
              strokeOpacity={0.3}
              tickFormatter={(value) => `${value} ms`}
            />
            <Tooltip {...tooltip} />
            <Line
              dataKey="latency"
              name="Latency (ms)"
              type="monotone"
              stroke="#E0803A"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Brush
              dataKey="day"
              height={28}
              travellerWidth={10}
              stroke="#26BD6C"
              fill="transparent"
              ariaLabel="Visible date range for both charts"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
