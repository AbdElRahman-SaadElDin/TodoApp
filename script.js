var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
var editIndex = null;
var nextId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
var searchInput = "";

// Function to save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

document.getElementById("search").addEventListener("input", function(e) {
    searchInput = e.target.value;
    displayData();
});

document.getElementById("taskButton").addEventListener("click", addTask);

// display tasks after search or any action
function displayData() {
    var container = document.getElementById("tasksContainer");
    container.innerHTML = "";

    var filteredTasks = Search();

    for (var index = 0; index < filteredTasks.length; index++) {
        var task = filteredTasks[index];
        var taskDiv = document.createElement("div");
        taskDiv.className = "task" + (task.done ? " done": "");
        taskDiv.innerHTML = `
        <span>${task.title}</span>
        <div class="icons">
        <i onclick="deleteTask(${task.id})">🗑️</i>
        ${!task.done ? `<i onclick="editTask(${task.id})">✏️</i>` : '<i class="disabled">✏️</i>'}
        <i onclick="markDone(${task.id})">✅</i>
        </div>
        `;
        container.appendChild(taskDiv);
    }
}

// search tasks by title or description
function Search() {
    if (searchInput === "") {
        return tasks;
    }
    else {
        return tasks.filter(function(task) {
            return task.title.toLowerCase().includes(searchInput.toLowerCase()) || 
                   task.description.toLowerCase().includes(searchInput.toLowerCase());
        });
    }
}

// show error message of invalid input using id of the input
function showError(message, id) {
    var input = document.getElementById(id);
    input.style.border = "1px solid red";
    var errorDivId = id + "Error";
    var errorDiv = document.getElementById(errorDivId);
    if (!errorDiv) {
        errorDiv = document.createElement("div");
        errorDiv.id = errorDivId;
        errorDiv.className = "input-error";
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
    }
    errorDiv.innerText = message;
    errorDiv.style.display = "block";
}

// hide error message using id of the input
function hideError(id) {
    var input = document.getElementById(id);
    input.style.border = "";
    var errorDivId = id + "Error";
    var errorDiv = document.getElementById(errorDivId);
    if (errorDiv) {
        errorDiv.style.display = "none";
    }
}

// add and update tasks after validation
function addTask() {
    var titleInput = document.getElementById("title");
    var descInput = document.getElementById("description");
    var title = titleInput.value;
    var description = descInput.value;

    var regexTitle = /^[A-Z][a-z]{3,8}$/;
    var regexDescription = /^.{20,}$/;

    var titleValid = regexTitle.test(title);
    var descValid = regexDescription.test(description);

    if (!titleValid) {
        showError("Title should be First Litter UpperCase and 3-8 Letters LowerCase", "title");
    } else {
        hideError("title");
    }
    if (!descValid) {
        showError("Description should be 20 characters or more", "description");
    } else {
        hideError("description");
    }
    if (!titleValid || !descValid) {
        return;
    }

    if (editIndex !== null) {
        tasks[editIndex].title = title;
        tasks[editIndex].description = description;
        editIndex = null;
        var btn = document.getElementById("taskButton");
        btn.innerText = "Add Task";
        btn.classList.remove("updateButton");
        btn.classList.add("taskButton");
    } else {
        tasks.push({
            id: nextId++,
            title,
            description,
            done: false
        });
    }

    titleInput.value = "";
    descInput.value = "";
    saveTasks();
    displayData();
}

// delete task using id
function deleteTask(id) {
    var index = tasks.findIndex(function(task) {
        return task.id === id;
    });
    if (index !== -1) {
        tasks.splice(index, 1);
        saveTasks();
        displayData();
    }
}

// edit task using id
function editTask(id) {
    var task = tasks.find(function(task) {
        return task.id === id;
    });
    // if the task found and it is not done, we can edit it
    if (task && !task.done) {
        document.getElementById("title").value = task.title;
        document.getElementById("description").value = task.description;
        editIndex = tasks.indexOf(task);
        var btn = document.getElementById("taskButton");
        btn.innerText = "Update Task";
        btn.classList.add("updateButton");
        btn.classList.remove("taskButton");
    }
}

// mark task as done using id
function markDone(id) {
    var task = tasks.find(function(task) {
        return task.id === id;
    });
    if (task) {
        task.done = !task.done;
        saveTasks();
        displayData();
    }
}

// Initial display of tasks when page loaded
displayData();
