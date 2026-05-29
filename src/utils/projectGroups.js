export function getTaskProjectName(task) {
  return task.project || "General";
}

export function buildProjectGroups(tasks) {
  const groups = new Map();

  tasks.forEach((task) => {
    const projectName = getTaskProjectName(task);
    const projectTasks = groups.get(projectName) || [];
    projectTasks.push(task);
    groups.set(projectName, projectTasks);
  });

  return Array.from(groups.entries())
    .map(([name, projectTasks]) => ({ name, tasks: projectTasks }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function buildProjectGroupsWithProjects(tasks, projects) {
  const groups = new Map();
  const projectMeta = new Map();

  projects.forEach((project) => {
    groups.set(project.name, []);
    projectMeta.set(project.name, project);
  });

  tasks.forEach((task) => {
    const projectName = getTaskProjectName(task);
    const projectTasks = groups.get(projectName) || [];
    projectTasks.push(task);
    groups.set(projectName, projectTasks);
  });

  return Array.from(groups.entries())
    .map(([name, projectTasks]) => ({
      ...(projectMeta.get(name) || {}),
      name,
      tasks: projectTasks,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getProjectNames(tasks, projects) {
  return buildProjectGroupsWithProjects(tasks, projects).map((project) => project.name);
}
