const classNames = {
    TODO_ITEM: "todo-container",
    TODO_CHECKBOX: "todo-checkbox",
    TODO_TEXT: "todo-text",
    TODO_DELETE: "todo-delete",
}

const list = document.getElementById("todo-list");
const itemCountSpan = document.getElementById("item-count");
const uncheckedCountSpan = document.getElementById("unchecked-count");
let todos = [];

function newTodo() {
    let text = prompt("Enter new task to do", "Do something");
    // create todo object
    const todo = {
        text, checked: false, id: Date.now(),
    };
    // add new todo object to array
    todos.push(todo);
    // update todo list on page
    renderTodo(todo);
    // update top counters
    updateCounters();
}

function toggleCheckbox(key) {
    // find todo index
    const index = todos.findIndex(el => el.id === Number(key));
    // change todo in array
    todos[index].checked = !todos[index].checked;
    // update top counters
    updateCounters();
    // update localStorage array
    localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodo(item) {
    // check if item needs to be deleted
    if (item?.toDele) {
        // find li of item
        const li = document.getElementById(`${item.id}`);
        // destroy li on page
        li.remove();
    } else {
        // else we need to add todo
        // create li
        const li = document.createElement("li");
        // set id to todo.id
        li.setAttribute("id", `${item.id}`);
        // add todo class
        li.setAttribute("class", `${classNames.TODO_ITEM}`)
        // set inner tags - checkbox, label with text and delete button
        li.innerHTML = `<input onClich="toggleCheckbox(${item.id})" class="${classNames.TODO_CHECKBOX}" type="checkbox" ${item.checked ? "checked" : ""}>
                    <label class="${classNames.TODO_TEXT}"><span>${item?.text}</span></label>
                    <button class="${classNames.TODO_DELETE}" onClick="deleteTodo(${item.id})">delete</button>`;
        // add li to our list on page
        list.appendChild(li);
    }
    // update localStorage array
    localStorage.setItem('todos', JSON.stringify(todos));
    // update top counters
    updateCounters();
}

function deleteTodo(key) {
    // find todo index in array
    const index = todos.findIndex(item => item.id === Number(key));
    // if todo exist
    if (index >= 0) {
        // add deleted prop
        const todo = {
            deleted: true, id: key,
            ...todos[index]
        };
        // delete todo from array
        todos = todos.filter(item => item.id !== Number(key));
        // update todo list on page
        renderTodo(todo);
    }
}

function updateCounters() {
    // update all todos counter by array length
    itemCountSpan.textContent = todos.length.toString();
    // update unchecked todo counter by lenght of filtered array
    uncheckedCountSpan.textContent = todos.filter((todoEl) => todoEl.checked === false).length.toString();
}

document.addEventListener('DOMContentLoaded', () => {
    // get localstorage todos
    const localTodos = localStorage.getItem('todos');
    // if they exist
    if (localTodos) {
        // parse localStorage and set to our todo array
        todos = JSON.parse(ref);
        // render each todo from array
        todos.forEach(todo => {
            renderTodo(todo);
        });
        // update counters
        updateCounters();
    }
});