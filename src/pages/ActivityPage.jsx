import { useEffect, useState } from "react";
import { api } from "../utils/api";

function ActivityPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  async function fetchActivities() {
    try {
      setLoading(true);

      const response = await api.get("/activities");

      setActivities(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p>Loading activities...</p>;
  }

  return (
    <div className="activity-page">
      <h2>Activity Feed</h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        {activities.length === 0 ? (
          <p>No activities found</p>
        ) : (
          activities.map((activity) => (
            <div
              key={activity._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "12px",
                padding: "15px",
              }}
            >
              <strong>
                {activity.actor?.name || "Unknown User"}
              </strong>

              <p style={{ marginTop: "8px" }}>
                {activity.message}
              </p>

              <p
                style={{
                  marginTop: "10px",
                  opacity: 0.7,
                  fontSize: "14px",
                }}
              >
                {new Date(
                  activity.createdAt
                ).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ActivityPage;