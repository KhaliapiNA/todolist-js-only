const form = document.getElementById('todo-form');
const todoInput = document.getElementById('newtodo');
const todosListEl = document.getElementById('todos-list');
const notificationEl = document.querySelector('.notification');
let todos = [];
const getLocalStorage = () => {
    if (todos) {
        return (todos = JSON.parse(localStorage.getItem('todos')));
    } else {
        return [];
    }
};
const updateLocalStorage = () => {
    localStorage.setItem('todos', JSON.stringify(todos));
}
let editTodoId = -1;

window.addEventListener("load", function (event) {
    renderTodos();
})

form.addEventListener('submit', function (event) {
    event.preventDefault();
    saveTodo();
    renderTodos();
});

function saveTodo() {
    const todoInputValue = todoInput.value;
    const isValid = validateValue(todoInputValue);
    if (!isValid) {
        return;
    }
    if (editTodoId >= 0) {
        todos[editTodoId].value = todoInputValue;
        editTodoId = -1;
    } else {
        todos.push({
            value: todoInputValue,
            checked: false
        });
    }
    updateLocalStorage();
    todoInput.value = '';
}

function validateValue(todoInputValue) {
    const isEmpty = todoInputValue === '';
    const isDuplicate = todos.some((todo) => todo.value.toUpperCase() === todoInputValue.toUpperCase());
    if (isEmpty) {
        showNotification('Textarea is empty');
        return false
    }
    if (isDuplicate && editTodoId < 0) {
        showNotification('You already have this item');
        return false;
    }
    return true;
}
function renderTodos() {
    todosListEl.innerHTML = '';
    if (getLocalStorage() !== []) {
        getLocalStorage().forEach((todo, index) => {
            todosListEl.innerHTML += `
        <div class="todo" id=${index}>
            <i class="bi ${todo.checked ? 'bi-check-circle-fill' : 'bi-circle'}"
            style="color: ${todo.color}"
            data-action="check"></i>
            <p class="${todo.checked ? 'checked' : ''}" data-action="check">${todo.value}</p>
            <i class="bi bi-pencil-square" data-action="edit"></i>
            <i class="bi bi-trash" data-action="delete"></i>
        </div>`
        })
    }
}

todosListEl.addEventListener('click', (event) => {
    const target = event.target;
    const parentElement = target.parentNode;
    if (parentElement.className !== 'todo') return;
    const todo = parentElement;
    const todoId = Number(todo.id);
    const action = target.dataset.action;

    action === 'check' && checkTodo(todoId);
    action === 'edit' && editTodo(todoId);
    action === 'delete' && deleteTodo(todoId);

});

function checkTodo(todoId) {
    todos[todoId].checked = !todos[todoId].checked;
    updateLocalStorage();
    renderTodos();
}

function editTodo(todoId) {
    todoInput.value = todos[todoId].value;
    editTodoId = todoId;
    updateLocalStorage();
    renderTodos();
}

function deleteTodo(todoId) {
    todos = todos.filter((todo, index) => index !== todoId);
    editTodoId = -1;
    updateLocalStorage();
    renderTodos();
}

function showNotification(msg) {
    notificationEl.innerHTML = msg;
    notificationEl.classList.add('notif-enter');

    setTimeout(() => {
        notificationEl.classList.remove('notif-enter');
    }, 2000)
}

/////////
