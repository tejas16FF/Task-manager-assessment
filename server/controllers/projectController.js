const Project = require("../models/Project");
const Task = require("../models/Task");

async function getProjects(req, res) {
  try {
    if (req.user.role !== "admin") {
      const tasks = await Task.find({ assignedTo: req.user._id }).select("project").lean();
      const projectNames = [...new Set(tasks.map((task) => task.project || "General"))]
        .sort((a, b) => a.localeCompare(b));

      return res.json(projectNames.map((name) => ({ name })));
    }

    const [projects, tasks] = await Promise.all([
      Project.find().sort({ name: 1 }).lean(),
      Task.find().select("project").lean(),
    ]);

    const projectMap = new Map();

    projects.forEach((project) => {
      projectMap.set(project.name, project);
    });

    tasks.forEach((task) => {
      const name = task.project || "General";
      if (!projectMap.has(name)) {
        projectMap.set(name, { name });
      }
    });

    return res.json(
      Array.from(projectMap.values())
        .sort((a, b) => a.name.localeCompare(b.name))
    );
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function createProject(req, res) {
  try {
    const name = req.body.name?.trim();

    if (!name || name.length < 2) {
      return res.status(400).json({ message: "Project name must be at least 2 characters" });
    }

    const project = await Project.findOneAndUpdate(
      { name },
      { $setOnInsert: { name, createdBy: req.user._id } },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(201).json(project);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createProject,
  getProjects,
};
