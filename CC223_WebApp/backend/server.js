const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors()); // Allows frontend to communicate with backend
app.use(express.json()); // Parses JSON request body

let tasks = []; // In-memory task list

// Get all tasks
app.get("/tasks", (req, res) => {
    res.json(tasks);
});

// Add a new task
app.post("/tasks", (req, res) => {
    const task = req.body.task;
    if (task) {
        tasks.push(task);
        res.status(201).json({ message: "Task added", tasks });
    } else {
        res.status(400).json({ message: "Task cannot be empty" });
    }
});

// Delete a task
app.delete("/tasks/:index", (req, res) => {
    const index = req.params.index;
    if (index >= 0 && index < tasks.length) {
        tasks.splice(index, 1);
        res.json({ message: "Task deleted", tasks });
    } else {
        res.status(400).json({ message: "Invalid task index" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
