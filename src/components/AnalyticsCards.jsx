function AnalyticsCards({
  analytics,
}) {
  if (!analytics) {
    return null;
  }

  const cards = [
    {
      title: "Total Tasks",
      value:
        analytics.totalTasks || 0,
    },

    {
      title: "Completed",
      value:
        analytics.completedTasks || 0,
    },

    {
      title: "Pending",
      value:
        analytics.pendingTasks || 0,
    },

    {
      title: "In Progress",
      value:
        analytics.inProgressTasks || 0,
    },

    {
      title: "Avg Time",
      value: `${analytics.averageCompletionHours || 0}h`,
    },
  ];

  return (
    <div className="analytics-card-grid">
      {cards.map((card) => (
        <div
          key={card.title}
          style={{
            background:
              "var(--surface)",
            padding: 24,
            borderRadius: 18,
            border:
              "1px solid var(--border)",
          }}
        >
          <h3>{card.title}</h3>

          <h1>{card.value}</h1>
        </div>
      ))}
    </div>
  );
}

export default AnalyticsCards;
