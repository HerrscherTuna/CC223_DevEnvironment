const API_URL = "http://localhost:3000/tasks";

async function fetchTasks() {
    const response = await fetch(API_URL);
    const tasks = await response.json();
    displayTasks(tasks);
}

function displayTasks(tasks) {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; // Clear existing tasks

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.textContent = task;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = async function () {
            await deleteTask(index);
        };

        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

async function addTask() {
    const taskInput = document.getElementById("taskInput");
    const task = taskInput.value.trim();

    if (task === "") {
        alert("Please enter a task!");
        return;
    }

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task }),
    });

    taskInput.value = "";
    fetchTasks(); // Refresh the list
}

async function deleteTask(index) {
    await fetch(`${API_URL}/${index}`, { method: "DELETE" });
    fetchTasks(); // Refresh the list
}

// Fetch tasks when the page loads
fetchTasks();
