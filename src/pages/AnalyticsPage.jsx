import { useEffect, useState } from "react";
import { Navigate, useOutletContext } from "react-router-dom";
import AnalyticsCards from "../components/AnalyticsCards";
import {
  CompletionTrendChart,
  EfficiencyBarChart,
} from "../components/EfficiencyCharts";
import TaskPieChart from "../components/TaskPieChart";
import { api } from "../utils/api";

function AnalyticsPage() {
  const { isAdmin } = useOutletContext();
  const [analytics, setAnalytics] = useState(null);
  const [mode, setMode] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await api.get("/analytics");
        setAnalytics(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (isAdmin) {
      fetchAnalytics();
    }
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

  return (
    <div className="page analytics-page">
      <div className="page-heading">
        <div>
          <h2>Analytics</h2>
          <p className="muted">
            Choose whether you want to inspect project or employee performance.
          </p>
        </div>
      </div>

      {!mode ? (
        <div className="analytics-choice-grid">
          <button
            className="analytics-choice-card"
            onClick={() => setMode("project")}
          >
            <strong>Project Analytics</strong>
            <span>Compare completion volume and average delivery time.</span>
          </button>

          <button
            className="analytics-choice-card"
            onClick={() => setMode("employee")}
          >
            <strong>Employee Analytics</strong>
            <span>Rank efficiency from task start to completion.</span>
          </button>
        </div>
      ) : (
        <>
          <div className="analytics-mode-header">
            <h3>
              {mode === "project" ? "Project Analytics" : "Employee Analytics"}
            </h3>
            <button
              className="btn btn-secondary"
              onClick={() => setMode("")}
            >
              Change View
            </button>
          </div>

          <AnalyticsCards analytics={analytics} />

          <div className="analytics-grid">
            <TaskPieChart analytics={analytics} />

            <EfficiencyBarChart
              data={
                mode === "project"
                  ? analytics.projectStats
                  : analytics.employeeStats
              }
              title={
                mode === "project"
                  ? "Project Efficiency"
                  : "Employee Efficiency"
              }
              subtitle="Lower average hours means faster task delivery. Score is compared with the team baseline."
            />

            <CompletionTrendChart
              data={analytics.completionTrend}
              title="Completion Time Trend"
              subtitle="Average hours are calculated from started time to completed time only."
            />
          </div>
        </>
      )}
    </div>
  );
}

export default AnalyticsPage;
