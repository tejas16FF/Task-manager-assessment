import { useEffect, useMemo, useState } from "react";
import { Navigate, useOutletContext } from "react-router-dom";
import AnalyticsCards from "../components/AnalyticsCards";
import ProductivityBarChart from "../components/ProductivityBarChart";
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

  const chartData = useMemo(() => {
    if (!analytics) {
      return [];
    }

    if (mode === "project") {
      return (analytics.projectStats || []).map((project) => ({
        name: project.name,
        value: project.completed,
      }));
    }

    if (mode === "employee") {
      return (analytics.employeeStats || []).map((employee) => ({
        name: employee.name,
        value: employee.completed,
      }));
    }

    return [];
  }, [analytics, mode]);

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
            <span>Compare completed work across projects.</span>
          </button>

          <button
            className="analytics-choice-card"
            onClick={() => setMode("employee")}
          >
            <strong>Employee Analytics</strong>
            <span>Compare completed work across employees.</span>
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: 24,
              marginTop: 30,
            }}
          >
            <TaskPieChart analytics={analytics} />

            <ProductivityBarChart
              data={chartData}
              title={
                mode === "project"
                  ? "Project Ogive"
                  : "Employee Ogive"
              }
            />
          </div>
        </>
      )}
    </div>
  );
}

export default AnalyticsPage;
