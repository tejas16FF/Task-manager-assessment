import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#10b981",
  "#f59e0b",
  "#3b82f6",
];

function TaskPieChart({
  analytics,
}) {
  const data = [
    {
      name: "Completed",
      value:
        analytics.completedTasks,
    },

    {
      name: "Pending",
      value:
        analytics.pendingTasks,
    },

    {
      name: "In Progress",
      value:
        analytics.inProgressTasks,
    },
  ];

  return (
    <div
      style={{
        background:
          "var(--surface)",
        padding: 20,
        borderRadius: 18,
        border:
          "1px solid var(--border)",
      }}
    >
      <h2
        style={{
          marginBottom: 20,
        }}
      >
        Task Distribution
      </h2>

      <PieChart
        width={400}
        height={300}
      >
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          dataKey="value"
          label
        >
          {data.map(
            (entry, index) => (
              <Cell
                key={index}
                fill={
                  COLORS[index]
                }
              />
            )
          )}
        </Pie>

        <Tooltip />

        <Legend />
      </PieChart>
    </div>
  );
}

export default TaskPieChart;