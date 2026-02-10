const fs = require('fs');
const path = require('path');

const TASKS_FILE = path.join(__dirname, 'tasks.json');

// Load tasks from JSON file
function loadTasks() {
  try {
    if (fs.existsSync(TASKS_FILE)) {
      const data = fs.readFileSync(TASKS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading tasks file:', error.message);
  }
  return [];
}

// Save tasks to JSON file
function saveTasks(tasks) {
  try {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving tasks:', error.message);
  }
}

// Generate unique ID for task
function generateId() {
  return Date.now().toString();
}

// Add a new task
function addTask(title) {
  if (!title) {
    console.error('Error: Task title is required');
    return;
  }
  
  const tasks = loadTasks();
  const newTask = {
    id: generateId(),
    title: title,
    status: 'not-done', // not-done, in-progress, done
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  tasks.push(newTask);
  saveTasks(tasks);
  console.log(`✓ Task added: "${title}" (ID: ${newTask.id})`);
}

// Update a task title
function updateTask(id, newTitle) {
  if (!id || !newTitle) {
    console.error('Error: Task ID and new title are required');
    return;
  }
  
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === id);
  
  if (!task) {
    console.error(`Error: Task with ID "${id}" not found`);
    return;
  }
  
  task.title = newTitle;
  task.updatedAt = new Date().toISOString();
  saveTasks(tasks);
  console.log(`✓ Task updated: "${newTitle}"`);
}

// Delete a task
function deleteTask(id) {
  if (!id) {
    console.error('Error: Task ID is required');
    return;
  }
  
  const tasks = loadTasks();
  const initialLength = tasks.length;
  const filteredTasks = tasks.filter(t => t.id !== id);
  
  if (filteredTasks.length === initialLength) {
    console.error(`Error: Task with ID "${id}" not found`);
    return;
  }
  
  saveTasks(filteredTasks);
  console.log(`✓ Task deleted`);
}

// Mark task as in-progress
function markInProgress(id) {
  if (!id) {
    console.error('Error: Task ID is required');
    return;
  }
  
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === id);
  
  if (!task) {
    console.error(`Error: Task with ID "${id}" not found`);
    return;
  }
  
  task.status = 'in-progress';
  task.updatedAt = new Date().toISOString();
  saveTasks(tasks);
  console.log(`✓ Task marked as in-progress: "${task.title}"`);
}

// Mark task as done
function markDone(id) {
  if (!id) {
    console.error('Error: Task ID is required');
    return;
  }
  
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === id);
  
  if (!task) {
    console.error(`Error: Task with ID "${id}" not found`);
    return;
  }
  
  task.status = 'done';
  task.updatedAt = new Date().toISOString();
  saveTasks(tasks);
  console.log(`✓ Task marked as done: "${task.title}"`);
}

// List all tasks
function listAllTasks() {
  const tasks = loadTasks();
  
  if (tasks.length === 0) {
    console.log('No tasks found');
    return;
  }
  
  console.log('\n=== All Tasks ===');
  tasks.forEach((task, index) => {
    const statusEmoji = task.status === 'done' ? '✓' : task.status === 'in-progress' ? '⏳' : '◯';
    console.log(`${index + 1}. ${statusEmoji} [${task.status}] ${task.title} (ID: ${task.id})`);
  });
  console.log('');
}

// List completed tasks
function listDoneTasks() {
  const tasks = loadTasks();
  const doneTasks = tasks.filter(t => t.status === 'done');
  
  if (doneTasks.length === 0) {
    console.log('No completed tasks found');
    return;
  }
  
  console.log('\n=== Done Tasks ===');
  doneTasks.forEach((task, index) => {
    console.log(`${index + 1}. ✓ ${task.title} (ID: ${task.id})`);
  });
  console.log('');
}

// List not done tasks
function listNotDoneTasks() {
  const tasks = loadTasks();
  const notDoneTasks = tasks.filter(t => t.status !== 'done');
  
  if (notDoneTasks.length === 0) {
    console.log('No pending tasks found');
    return;
  }
  
  console.log('\n=== Not Done Tasks ===');
  notDoneTasks.forEach((task, index) => {
    const statusEmoji = task.status === 'in-progress' ? '⏳' : '◯';
    console.log(`${index + 1}. ${statusEmoji} [${task.status}] ${task.title} (ID: ${task.id})`);
  });
  console.log('');
}

// List in-progress tasks
function listInProgressTasks() {
  const tasks = loadTasks();
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  
  if (inProgressTasks.length === 0) {
    console.log('No in-progress tasks found');
    return;
  }
  
  console.log('\n=== In Progress Tasks ===');
  inProgressTasks.forEach((task, index) => {
    console.log(`${index + 1}. ⏳ ${task.title} (ID: ${task.id})`);
  });
  console.log('');
}

// Show help
function showHelp() {
  console.log(`
Task Manager CLI

Usage: node app.js <command> [arguments]

Commands:
  add <title>           Add a new task
  update <id> <title>   Update task title
  delete <id>           Delete a task
  done <id>             Mark task as done
  progress <id>         Mark task as in-progress
  list                  List all tasks
  list-done             List all completed tasks
  list-not-done         List all not done tasks
  list-progress         List all in-progress tasks
  help                  Show this help message

Examples:
  node app.js add "Buy groceries"
  node app.js update 1707450000000 "Buy groceries and cook"
  node app.js delete 1707450000000
  node app.js done 1707450000000
  node app.js progress 1707450000000
  node app.js list
  node app.js list-done
  node app.js list-not-done
  node app.js list-progress
`);
}

// Main CLI handler
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help') {
    showHelp();
    return;
  }

  switch (command) {
    case 'add':
      addTask(args.slice(1).join(' '));
      break;
    case 'update':
      updateTask(args[1], args.slice(2).join(' '));
      break;
    case 'delete':
      deleteTask(args[1]);
      break;
    case 'done':
      markDone(args[1]);
      break;
    case 'progress':
      markInProgress(args[1]);
      break;
    case 'list':
      listAllTasks();
      break;
    case 'list-done':
      listDoneTasks();
      break;
    case 'list-not-done':
      listNotDoneTasks();
      break;
    case 'list-progress':
      listInProgressTasks();
      break;
    default:
      console.error(`Unknown command: "${command}". Use "help" for available commands.`);
  }
}

// Run the CLI
main();
