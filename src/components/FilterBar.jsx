function FilterBar({ filter, setFilter }) {
  const filters = ["All", "Low", "Medium", "High"];

  return (
    <div style={{ margin: "15px 0", textAlign: "center" }}>
      {filters.map((f) => (
        <button
          key={f}
          className={`filter-btn ${filter === f ? "active" : ""}`}
          onClick={() => setFilter(f)}
          style={{ margin: "5px" }}
        >
          {f}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;