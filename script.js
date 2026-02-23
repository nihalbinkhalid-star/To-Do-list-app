let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskInput = document.getElementById("taskInput");
const taskTime = document.getElementById("taskTime");
const taskList = document.getElementById("taskList");
const addBtn = document.getElementById("addBtn");

/* Notification permission */
if ("Notification" in window) {
    Notification.requestPermission();
}

/* Save */
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* Render */
function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {

        const li = document.createElement("li");

        li.innerHTML = `
            <div>
                ${task.text}<br>
                <small>${task.time ? new Date(task.time).toLocaleString() : ""}</small>
            </div>
            <button onclick="deleteTask(${index})">X</button>
        `;

        taskList.appendChild(li);
    });
}

/* Add Task */
addBtn.addEventListener("click", function () {

    const text = taskInput.value.trim();
    const time = taskTime.value;

    if (text === "") {
        alert("Enter a task");
        return;
    }

    tasks.push({
        text: text,
        time: time,
        notified:false
    });

    taskInput.value = "";
    taskTime.value = "";

    saveTasks();
    renderTasks();
});

/* Delete */
function deleteTask(index){
    tasks.splice(index,1);
    saveTasks();
    renderTasks();
}

/* Notification Checker */
function checkNotifications(){

    const now = new Date().getTime();

    tasks.forEach((task,index)=>{
        if(task.time && !task.notified){

            if(new Date(task.time).getTime() <= now){

                if(Notification.permission === "granted"){
                    new Notification("Task Reminder",{
                        body:task.text
                    });
                }

                tasks[index].notified = true;
                saveTasks();
            }
        }
    });
}

setInterval(checkNotifications,5000);

renderTasks();
