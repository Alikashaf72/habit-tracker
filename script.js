// Initialize a unique task count
let taskCount = 0;

// Initialize an array to store task data
let taskData = [];

// Load tasks from local storage when the page loads
window.onload = function() {
  loadTasksFromLocalStorage();
};

// Function to load tasks from local storage
function loadTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem('tasks-all');
  if (storedTasks) {
    taskData = JSON.parse(storedTasks);
    taskData.forEach((task) => {
      createTaskElement(task.id, task.name, task.streak);
      taskCount = Math.max(taskCount, task.id);
    });
  } else {
    taskData = [];
  }
}

// Add event listener for adding new tasks
const addNewTasks = document.getElementById("addNewTask");
addNewTasks.addEventListener("click", function (e) {
  e.preventDefault();
  addNewTask();
});

// Add a new task based on user input
function addNewTask() {
  const taskInput = document.getElementById('task-input');
  const taskNameValue = taskInput.value.trim();

  // Validate task name
  if (taskNameValue === '') {
    alert('Please enter a task name');
    return;
  }

  taskCount++; // Increment task counter for unique ID
  const taskId = taskCount;
  const initialStreak = 0;

  // Store the task in local storage
  saveTaskToLocalStorage(taskId, taskNameValue, initialStreak);

 // Create task element in the DOM
  createTaskElement(taskId, taskNameValue, initialStreak);

  // Clear the input field
  taskInput.value = '';
}

// Function to create a task element
function createTaskElement(taskId, taskName, streak) {
  const task = document.createElement('div');
  task.classList.add('task');
  task.id = `tasks-${taskId}`; // Unique ID for the task element

  const taskNameElement = document.createElement('span');
  taskNameElement.classList.add('task-name');
  taskNameElement.innerText = taskName;

  const streakElement = document.createElement('span');
  streakElement.classList.add('streak');
  streakElement.id = `streak-${taskId}`;
  streakElement.innerText = `${streak}🔥`;

  const buttonGroup = document.createElement('div');
  buttonGroup.classList.add('button-group');

  // Increment button, Decrement button, Reset button, Delete button
  // Create buttons dynamically
  ["+", "-", "Reset", "Delete"].forEach((label) => {
    const button = document.createElement("button");
    button.innerText = label;
    if (label === "+") button.id = `increment-${taskId}`;
    if (label === "-") button.id = `decrement-${taskId}`;
    if (label === "Reset") button.id = `reset-${taskId}`;
    if (label === "Delete") button.classList.add("delete-btn");
    buttonGroup.appendChild(button);
  });
  
  // Append buttons to the button group
  task.appendChild(taskNameElement);
  task.appendChild(streakElement);
  task.appendChild(buttonGroup);
  
  // Append task to the task list in the DOM
  document.getElementById("task-list").appendChild(task);
}

// Function to save a task to local storage
function saveTaskToLocalStorage(taskId, taskName, streak) {
  let taskInfo = {
    id: taskId,
    name: taskName,
    streak: streak,
  };
  // let taskData
  taskData.push(taskInfo);
  localStorage.setItem(`tasks-all`, JSON.stringify(taskData));
}

// Function to update a task's streak in local storage
function updateStreakInLocalStorage(taskId, streak) {
  const task = taskData.find((task) => task.id === taskId);
  if (task) {
    task.streak = streak;
    localStorage.setItem("tasks-all", JSON.stringify(taskData));
  }
}


// Increment streak for a specific task
function incrementStreak(taskId) {
  let streak = getStreak(taskId) + 1;
  updateStreakDisplay(taskId, streak);
  updateStreakInLocalStorage(taskId, streak);
}

// Decrement streak for a specific task
function decrementStreak(taskId) {
  let streak = Math.max(0, getStreak(taskId) - 1);
  updateStreakDisplay(taskId, streak);
  updateStreakInLocalStorage(taskId, streak);
}

// Reset streak for a specific task
function resetStreak(taskId) {
  updateStreakDisplay(taskId, 0);
  updateStreakInLocalStorage(taskId, 0);
}

// Delete a task from the DOM and local storage
function deleteTask(taskId) {
  const taskElement = document.getElementById(`tasks-${taskId}`);
  if (taskElement) {
    taskElement.remove(); // Removes the task element from the DOM
  }

  // Update task data and localStorage
  taskData = taskData.filter((task) => task.id !== taskId);
  localStorage.setItem("tasks-all", JSON.stringify(taskData));
}

// Helper function to get the current streak for a specific task
function getStreak(taskId) {
  const task = taskData.find((task) => task.id === taskId);
  return task ? task.streak : 0;
}

// Helper function to update the streak display for a specific task
function updateStreakDisplay(taskId, streak) {
  const streakElement = document.getElementById(`streak-${taskId}`);
  if (streakElement) {
    streakElement.innerText = `${streak}🔥`;
  }
}

// Event delegation for button clicks
document.getElementById("task-list").addEventListener("click", function (e) {
  const target = e.target;
  const taskId = parseInt(target.id.split("-")[1], 10);

  if (target.id.startsWith("increment-")) {
    incrementStreak(taskId);
  } else if (target.id.startsWith("decrement-")) {
    decrementStreak(taskId);
  } else if (target.id.startsWith("reset-")) {
    resetStreak(taskId);
  } else if (target.classList.contains("delete-btn")) {
    const taskId = parseInt(target.parentNode.parentNode.id.split("-")[1], 10);
    deleteTask(taskId);
  }
});
