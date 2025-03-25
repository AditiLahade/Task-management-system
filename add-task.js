document.getElementById("taskName").addEventListener("input", function (event) {
    let taskNameInput = this;
    let taskName = taskNameInput.value;
    
    // Allow only letters and spaces
    if (!/^[A-Za-z\s]*$/.test(taskName)) {
        taskNameInput.classList.add("is-invalid");  // Add red border
    } else {
        taskNameInput.classList.remove("is-invalid"); // Remove red border if valid
    }

    // Remove invalid characters
    taskNameInput.value = taskName.replace(/[^A-Za-z\s]/g, '');
});

document.getElementById("taskForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let taskNameInput = document.getElementById("taskName");
    let taskName = taskNameInput.value.trim();
    let startDate = document.getElementById("startDate").value;
    let dueDate = document.getElementById("dueDate").value;
    let reminder = document.getElementById("reminder").value;
    let priority = document.getElementById("priority").value;
    let status = document.getElementById("status").value;
    let description = document.getElementById("description").value.trim();

    // Clear previous errors
    taskNameInput.classList.remove("is-invalid");

    // Required Fields Validation
    if (!taskName || !startDate || !dueDate || !priority || !status || !description) {
        alert("❌ All fields are mandatory!");
        return;
    }

    // Task Name Validation - Only Letters Allowed
    let taskNameRegex = /^[A-Za-z\s]+$/;
    if (!taskNameRegex.test(taskName)) {
        alert("❌ Task Name should only contain letters!");
        taskNameInput.classList.add("is-invalid");  // Add red border
        return;
    }

    // Date Validation - Due Date should not be before Start Date
    if (new Date(dueDate) < new Date(startDate)) {
        alert("❌ Due Date cannot be before Start Date!");
        return;
    }

    // Reminder Validation - Reminder should not be before Start Date
    if (reminder && new Date(reminder) < new Date(startDate)) {
        alert("❌ Reminder cannot be before Start Date!");
        return;
    }

    // Character Limit Validation
    if (taskName.length > 50) {
        alert("❌ Task Name cannot exceed 50 characters!");
        return;
    }
    if (description.length > 200) {
        alert("❌ Description cannot exceed 200 characters!");
        return;
    }

    addTask();  // Call addTask function if all validations pass
});

// ✅ Function to Add Task
function addTask() {
    let taskData = {
        task_owner: document.getElementById("taskOwner").value,
        task_name: document.getElementById("taskName").value.trim(),
        description: document.getElementById("description").value.trim(),
        start_date: document.getElementById("startDate").value,
        due_date: document.getElementById("dueDate").value,
        reminder: document.getElementById("reminder").value || null, // Convert empty to NULL
        priority: document.getElementById("priority").value,
        status: document.getElementById("status").value
    };

    console.log("Submitting Task:", taskData);

    fetch("http://localhost:5001/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        alert("✅ Task Added Successfully!");
        document.getElementById("taskForm").reset();
        window.location.href = "index.html";
    })
    .catch(error => console.error("❌ Error adding task:", error));
}
