import {
  Navigate,
  useOutletContext,
} from "react-router-dom";

import MemberForm from "../components/MemberForm";
import ProjectForm from "../components/ProjectForm";

function ManagePage() {
  const { isAdmin } =
    useOutletContext();

  if (!isAdmin) {
    return (
      <Navigate
        to="/tasks"
        replace
      />
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <div className="page-heading">
        <h2>Setup</h2>

        <p className="muted">
          Create team members and
          projects before assigning
          tasks.
        </p>
      </div>

      <div
        style={{
          background:
            "var(--surface)",
          border:
            "1px solid var(--border)",
          borderRadius: "18px",
          padding: "24px",
        }}
      >
        <ProjectForm />
      </div>

      <div
        style={{
          background:
            "var(--surface)",
          border:
            "1px solid var(--border)",
          borderRadius: "18px",
          padding: "24px",
        }}
      >
        <MemberForm />
      </div>
    </div>
  );
}

export default ManagePage;