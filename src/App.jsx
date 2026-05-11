import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import FilterBar from "./components/FilterBar";
import { useTaskStore } from "./store/useTaskStore";

function App() {
  const { tasks, fetchTasks } = useTaskStore();

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState("light");

  // FETCH TASKS FROM MONGODB
  useEffect(() => {
    fetchTasks();
  }, []);

  // LOAD THEME
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
  }, []);

  // APPLY THEME
  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // FILTER TASKS
  const filteredTasks = tasks.filter((t) => {
    const matchesFilter =
      filter === "All"
        ? true
        : filter === "Completed"
        ? t.completed
        : t.priority === filter;

    const matchesSearch = t.title
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="container">
      <div className="top-bar">
        <h1>Task Manager</h1>

        <button
          onClick={() =>
            setTheme(theme === "light" ? "dark" : "light")
          }
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>

      <TaskForm />

      <FilterBar
        filter={filter}
        setFilter={setFilter}
      />

      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          margin: "10px 0",
          width: "100%",
        }}
      />

      <p>Showing {filteredTasks.length} tasks</p>

      {filteredTasks.length === 0 ? (
        <p>No tasks match your search</p>
      ) : (
        <TaskList tasks={filteredTasks} />
      )}
    </div>
  );
}

export default App;