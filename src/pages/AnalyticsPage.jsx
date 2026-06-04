import { useEffect, useState } from "react";
import { Navigate, useOutletContext } from "react-router-dom";
import AnalyticsCards from "../components/AnalyticsCards";
import {
  CompletionTrendChart,
  EmployeeLeaderboard,
  EfficiencyBarChart,
  ProjectHealthChart,
} from "../components/EfficiencyCharts";
import TaskPieChart from "../components/TaskPieChart";
import { api } from "../utils/api";

function MetricCard({ label, value, note }) {
  return (
    <div className="analytics-metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {note && <small>{note}</small>}
    </div>
  );
}

function AnalyticsPage() {
  const { isAdmin } = useOutletContext();
  const [analytics, setAnalytics] = useState(null);
  const [mode, setMode] = useState("project");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      return undefined;
    }

    let cancelled = false;

    Promise.resolve()
      .then(() => api.get("/analytics"))
      .then((response) => {
        if (!cancelled) {
          setAnalytics(response.data);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  if (!isAdmin) {
    return <Navigate to="/tasks" replace />;
  }

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  if (!analytics) {
    return <div>No analytics data</div>;
  }

  const bestEmployee = analytics.employeeStats?.[0];
  const fastestProject = [...(analytics.projectStats || [])]
    .filter((project) => project.averageHours > 0)
    .sort((a, b) => a.averageHours - b.averageHours)[0];

  return (
    <div className="page analytics-page">
      <div className="analytics-hero">
        <div>
          <h2>Analytics</h2>
          <p className="muted">
            Track project health and employee delivery speed from task start to
            completion.
          </p>
        </div>

        <div className="analytics-tabs">
          <button
            className={mode === "project" ? "active" : ""}
            onClick={() => setMode("project")}
          >
            Projects
          </button>
          <button
            className={mode === "employee" ? "active" : ""}
            onClick={() => setMode("employee")}
          >
            Employees
          </button>
        </div>
      </div>

      {mode === "project" ? (
        <>
          <div className="analytics-summary-grid project-summary">
            <MetricCard label="Projects" value={analytics.projectStats?.length || 0} />
            <MetricCard label="Completed Tasks" value={analytics.completedTasks || 0} />
            <MetricCard
              label="Avg Delivery"
              value={`${analytics.averageCompletionHours || 0}h`}
              note="Started to completed"
            />
            <MetricCard
              label="Adjusted Avg"
              value={`${analytics.difficultyAdjustedHours || 0}h`}
              note="Difficulty weighted"
            />
            <MetricCard
              label="Fastest Project"
              value={fastestProject?.name || "N/A"}
              note={
                fastestProject ? `${fastestProject.averageHours}h avg` : "No timed data"
              }
            />
          </div>

          <div className="analytics-grid analytics-grid-featured">
            <ProjectHealthChart
              data={analytics.projectStats}
              title="Project Health"
              subtitle="Completed and pending work with average delivery time."
            />
            <TaskPieChart analytics={analytics} />
          </div>

          <div className="analytics-grid">
            <CompletionTrendChart
              data={analytics.completionTrend}
              title="Delivery Trend"
              subtitle="How average completion time changes by completion date."
            />

            <EfficiencyBarChart
              data={analytics.projectStats}
              title="Project Speed Index"
              subtitle="Efficiency uses difficulty-adjusted completion time."
            />
          </div>
        </>
      ) : (
        <>
          <div className="analytics-summary-grid employee-summary">
            <MetricCard label="Employees" value={analytics.employeeStats?.length || 0} />
            <MetricCard label="Timed Tasks" value={analytics.timedCompletedTasks || 0} />
            <MetricCard
              label="Team Avg"
              value={`${analytics.averageCompletionHours || 0}h`}
              note="Started to completed"
            />
            <MetricCard
              label="Adjusted Avg"
              value={`${analytics.difficultyAdjustedHours || 0}h`}
              note="Difficulty weighted"
            />
            <MetricCard
              label="Top Performer"
              value={bestEmployee?.name || "N/A"}
              note={
                bestEmployee
                  ? `${bestEmployee.efficiencyScore || 0} efficiency`
                  : "No timed data"
              }
            />
          </div>

          <div className="analytics-grid analytics-grid-featured">
            <EmployeeLeaderboard
              data={analytics.employeeStats}
              title="Efficiency Leaderboard"
              subtitle="Ranked by difficulty-adjusted speed against the team baseline."
            />

            <EfficiencyBarChart
              data={analytics.employeeStats}
              title="Employee Delivery Speed"
              subtitle="Adjusted hours account for task difficulty."
            />
          </div>

          <div className="analytics-grid">
            <AnalyticsCards analytics={analytics} />

            <CompletionTrendChart
              data={analytics.completionTrend}
              title="Team Completion Trend"
              subtitle="Overall completed task volume and average time."
            />
          </div>
        </>
      )}
    </div>
  );
}

export default AnalyticsPage;
