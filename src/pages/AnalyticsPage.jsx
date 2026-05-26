import { useEffect, useState } from "react";

import { api } from "../utils/api";

import AnalyticsCards from "../components/AnalyticsCards";

import TaskPieChart from "../components/TaskPieChart";

import ProductivityBarChart from "../components/ProductivityBarChart";

function AnalyticsPage() {
  const [analytics, setAnalytics] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    try {
      const response =
        await api.get(
          "/analytics"
        );

      console.log(
        "ANALYTICS:",
        response.data
      );

      setAnalytics(
        response.data
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div>
        Loading analytics...
      </div>
    );
  }

  if (!analytics) {
    return (
      <div>
        No analytics data
      </div>
    );
  }

  return (
    <div
      className="page"
      style={{
        padding: 24,
      }}
    >
      <h1>
        Analytics Dashboard
      </h1>

      <AnalyticsCards
        analytics={analytics}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: 24,
          marginTop: 30,
        }}
      >
        <TaskPieChart
          analytics={analytics}
        />

        <ProductivityBarChart
          analytics={analytics}
        />
      </div>
    </div>
  );
}

export default AnalyticsPage;