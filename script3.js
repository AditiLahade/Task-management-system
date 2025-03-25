document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("taskName").addEventListener("input", function () {
        this.value = this.value.replace(/[^A-Za-z\s]/g, ""); // Allows only letters and spaces
    });
    

    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get("id"); 

    if (taskId) {
        fetch(`http://localhost:5001/tasks/${taskId}`)
            .then(response => response.json())
            .then(task => {
                if (!task) {
                    console.error("Task not found");
                    return;
                }

                document.getElementById("taskName").value = task.task_name;
                document.getElementById("description").value = task.description;
                document.getElementById("startDate").value = task.start_date;
                document.getElementById("dueDate").value = task.due_date;
                document.getElementById("reminder").value = task.reminder;
                document.getElementById("priority").value = task.priority;
                document.getElementById("status").value = task.status;

                disableEditing(true);
            })
            .catch(error => console.error("Error fetching task:", error));
    }


    

    document.getElementById("editButton").addEventListener("click", () => {
        disableEditing(false);
    });

    document.getElementById("updateButton").addEventListener("click", (event) => {
        event.preventDefault(); // Prevent form submission
        validateAndUpdateTask();
    });
});

// Function to disable or enable input fields
function disableEditing(isDisabled) {
    let fields = ["taskName", "description", "startDate", "dueDate", "reminder", "priority", "status"];
    fields.forEach(field => document.getElementById(field).disabled = isDisabled);
}

// Function to validate input fields
// Function to validate input fields
function validateAndUpdateTask() {
    let taskName = document.getElementById("taskName");
    let startDate = document.getElementById("startDate");
    let dueDate = document.getElementById("dueDate");
    let reminder = document.getElementById("reminder");

    let isValid = true;

    // ✅ Validate Task Name (Only Letters, No Numbers or Special Characters)
    if (!/^[A-Za-z\s]+$/.test(taskName.value)) {
        taskName.classList.add("is-invalid");
        isValid = false;
    } else {
        taskName.classList.remove("is-invalid");
    }

    // ✅ Validate Start and Due Date (Due Date cannot be earlier than Start Date)
    if (startDate.value && dueDate.value && new Date(dueDate.value) < new Date(startDate.value)) {
        dueDate.classList.add("is-invalid");
        isValid = false;
    } else {
        dueDate.classList.remove("is-invalid");
    }

    // ✅ Check if all fields are filled
    let fields = [taskName, startDate, dueDate, reminder];
    fields.forEach(field => {
        if (!field.value) {
            field.classList.add("is-invalid");
            isValid = false;
        } else {
            field.classList.remove("is-invalid");
        }
    });

    if (!isValid) {
        alert("❌ Please fix errors before updating the task.");
        return;
    }

    updateTask();
}

// ✅ Function to Update Task
function updateTask() {
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get("id");

    const updatedData = {
        task_name: document.getElementById("taskName").value,
        description: document.getElementById("description").value,
        start_date: document.getElementById("startDate").value,
        due_date: document.getElementById("dueDate").value,
        reminder: document.getElementById("reminder").value,
        priority: document.getElementById("priority").value,
        status: document.getElementById("status").value,
    };

    fetch(`http://localhost:5001/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
    })
    .then(response => response.json())
    .then(() => {
        alert("✅ Task Updated Successfully!");
        window.location.href = "index.html"; // Redirect to task list
    })
    .catch(error => console.error("❌ Error updating task:", error));
}
