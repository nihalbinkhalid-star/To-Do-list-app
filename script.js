let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskInput = document.getElementById("taskInput");
const taskTime = document.getElementById("taskTime");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

/* Request notification permission */
if ("Notification" in window) {
    Notification.requestPermission();
}

/* Save tasks */
function saveTasks(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* Render tasks */
function renderTasks(){

    taskList.innerHTML = "";

    tasks.forEach((task,index)=>{

        const li = document.createElement("li");

        if(task.completed){
            li.classList.add("completed");
        }

        li.innerHTML = `
            <div onclick="toggleTask(${index})" class="task-text">
                ${task.text}
                <div class="task-time">
                    ${task.time ? new Date(task.time).toLocaleString() : ""}
                </div>
            </div>

            <button class="delete-btn" onclick="deleteTask(${index})">✖</button>
        `;

        taskList.appendChild(li);
    });

}

/* Add task */
addBtn.addEventListener("click",()=>{

    const text = taskInput.value.trim();
    const time = taskTime.value;

    if(text === ""){
        alert("Enter a task");
        return;
    }

    tasks.push({
        text:text,
        time:time,
        completed:false,
        notified:false
    });

    taskInput.value="";
    taskTime.value="";

    saveTasks();
    renderTasks();

});

/* Toggle complete */
function toggleTask(index){
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

/* Delete */
function deleteTask(index){
    tasks.splice(index,1);
    saveTasks();
    renderTasks();
}

/* Notification checker */
function checkNotifications(){

    const now = new Date().getTime();

    tasks.forEach((task,index)=>{

        if(task.time && !task.notified){

            if(new Date(task.time).getTime() <= now){

                if(Notification.permission === "granted"){
                    new Notification("Task Reminder",{
                        body: task.text
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
