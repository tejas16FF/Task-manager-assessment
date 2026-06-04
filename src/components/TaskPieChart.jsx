import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
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

      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
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
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default TaskPieChart;
