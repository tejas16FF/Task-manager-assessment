import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function ProductivityBarChart({
  data,
  title = "Cumulative Progress",
}) {
  let runningTotal = 0;

  const ogiveData = (data || []).map((item) => {
    runningTotal += item.value || 0;

    return {
      name: item.name,
      cumulative: runningTotal,
    };
  });

  return (
    <div
      style={{
        background:
          "var(--surface)",
        padding: 20,
        borderRadius: 18,
        border:
          "1px solid var(--border)",
        height: 420,
      }}
    >
      <h2
        style={{
          marginBottom: 20,
        }}
      >
        {title}
      </h2>

      <ResponsiveContainer
        width="100%"
        height="85%"
      >
        <LineChart data={ogiveData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#334155"
          />

          <XAxis
            dataKey="name"
            stroke="#94a3b8"
          />

          <YAxis stroke="#94a3b8" />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="cumulative"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{
              r: 5,
              fill: "#6366f1",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ProductivityBarChart;
