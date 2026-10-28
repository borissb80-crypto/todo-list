const STORAGE_KEY = 'kwiga_todo_tasks';

// Елементи DOM
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const tasksCount = document.getElementById('tasks-count');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

// Стан додатку
let tasks = loadTasks();

// Ініціалізація інтерфейсу
renderTasks();

// Обробник створення завдання
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();

    if (!text) return;

    const newTask = {
        id: Date.now().toString(),
        text: text,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    todoInput.value = '';
});

// Обробник видалення виконаних завдань
clearCompletedBtn.addEventListener('click', () => {
    tasks = tasks.filter((task) => !task.completed);
    saveTasks();
    renderTasks();
});

// Функція перемикання статусу завдання
function toggleTask(id) {
    tasks = tasks.map((task) => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveTasks();
    renderTasks();
}

// Функція видалення завдання
function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    renderTasks();
}

// Рендеринг списку в DOM
function renderTasks() {
    todoList.innerHTML = '';

    tasks.forEach((task) => {
        const li = document.createElement('li');
        li.className = `todo-item ${task.completed ? 'completed' : ''}`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'todo-item-content';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(task.id));

        const span = document.createElement('span');
        span.className = 'todo-text';
        span.textContent = task.text;
        span.addEventListener('click', () => toggleTask(task.id));

        contentDiv.appendChild(checkbox);
        contentDiv.appendChild(span);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.innerHTML = '&times;';
        deleteButton.title = 'Видалити завдання';
        deleteButton.addEventListener('click', () => deleteTask(task.id));

        li.appendChild(contentDiv);
        li.appendChild(deleteButton);

        todoList.appendChild(li);
    });

    updateCounter();
}

// Оновлення лічильника
function updateCounter() {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    tasksCount.textContent = `Завдань: ${total} (виконано: ${completed})`;
}

// Робота з localStorage
function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
    const rawData = localStorage.getItem(STORAGE_KEY);
    return rawData ? JSON.parse(rawData) : [];
}