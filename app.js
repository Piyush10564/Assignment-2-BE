const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to log timestamps
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.use(express.static('public'));





app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const TASKS_FILE = path.join(__dirname, 'tasks.json');

// Read tasks from file
const readTasks = () => {
    if (!fs.existsSync(TASKS_FILE)) return [];
    return JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8'));
};

// Write tasks to file
const writeTasks = (tasks) => {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
};

// GET /tasks - Show all tasks
app.get('/tasks', (req, res) => {
    const tasks = readTasks();
    res.render('tasks', { tasks });
});

// GET /task?id=1 - Fetch a specific task
app.get('/task', (req, res) => {
    const tasks = readTasks();
    const task = tasks.find(t => t.id === parseInt(req.query.id));
    if (!task) return res.status(404).send('Task not found');
    res.render('task', { task });
});

// POST /add-task - Add a new task
app.post('/add-task', (req, res) => {
    const tasks = readTasks();
    const newTask = {
        id: tasks.length + 1,
        title: req.body.title,
        completed: false
    };
    tasks.push(newTask);
    writeTasks(tasks);
    res.redirect('/tasks');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
