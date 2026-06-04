import { useEffect, useMemo, useState } from "react";
import {
  Link,
  Navigate,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import {
  CompletionTrendChart,
  EfficiencyBarChart,
} from "../components/EfficiencyCharts";
import { api } from "../utils/api";

function formatHours(value) {
  return `${Number(value || 0).toFixed(1)}h`;
}

function StatTile({ label, value }) {
  return (
    <div className="dashboard-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function EmployeesPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAdmin } = useOutletContext();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeStats, setEmployeeStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedProjectName, setSelectedProjectName] = useState("");

  useEffect(() => {
    if (!isAdmin) {
      return undefined;
    }

    let cancelled = false;

    Promise.resolve()
      .then(() => api.get("/users"))
      .then((response) => {
        if (!cancelled) {
          setEmployees(response.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin || !id) {
      return undefined;
    }

    let cancelled = false;

    Promise.resolve()
      .then(() => {
        if (!cancelled) {
          setLoading(true);
        }

        return api.get(`/users/${id}/stats`);
      })
      .then((response) => {
        if (!cancelled) {
          setEmployeeStats(response.data);
          setSelectedEmployee(response.data.user);
          setSelectedProjectName("");
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id, isAdmin]);

  const projectAnalytics = useMemo(
    () => employeeStats?.projectAnalytics || [],
    [employeeStats]
  );

  const selectedProjectAnalytics = useMemo(
    () =>
      projectAnalytics.find((project) => project.name === selectedProjectName) ||
      null,
    [projectAnalytics, selectedProjectName]
  );

  const selectedProjectTasks = useMemo(() => {
    if (!selectedProjectName) {
      return [];
    }

    return (employeeStats?.tasks || []).filter(
      (task) => (task.project || "General") === selectedProjectName
    );
  }, [employeeStats, selectedProjectName]);

  if (!isAdmin) {
    return <Navigate to="/tasks" replace />;
  }

  return (
    <div className="employees-page">
      <div className="page-heading">
        <div>
          <h2>Employees</h2>
          <p className="muted">
            Review employee delivery time, efficiency, and project performance.
          </p>
        </div>
      </div>

      <div className="employee-analytics-layout">
        <aside className="employee-directory">
          <div className="employee-directory-header">
            <h3>Team Members</h3>
            <span>{employees.length}</span>
          </div>

          <div className="employee-directory-list">
            {employees.map((employee) => (
              <button
                key={employee._id}
                className={`employee-directory-item${
                  selectedEmployee?._id === employee._id ? " active" : ""
                }`}
                onClick={() => navigate(`/employees/${employee._id}`)}
              >
                <span className="employee-directory-avatar">
                  {employee.name?.charAt(0).toUpperCase()}
                </span>

                <span className="employee-directory-copy">
                  <strong>{employee.name}</strong>
                  <small>{employee.designation || employee.role}</small>
                </span>
              </button>
            ))}
          </div>
        </aside>

        <section className="employee-insights">
          {!selectedEmployee ? (
            <div className="employee-empty">
              <div className="employee-empty-icon">+</div>
              <h3>Select employee</h3>
              <p>Choose a team member to view timed delivery analytics.</p>
            </div>
          ) : loading ? (
            <div className="loading-state">
              <span className="spinner" />
              Loading employee analytics...
            </div>
          ) : (
            <>
              <div className="employee-profile-banner">
                <div className="employee-big-avatar">
                  {selectedEmployee.name?.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h3>{selectedEmployee.name}</h3>
                  <p className="muted">
                    {selectedEmployee.designation || selectedEmployee.role}
                    {selectedEmployee.department
                      ? ` | ${selectedEmployee.department}`
                      : ""}
                  </p>
                </div>
              </div>

              <div className="employee-kpi-grid">
                <StatTile
                  label="Total Tasks"
                  value={employeeStats?.stats?.totalTasks || 0}
                />
                <StatTile
                  label="Completed"
                  value={employeeStats?.stats?.completedTasks || 0}
                />
                <StatTile
                  label="Avg Time"
                  value={formatHours(employeeStats?.stats?.averageHours)}
                />
                <StatTile
                  label="Efficiency"
                  value={`${employeeStats?.stats?.efficiencyScore || 0}`}
                />
                <StatTile
                  label="Completion"
                  value={`${employeeStats?.stats?.completionRate || 0}%`}
                />
              </div>

              <div className="employee-chart-grid">
                <CompletionTrendChart
                  data={employeeStats?.completionTrend}
                  title="Overall Completion Trend"
                  subtitle="Average time is measured from task start to completion."
                />

                <EfficiencyBarChart
                  data={projectAnalytics}
                  title="Project Efficiency"
                  subtitle="Compare this employee's average completion time by project."
                />
              </div>

              <div className="employee-project-panel">
                <div className="employee-section-heading">
                  <h3>Assigned Projects</h3>
                  <p className="muted">
                    Select a project to focus the graph and task history.
                  </p>
                </div>

                <div className="employee-project-grid">
                  {projectAnalytics.map((project) => (
                    <button
                      key={project.name}
                      className={`employee-project-card${
                        selectedProjectName === project.name ? " active" : ""
                      }`}
                      onClick={() => setSelectedProjectName(project.name)}
                    >
                      <strong>{project.name}</strong>
                      <span>{project.completedTasks} completed</span>
                      <small>{formatHours(project.averageHours)} avg time</small>
                    </button>
                  ))}
                </div>
              </div>

              {selectedProjectAnalytics && (
                <div className="employee-chart-grid">
                  <CompletionTrendChart
                    data={selectedProjectAnalytics.trend}
                    title={`${selectedProjectName} Trend`}
                    subtitle="Project-specific completion time for this employee."
                  />

                  <EfficiencyBarChart
                    data={[selectedProjectAnalytics]}
                    title={`${selectedProjectName} Efficiency`}
                    subtitle="Focused view for the selected project."
                  />
                </div>
              )}

              {selectedProjectName && (
                <div className="employee-project-panel">
                  <div className="employee-section-heading">
                    <h3>{selectedProjectName} Tasks</h3>
                    <p className="muted">
                      Completed task times come from started and completed
                      timestamps.
                    </p>
                  </div>

                  <div className="employee-task-list">
                    {selectedProjectTasks.map((task) => (
                      <div key={task._id} className="employee-task-row">
                        <div>
                          <h4>{task.title}</h4>
                          <div className="employee-task-meta">
                            <span className="badge">{task.priority}</span>
                            <span className={`badge-status ${task.status}`}>
                              {task.status?.replace("_", " ")}
                            </span>
                            <span className="badge">
                              {formatHours((task.totalTimeTaken || 0) / 3600)}
                            </span>
                          </div>
                        </div>

                        <Link
                          className="btn btn-secondary btn-sm"
                          to={`/tasks/${task._id}`}
                        >
                          Details
                        </Link>
                      </div>
                    ))}

                    {selectedProjectTasks.length === 0 && (
                      <p className="muted">No tasks assigned in this project.</p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default EmployeesPage;
