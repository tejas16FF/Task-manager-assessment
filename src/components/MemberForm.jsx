import { useState } from "react";
import { useTaskStore } from "../store/useTaskStore";

function MemberForm() {
  const {
    createMember,
    members,
  } = useTaskStore();

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      role: "member",
    });

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    setError("");
    setMessage("");

    try {
      setLoading(true);

      await createMember(
        formData
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "member",
      });

      setMessage(
        "Member created successfully"
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="member-panel">
      <div className="member-panel-header">
        <div>
          <h2>
            Team Members
          </h2>

          <p className="muted">
            Create and manage
            workspace users
          </p>
        </div>

        <div className="dashboard-item">
          <strong>
            {members.length}
          </strong>

          <span>Users</span>
        </div>
      </div>

      <form
        className="member-form"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(2, 1fr)",
            gap: "14px",
          }}
        >
          <input
            type="text"
            name="member_name_input"
            placeholder="Full name"
            value={
              formData.name
            }
            onChange={
              handleChange
            }
            autoComplete="off"
            required
          />

          <input
            type="email"
            name="member_email_input"
            placeholder="Email address"
            value={
              formData.email
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                email:
                  e.target
                    .value,
              })
            }
            autoComplete="new-email"
            required
          />

          <input
            type="password"
            name="member_password_input"
            placeholder="Password"
            minLength="6"
            value={
              formData.password
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                password:
                  e.target
                    .value,
              })
            }
            autoComplete="new-password"
            required
          />

          <select
            name="role"
            value={
              formData.role
            }
            onChange={
              handleChange
            }
          >
            <option value="member">
              Member
            </option>

            <option value="admin">
              Admin
            </option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{
            marginTop: "18px",
            minWidth: "190px",
          }}
        >
          {loading
            ? "Creating..."
            : "Create Member"}
        </button>
      </form>

      <div
        style={{
          marginTop: "32px",
        }}
      >
        <h3
          style={{
            marginBottom: "16px",
          }}
        >
          Existing Members
        </h3>

        <div
          style={{
            display: "flex",
            flexDirection:
              "column",
            gap: "12px",
          }}
        >
          {members.map(
            (member) => (
              <div
                key={member._id}
                style={{
                  background:
                    "rgba(255,255,255,0.03)",

                  border:
                    "1px solid var(--border)",

                  borderRadius:
                    "16px",

                  padding:
                    "16px 18px",

                  display:
                    "flex",

                  justifyContent:
                    "space-between",

                  alignItems:
                    "center",
                }}
              >
                <div>
                  <strong
                    style={{
                      display:
                        "block",
                      marginBottom:
                        "4px",
                    }}
                  >
                    {
                      member.name
                    }
                  </strong>

                  <span
                    className="muted"
                    style={{
                      fontSize:
                        "14px",
                    }}
                  >
                    {
                      member.email
                    }
                  </span>
                </div>

                <div
                  style={{
                    padding:
                      "8px 14px",

                    borderRadius:
                      "999px",

                    background:
                      member.role ===
                      "admin"
                        ? "rgba(239,68,68,0.14)"
                        : "rgba(99,102,241,0.14)",

                    color:
                      member.role ===
                      "admin"
                        ? "#ff7b7b"
                        : "#8b80ff",

                    fontWeight:
                      "600",

                    textTransform:
                      "capitalize",
                  }}
                >
                  {
                    member.role
                  }
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      {message && (
        <p className="success">
          {message}
        </p>
      )}
    </div>
  );
}
export default MemberForm;