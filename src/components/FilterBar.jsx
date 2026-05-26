function FilterBar({
  filter,
  setFilter,
}) {
  const filters = [
    "All",
    "Low",
    "Medium",
    "High",
    "Completed",
  ];

  return (
    <div className="filter-bar">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() =>
            setFilter(f)
          }
          className={`filter-btn${
            filter === f
              ? " active"
              : ""
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;