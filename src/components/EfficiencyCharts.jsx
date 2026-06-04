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
  const chartData = (data || []).filter(
    (item) => item.timedTasks > 0 || item.averageHours > 0
  );

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

                return [value, "Efficiency score"];
              }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="averageHours"
              name="Avg hours"
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

export { CompletionTrendChart, EfficiencyBarChart };
