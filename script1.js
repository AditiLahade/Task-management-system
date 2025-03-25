document.addEventListener("DOMContentLoaded", () => {
    console.log("📌 DOM Loaded - Fetching tasks...");
    fetchTasks(); // ✅ Fetch tasks when the page loads
});

// ✅ Function to Fetch and Display Tasks in Table
function fetchTasks() {
    fetch("http://localhost:5001/tasks") // ✅ Correct API URL
        .then(response => response.json())
        .then(data => {
            console.log("✅ Fetched Tasks:", data); // ✅ Debugging output

            let taskTable = document.querySelector("tbody");
            if (!taskTable) {
                console.error("⚠️ Task table not found in DOM.");
                return;
            }

            taskTable.innerHTML = ""; // Clear previous tasks

            if (!Array.isArray(data)) {
                console.error("❌ Error: API response is not an array:", data);
                return;
            }

            data.forEach(task => {
                let row = `
                    <tr>
                        <td><strong>${task.task_name}</strong><br><small>${task.description || "No description"}</small></td>
                        <td>${task.task_owner}</td>
                        <td>${task.start_date ? formatDate(task.start_date) : "N/A"}</td>
                        <td>${task.due_date ? formatDate(task.due_date) : "N/A"}</td>
                        <td>${task.reminder ? formatDate(task.reminder) : "N/A"}</td>
                        <td>${task.priority}</td>
                        <td>${task.status}</td>
                        <td>
                        <a href="index3.html?id=${task.id}">
                         <button class="btn btn-warning btn-sm">Edit</button>
                          </a>

                            <button onclick="deleteTask(${task.id})" class="btn btn-danger btn-sm">Delete</button>
                        </td>
                    </tr>
                `;
                taskTable.innerHTML += row;
            });
        })
        .catch(error => console.error("❌ Error fetching tasks:", error));
}

// ✅ Function to Format Dates
function formatDate(dateString) {
    if (!dateString) return "N/A"; // ✅ Handles null or undefined dates
    let date = new Date(dateString);
    return date.toLocaleDateString();
}

// ✅ Function to Delete Task
function deleteTask(id) {
    if (confirm("❗ Are you sure you want to delete this task?")) {
        fetch(`http://localhost:5001/tasks/${id}`, { method: "DELETE" })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(() => {
                alert("✅ Task Deleted Successfully!");
                fetchTasks(); // Refresh the task list
            })
            .catch(error => console.error("❌ Error deleting task:", error));
    }
}


function editTask(id) {
    window.location.href = `index3.html?taskId=${id}`;
}



