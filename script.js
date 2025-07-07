const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

// Add task
function addTask() {
    const task = inputBox.value.trim();

    if (task === "") {
        alert("Please write something");
    } else {
        createTaskElement(task);
        inputBox.value = "";
        saveData();
    }
}

// Create task element
function createTaskElement(taskText, isChecked = false) {
    const li = document.createElement("li");
    li.textContent = taskText;

    if (isChecked) {
        li.classList.add("checked");
    }

    const span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);

    listContainer.appendChild(li);
}

// Check, uncheck, or delete
listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveData();
        checkAllTasksCompletedByChecking();
    } else if (e.target.tagName === "SPAN") {
        const li = e.target.parentElement;
        li.classList.add("removed");

        // Remove after animation
        setTimeout(() => {
            li.remove();
            saveData();
            // ❌ No confetti check here
        }, 500);
    }
}, false);

// Save tasks to localStorage
function saveData() {
    const tasks = [];
    listContainer.querySelectorAll("li").forEach(li => {
        tasks.push({
            text: li.childNodes[0].nodeValue,
            checked: li.classList.contains("checked")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks
function showTask() {
    listContainer.innerHTML = "";
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(task => {
        createTaskElement(task.text, task.checked);
    });
}
showTask();

// ✅ Confetti ONLY when all tasks are completed manually
function checkAllTasksCompletedByChecking() {
    const listItems = listContainer.querySelectorAll("li");

    if (listItems.length === 0) return; // No tasks → don't show confetti

    const allChecked = Array.from(listItems).every(li =>
        li.classList.contains("checked")
    );

    if (allChecked) {
        // 🎉 One-time confetti burst
        confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 }
        });
    }
}
