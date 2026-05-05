import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import FilterBar from "./components/FilterBar";
import { useTaskStore } from "./store/useTaskStore";

function App() {
  const { tasks, setTasks } = useTaskStore();
  const [filter, setFilter] = useState("All");
  const [loaded, setLoaded] = useState(false); // 👈 important fix

  // Load tasks from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(stored);
    setLoaded(true); // 👈 mark as loaded
  }, [setTasks]);

  // Save tasks to localStorage
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, loaded]);

  const filteredTasks =
    filter === "All"
      ? tasks
      : tasks.filter((t) => t.priority === filter);

  return (
    <div className="container">
      <h1>Task Manager</h1>

      <TaskForm />

      <FilterBar filter={filter} setFilter={setFilter} />

      <p>Showing {filteredTasks.length} tasks</p>

      <TaskList tasks={filteredTasks} />
    </div>
  );
}

export default App;