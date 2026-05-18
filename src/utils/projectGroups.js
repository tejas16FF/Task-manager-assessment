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
