import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function ProductivityBarChart({
  analytics,
}) {
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
        Employee Productivity
      </h2>

      <ResponsiveContainer
        width="100%"
        height="85%"
      >
        <BarChart
          data={
            analytics.employeeStats
          }
        >
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

          <Bar
            dataKey="completed"
            fill="#6366f1"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ProductivityBarChart;