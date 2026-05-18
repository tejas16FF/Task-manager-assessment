import { useMemo, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import FilterBar from "../components/FilterBar";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { useTaskStore } from "../store/useTaskStore";
import { getTaskProjectName } from "../utils/projectGroups";

function ProjectTasksPage() {
  const { isAdmin, tasks } = useOutletContext();
  const { projectName = "" } = useParams();
  const { error, loading } = useTaskStore();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const decodedProjectName = useMemo(
    () => decodeURIComponent(projectName),
    [projectName]
  );

  const projectTasks = tasks.filter((task) => (
    getTaskProjectName(task) === decodedProjectName
  ));

  const filteredTasks = projectTasks.filter((task) => {
    const matchesFilter =
      filter === "All"
        ? true
        : filter === "Completed"
          ? task.completed
          : task.priority === filter;

    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <div className="page-heading">
        <h2>{decodedProjectName}</h2>
        <p className="muted">Project tasks</p>
      </div>

      {isAdmin && (
        <TaskForm
          key={decodedProjectName}
          defaultProject={decodedProjectName}
        />
      )}

      <FilterBar filter={filter} setFilter={setFilter} />

      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search"
      />

      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Loading tasks...</p>}

      <p className="muted">Showing {filteredTasks.length} tasks</p>

      {filteredTasks.length === 0 && !loading ? (
        <p className="muted">No tasks found for this project</p>
      ) : (
        <TaskList tasks={filteredTasks} isAdmin={isAdmin} />
      )}
    </>
  );
}

export default ProjectTasksPage;
