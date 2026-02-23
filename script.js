let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// Request notification permission
if ("Notification" in window) {
    Notification.requestPermission();
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <div onclick="toggleTask(${index})">
                <b>${task.text}</b><br>
                <small>${task.time ? new Date(task.time).toLocaleString() : ""}</small>
            </div>
            <button class="delete-btn" onclick="deleteTask(${index})">✖</button>
        `;

        list.appendChild(li);
    });
}

function addTask() {
    const input = document.getElementById("taskInput");
    const timeInput = document.getElementById("taskTime");

    const text = input.value.trim();
    const time = timeInput.value;

    if (text === "") return;

    tasks.push({
        text: text,
        time: time,
        completed: false,
        notified: false
    });

    input.value = "";
    timeInput.value = "";

    saveTasks();
    renderTasks();
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}


/* Notification checker */
function checkNotifications() {
    const now = new Date().getTime();

    tasks.forEach((task, index) => {
        if (
            task.time &&
            !task.notified &&
            new Date(task.time).getTime() <= now
        ) {
            showNotification(task.text);
            tasks[index].notified = true;
            saveTasks();
        }
    });
}


function showNotification(message) {
    if (Notification.permission === "granted") {
        new Notification("⏰ Task Reminder", {
            body: message,
            icon: "https://cdn-icons-png.flaticon.com/512/1827/1827392.png"
        });
    }
}


/* Check every 5 seconds */
setInterval(checkNotifications, 5000);

renderTasks();
