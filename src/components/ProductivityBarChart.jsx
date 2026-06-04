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
  const ogiveData = (data || []).reduce(
    (items, item) => {
      const previous =
        items.length === 0
          ? 0
          : items[items.length - 1].cumulative;

      return [
        ...items,
        {
          name: item.name,
          cumulative: previous + (item.value || 0),
        },
      ];
    },
    []
  );

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
