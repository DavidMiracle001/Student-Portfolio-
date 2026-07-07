// Stage 3: Connect the planner and form elements from the HTML page
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");

// Initialize with example tasks if storage is empty
let tasks = JSON.parse(localStorage.getItem("student-tasks")) || [
  { text: "Study HTML", completed: false },
  { text: "Complete Lab Assessment", completed: false },
  { text: "Attend Group Discussion", completed: false },
];

// Stage 3A: Save and display tasks from local storage so the planner stays available
function saveTasks() {
  localStorage.setItem("student-tasks", JSON.stringify(tasks));
}

function renderTasks() {
  if (!taskList) return;

  taskList.innerHTML = "";
  taskList.className = "task-list";

  tasks.forEach((task, index) => {
    const item = document.createElement("li");
    item.className = `task-item${task.completed ? " completed" : ""}`;

    item.innerHTML = `
      <span class="task-text">${task.text}</span>
      <div class="task-actions">
        <button type="button" class="complete-btn" data-index="${index}">${task.completed ? "Undo" : "Done"}</button>
        <button type="button" class="delete-btn" data-index="${index}">Delete</button>
      </div>
    `;

    taskList.appendChild(item);
  });
}

// Stage 3B: Add a new task when the form is submitted
function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  tasks.unshift({ text: trimmed, completed: false });
  saveTasks();
  renderTasks();
}

// Stage 3C: Mark a task as complete or undo it
function toggleTask(index) {
  if (!tasks[index]) return;

  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

// Stage 3D: Remove a task from the list
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

if (taskForm) {
  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (taskInput) {
      addTask(taskInput.value);
    }
    taskForm.reset();
  });
}

if (taskList) {
  taskList.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    const index = Number(button.dataset.index);
    if (button.classList.contains("complete-btn")) {
      toggleTask(index);
    } else if (button.classList.contains("delete-btn")) {
      deleteTask(index);
    }
  });
}

// Stage 3E: Validate the contact form before allowing submission
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !phone || !message) {
      formMessage.textContent = "Please fill in every field.";
      formMessage.style.color = "#b91c1c";
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      formMessage.textContent = "Please enter a valid email address.";
      formMessage.style.color = "#b91c1c";
      return;
    }

    if (!/^\d+$/.test(phone)) {
      formMessage.textContent = "Phone number must contain only digits.";
      formMessage.style.color = "#b91c1c";
      return;
    }

    formMessage.textContent =
      "Thanks for reaching out! Your message has been recorded.";
    formMessage.style.color = "#16a34a";
    contactForm.reset();
  });
}

renderTasks();
