import { Navigate, useOutletContext } from "react-router-dom";
import MemberForm from "../components/MemberForm";
import ProjectForm from "../components/ProjectForm";

function ManagePage() {
  const { isAdmin } = useOutletContext();

  if (!isAdmin) {
    return <Navigate to="/tasks" replace />;
  }

  return (
    <>
      <div className="page-heading">
        <h2>Setup</h2>
        <p className="muted">Create team members and projects before assigning tasks.</p>
      </div>

      <ProjectForm />
      <MemberForm />
    </>
  );
}

export default ManagePage;
