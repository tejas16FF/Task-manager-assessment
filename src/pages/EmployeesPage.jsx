import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../utils/api";

function EmployeesPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [employees, setEmployees] =
    useState([]);

  const [
    selectedEmployee,
    setSelectedEmployee,
  ] = useState(null);

  const [
    employeeStats,
    setEmployeeStats,
  ] = useState(null);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (id) {
      fetchEmployeeStats(id);
    }
  }, [id]);

  async function fetchEmployees() {
    try {
      const response =
        await api.get("/users");

      setEmployees(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchEmployeeStats(
    userId
  ) {
    try {
      setLoading(true);

      const response =
        await api.get(
          `/users/${userId}/stats`
        );

      setEmployeeStats(
        response.data
      );

      setSelectedEmployee(
        response.data.user
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="employees-page">
      <div className="page-heading">
        <h2>Employees</h2>

        <p className="muted">
          View employee
          performance and
          assigned tasks
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "340px 1fr",
          gap: "24px",
          marginTop: "24px",
        }}
      >
        {/* LEFT PANEL */}

        <div
          style={{
            background:
              "var(--surface)",

            border:
              "1px solid var(--border)",

            borderRadius:
              "24px",

            padding: "24px",

            height: "fit-content",
          }}
        >
          <h3
            style={{
              marginBottom:
                "20px",
            }}
          >
            Team Members
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection:
                "column",
              gap: "14px",
            }}
          >
            {employees.map(
              (employee) => (
                <div
                  key={
                    employee._id
                  }
                  style={{
                    padding:
                      "18px",

                    border:
                      selectedEmployee?._id ===
                      employee._id
                        ? "1px solid #7c6cff"
                        : "1px solid var(--border)",

                    borderRadius:
                      "20px",

                    background:
                      selectedEmployee?._id ===
                      employee._id
                        ? "rgba(124,108,255,0.08)"
                        : "transparent",

                    transition:
                      "0.2s",
                  }}
                >
                  <div
                    style={{
                      display:
                        "flex",

                      alignItems:
                        "center",

                      gap: "14px",
                    }}
                  >
                    <div
                      style={{
                        width:
                          "56px",

                        height:
                          "56px",

                        borderRadius:
                          "50%",

                        background:
                          "linear-gradient(135deg,#7c6cff,#5b4eff)",

                        display:
                          "flex",

                        alignItems:
                          "center",

                        justifyContent:
                          "center",

                        fontWeight:
                          "700",

                        fontSize:
                          "20px",

                        color:
                          "white",
                      }}
                    >
                      {employee.name
                        ?.charAt(
                          0
                        )
                        .toUpperCase()}
                    </div>

                    <div
                      style={{
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <h4
                        style={{
                          margin:
                            0,
                        }}
                      >
                        {
                          employee.name
                        }
                      </h4>

                      <p
                        className="muted"
                        style={{
                          marginTop:
                            "4px",
                        }}
                      >
                        {
                          employee.role
                        }
                      </p>
                    </div>

                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() =>
                        navigate(
                          `/employees/${employee._id}`
                        )
                      }
                    >
                      Details
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}

        <div>
          {!selectedEmployee ? (
            <div
              style={{
                background:
                  "var(--surface)",

                border:
                  "1px solid var(--border)",

                borderRadius:
                  "24px",

                padding:
                  "40px",

                textAlign:
                  "center",
              }}
            >
              <h3>
                Select employee
              </h3>

              <p className="muted">
                Choose a team
                member to view
                stats and
                assigned tasks
              </p>
            </div>
          ) : loading ? (
            <p>
              Loading stats...
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: "24px",
              }}
            >
              {/* STATS */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(4,1fr)",
                  gap: "16px",
                }}
              >
                <div className="dashboard-item">
                  <span>
                    Total Tasks
                  </span>

                  <strong>
                    {
                      employeeStats
                        ?.stats
                        ?.totalTasks
                    }
                  </strong>
                </div>

                <div className="dashboard-item">
                  <span>
                    Completed
                  </span>

                  <strong>
                    {
                      employeeStats
                        ?.stats
                        ?.completedTasks
                    }
                  </strong>
                </div>

                <div className="dashboard-item">
                  <span>
                    Pending
                  </span>

                  <strong>
                    {
                      employeeStats
                        ?.stats
                        ?.pendingTasks
                    }
                  </strong>
                </div>

                <div className="dashboard-item">
                  <span>
                    Completion %
                  </span>

                  <strong>
                    {
                      employeeStats
                        ?.stats
                        ?.completionRate
                    }
                    %
                  </strong>
                </div>
              </div>

              {/* TASKS */}

              <div
                style={{
                  background:
                    "var(--surface)",

                  border:
                    "1px solid var(--border)",

                  borderRadius:
                    "24px",

                  padding:
                    "24px",
                }}
              >
                <h3
                  style={{
                    marginBottom:
                      "20px",
                  }}
                >
                  Assigned Tasks
                </h3>

                <div
                  style={{
                    display:
                      "flex",

                    flexDirection:
                      "column",

                    gap: "16px",
                  }}
                >
                  {employeeStats?.tasks?.map(
                    (
                      task
                    ) => (
                      <div
                        key={
                          task._id
                        }
                        style={{
                          padding:
                            "20px",

                          border:
                            "1px solid var(--border)",

                          borderRadius:
                            "20px",
                        }}
                      >
                        <h4>
                          {
                            task.title
                          }
                        </h4>

                        <div
                          style={{
                            display:
                              "flex",

                            gap: "12px",

                            marginTop:
                              "12px",

                            flexWrap:
                              "wrap",
                          }}
                        >
                          <span className="badge">
                            {
                              task.priority
                            }
                          </span>

                          <span className="badge-status completed">
                            {task.completed
                              ? "Completed"
                              : "Pending"}
                          </span>

                          <span className="badge">
                            {task.project ||
                              "General"}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* PROJECTS */}

              <div
                style={{
                  background:
                    "var(--surface)",

                  border:
                    "1px solid var(--border)",

                  borderRadius:
                    "24px",

                  padding:
                    "24px",
                }}
              >
                <h3
                  style={{
                    marginBottom:
                      "20px",
                  }}
                >
                  Projects
                </h3>

                <div
                  style={{
                    display:
                      "flex",

                    flexWrap:
                      "wrap",

                    gap: "12px",
                  }}
                >
                  {employeeStats?.projects?.map(
                    (
                      project
                    ) => (
                      <div
                        key={
                          project._id
                        }
                        style={{
                          padding:
                            "12px 18px",

                          borderRadius:
                            "999px",

                          background:
                            "rgba(124,108,255,0.10)",

                          border:
                            "1px solid rgba(124,108,255,0.35)",

                          color:
                            "var(--text)",

                          fontWeight:
                            "600",

                          boxShadow:
                            "0 2px 8px rgba(124,108,255,0.08)",
                        }}
                      >
                        {
                          project.name
                        }
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeesPage;
