const path = require("path");
const fs = require("fs");
const readline = require("readline");

const tasksFilePath = path.join(__dirname,"task.json");

if(!fs.existsSync(tasksFilePath)){
    console.log("File does not exist, creating it now");
    fs.writeFileSync(tasksFilePath,'[]');
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const getMyTasks = ()=>{
    const tasks = fs.readFileSync(tasksFilePath,'utf8');
    return JSON.parse(tasks);
}

const saveMyTasks = (tasks) =>{
    fs.writeFileSync(tasksFilePath,JSON.stringify(tasks));
}

const addTask = (task) =>{
    const tasks = getMyTasks();
    tasks.push({description:task,completed:false});
    saveMyTasks(tasks);
    console.log("Task added successfully");
}

//listing
const listTasks = () =>{
    const tasks = getMyTasks();
    tasks.forEach((task, index) => {
        console.log(`${index + 1}. ${task.description} - [${task.completed ? "Done" : "Not Done"}]`)
      }) 
}

//complete task
const completeTask = (taskNumber) =>{
    const tasks = getMyTasks();
    if(tasks[taskNumber - 1]){
        tasks[taskNumber - 1].completed = true;
        saveMyTasks(tasks);
        console.log("Task marked as completed");
    }else{
        console.log("Invalid task number");
    }
    return;
}

//delete
const deleteTask = (taskNumber) =>{
    const tasks = getMyTasks();
    if(tasks[taskNumber - 1]){
        const filteredTask = tasks.filter((task, index) => index !== taskNumber - 1);
    saveMyTasks(filteredTask);
    console.info("Task deleted successfully");
  } else {
    console.warn("Invalid task number");
  }
  return;
}

  const moveTaskToTXt = ()=>{
    const tasks = getMyTasks();
    fs.writeFileSync(path.join(__dirname,"task.txt"),"");
    tasks.forEach((task,index)=>{
      fs.appendFileSync(path.join(__dirname,"task.txt"),`${task.description} - [${task
        .completed ? "Done" : "Not Done"}]\n`
        );
        });
  }

function todoManager() {
    rl.question(`What would you like to do?
    1. Add a task
    2. List all tasks
    3. Mark task as completed
    4. Delete Task
    5. Exit
    `, (answer) => {
      switch(answer) {
        case "1":
          rl.question("Enter your task: ", (task) => {
            addTask(task);
            todoManager();
          })
          break;
        case "2":
          listTasks();
          todoManager();
          break;
        case "3":
          rl.question("Enter the task number you want to complete: ", (taskNumber) => {
            completeTask(+taskNumber); // string number into number
            todoManager();
          });
          break
        case "4":
          rl.question("Enter the task number you want to delete: ", (taskNumber) => {
            deleteTask(+taskNumber);
            todoManager();
          });
          break;
        case "5":
          moveTaskToTXt();
          rl.close();
          break;
        default:
          console.log("Invalid option");
          todoManager();
      }
    })
  }
  
  todoManager();
