import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function ChartPanel({ title, subtitle, children, className = "" }) {
  return (
    <div className={`chart-panel ${className}`}>
      <div className="chart-panel-header">
        <h3>{title}</h3>
        {subtitle && <p className="muted">{subtitle}</p>}
      </div>

      <div className="chart-panel-body">{children}</div>
    </div>
  );
}

function EmptyChart({ message = "No timed completed tasks yet." }) {
  return <div className="empty-chart">{message}</div>;
}

function formatHours(value) {
  return `${Number(value || 0).toFixed(1)}h`;
}

function EfficiencyBarChart({ data, title, subtitle }) {
  const chartData = (data || [])
    .filter((item) => item.timedTasks > 0 || item.averageHours > 0)
    .map((item) => ({
      ...item,
      adjustedHours: item.difficultyAdjustedHours || item.averageHours || 0,
    }));

  return (
    <ChartPanel title={title} subtitle={subtitle}>
      {chartData.length === 0 ? (
        <EmptyChart />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="name"
              stroke="var(--muted)"
              tick={{ fontSize: 12 }}
              interval={0}
            />
            <YAxis
              yAxisId="left"
              stroke="var(--muted)"
              tick={{ fontSize: 12 }}
              tickFormatter={formatHours}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="var(--muted)"
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value, key) => {
                if (key === "averageHours") {
                  return [formatHours(value), "Avg completion time"];
                }

                if (key === "adjustedHours") {
                  return [formatHours(value), "Difficulty-adjusted time"];
                }

                return [value, "Efficiency score"];
              }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="adjustedHours"
              name="Adjusted hours"
              fill="#14b8a6"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="efficiencyScore"
              name="Efficiency"
              fill="#6366f1"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartPanel>
  );
}

function CompletionTrendChart({ data, title, subtitle }) {
  const chartData = data || [];

  return (
    <ChartPanel title={title} subtitle={subtitle}>
      {chartData.length === 0 ? (
        <EmptyChart />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" stroke="var(--muted)" tick={{ fontSize: 12 }} />
            <YAxis
              yAxisId="left"
              stroke="var(--muted)"
              tick={{ fontSize: 12 }}
              tickFormatter={formatHours}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="var(--muted)"
              tick={{ fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip
              formatter={(value, key) => {
                if (key === "averageHours") {
                  return [formatHours(value), "Avg completion time"];
                }

                return [value, "Completed tasks"];
              }}
            />
            <Legend />
            <Bar
              yAxisId="right"
              dataKey="completed"
              name="Completed"
              fill="#93c5fd"
              radius={[6, 6, 0, 0]}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="averageHours"
              name="Avg hours"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 4, fill: "#6366f1" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </ChartPanel>
  );
}

function ProjectHealthChart({ data, title, subtitle }) {
  const chartData = (data || []).map((project) => ({
    name: project.name,
    completed: project.completed || project.completedTasks || 0,
    pending:
      project.pendingTasks ??
      Math.max((project.total || project.totalTasks || 0) - (project.completed || 0), 0),
    averageHours: project.averageHours || 0,
  }));

  return (
    <ChartPanel title={title} subtitle={subtitle}>
      {chartData.length === 0 ? (
        <EmptyChart message="No project analytics yet." />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="name"
              stroke="var(--muted)"
              tick={{ fontSize: 12 }}
              interval={0}
            />
            <YAxis
              yAxisId="tasks"
              stroke="var(--muted)"
              tick={{ fontSize: 12 }}
              allowDecimals={false}
            />
            <YAxis
              yAxisId="hours"
              orientation="right"
              stroke="var(--muted)"
              tick={{ fontSize: 12 }}
              tickFormatter={formatHours}
            />
            <Tooltip
              formatter={(value, key) => {
                if (key === "averageHours") {
                  return [formatHours(value), "Avg completion time"];
                }

                return [value, key === "completed" ? "Completed" : "Pending"];
              }}
            />
            <Legend />
            <Bar
              yAxisId="tasks"
              dataKey="completed"
              name="Completed"
              stackId="tasks"
              fill="#14b8a6"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              yAxisId="tasks"
              dataKey="pending"
              name="Pending"
              stackId="tasks"
              fill="#f59e0b"
              radius={[6, 6, 0, 0]}
            />
            <Line
              yAxisId="hours"
              type="monotone"
              dataKey="averageHours"
              name="Avg hours"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 4, fill: "#6366f1" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </ChartPanel>
  );
}

function EmployeeLeaderboard({ data, title, subtitle }) {
  const employees = (data || []).slice(0, 8);

  return (
    <ChartPanel title={title} subtitle={subtitle} className="leaderboard-panel">
      {employees.length === 0 ? (
        <EmptyChart />
      ) : (
        <div className="analytics-leaderboard">
          {employees.map((employee, index) => (
            <div key={employee.id || employee.name} className="leaderboard-row">
              <span className="leaderboard-rank">{index + 1}</span>
              <div className="leaderboard-copy">
                <strong>{employee.name}</strong>
                <small>
                  {employee.completed || 0} completed |{" "}
                  {formatHours(
                    employee.difficultyAdjustedHours || employee.averageHours
                  )} adjusted
                </small>
              </div>
              <span className="leaderboard-score">
                {employee.efficiencyScore || 0}
              </span>
            </div>
          ))}
        </div>
      )}
    </ChartPanel>
  );
}

export {
  CompletionTrendChart,
  EfficiencyBarChart,
  EmployeeLeaderboard,
  ProjectHealthChart,
};
