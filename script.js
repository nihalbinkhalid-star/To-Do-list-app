let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskInput=document.getElementById("taskInput");
const taskTime=document.getElementById("taskTime");
const taskCategory=document.getElementById("taskCategory");
const taskList=document.getElementById("taskList");
const alarm=document.getElementById("alarmSound");

/* Notifications */

if("Notification" in window){
Notification.requestPermission();
}

/* Save */

function saveTasks(){
localStorage.setItem("tasks",JSON.stringify(tasks));
}

/* Render */

function renderTasks(){

taskList.innerHTML="";

tasks.forEach((task,index)=>{

const li=document.createElement("li");
li.draggable=true;

if(task.completed){
li.classList.add("completed");
}

li.innerHTML=`

<div class="task-info" onclick="toggleTask(${index})">

<strong>${task.text}</strong>

<span class="task-category ${task.category}">
${task.category}
</span>

<span class="countdown" id="countdown-${index}">
${task.time ? new Date(task.time).toLocaleString() : ""}
</span>

</div>

<div class="task-actions">

<button onclick="editTask(${index})">✏️</button>

<button onclick="deleteTask(${index})">🗑️</button>

</div>

`;

taskList.appendChild(li);

dragEvents(li,index);

});

}

/* Add */

document.getElementById("addTaskBtn").onclick=function(){

const text=taskInput.value.trim();
const time=taskTime.value;
const category=taskCategory.value;

if(text==="") return;

tasks.push({

text:text,
time:time,
category:category,
completed:false,
notified:false

});

taskInput.value="";
taskTime.value="";

saveTasks();
renderTasks();

}

/* Toggle */

function toggleTask(i){

tasks[i].completed=!tasks[i].completed;

saveTasks();
renderTasks();

}

/* Delete */

function deleteTask(i){

tasks.splice(i,1);

saveTasks();
renderTasks();

}

/* Edit */

function editTask(i){

let newText=prompt("Edit task",tasks[i].text);

if(newText){

tasks[i].text=newText;

saveTasks();
renderTasks();

}

}

/* Countdown + Notification */

function checkReminders(){

const now=new Date().getTime();

tasks.forEach((task,i)=>{

if(task.time){

const diff=new Date(task.time).getTime()-now;

const el=document.getElementById(`countdown-${i}`);

if(diff>0){

let mins=Math.floor(diff/60000);
let secs=Math.floor((diff%60000)/1000);

if(el) el.innerText=`⏳ ${mins}m ${secs}s`;

}

if(diff<=0 && !task.notified){

if(Notification.permission==="granted"){

new Notification("Task Reminder",{body:task.text});

}

alarm.play();

task.notified=true;

saveTasks();

}

}

});

}

setInterval(checkReminders,1000);

/* Drag & Drop */

let dragIndex;

function dragEvents(el,index){

el.addEventListener("dragstart",()=>{

dragIndex=index;

});

el.addEventListener("dragover",(e)=>{

e.preventDefault();

});

el.addEventListener("drop",()=>{

let temp=tasks[dragIndex];
tasks[dragIndex]=tasks[index];
tasks[index]=temp;

saveTasks();
renderTasks();

});

}

/* Theme toggle */

document.getElementById("themeToggle").onclick=function(){

document.body.classList.toggle("light");

}

renderTasks();
