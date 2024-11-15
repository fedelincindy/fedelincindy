// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set, push, update, remove, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDsTKA_7-KHrz6QC8d5TyylEWNkqxf238Y",
    authDomain: "todoapp-a36ff.firebaseapp.com",
    databaseURL: "https://todoapp-a36ff-default-rtdb.firebaseio.com",
    projectId: "todoapp-a36ff",
    storageBucket: "todoapp-a36ff.appspot.com",
    messagingSenderId: "302740800673",
    appId: "1:302740800673:web:ddb9006abdca18fe7adce0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM Elements
const newTaskForm = document.getElementById("new-task-form");
const taskListContainer = document.getElementById("tasks");

// Add new task event listener for Personal Tasks
newTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskDescription = document.getElementById("new-task-input").value;
    const dueDate = document.getElementById("due-date").value;

    if (taskDescription && dueDate) {
        // Save task to Firebase under "PersonalTasks"
        const tasksRef = ref(db, "PersonalTasks");
        const newTaskRef = push(tasksRef);
        set(newTaskRef, {
            description: taskDescription,
            dueDate: dueDate
        }).then(() => {
            document.getElementById("new-task-input").value = ""; // Clear input field
            document.getElementById("due-date").value = ""; // Clear date field
        }).catch(error => {
            console.error("Error saving task:", error);
        });
    }
});

// Display tasks and set up edit/delete functionality for Personal Tasks
const displayTasks = () => {
    const tasksRef = ref(db, "PersonalTasks");
    onValue(tasksRef, (snapshot) => {
        taskListContainer.innerHTML = ""; // Clear existing tasks
        snapshot.forEach((childSnapshot) => {
            const taskId = childSnapshot.key;
            const taskData = childSnapshot.val();
            const taskElement = document.createElement("div");
            taskElement.classList.add("task-item");
            taskElement.innerHTML = `
                <input type="text" value="${taskData.description}" disabled class="task-desc" />
                <input type="datetime-local" value="${taskData.dueDate}" disabled class="task-due-date" />
                <button class="edit-btn">Edit</button>
                <button class="save-btn" style="display:none;">Save</button>
                <button class="delete-btn">Delete</button>
            `;
            taskListContainer.appendChild(taskElement);

            // Edit button functionality
            const editButton = taskElement.querySelector(".edit-btn");
            const saveButton = taskElement.querySelector(".save-btn");
            const deleteButton = taskElement.querySelector(".delete-btn");
            const descriptionField = taskElement.querySelector(".task-desc");
            const dueDateField = taskElement.querySelector(".task-due-date");

            editButton.addEventListener("click", () => {
                descriptionField.disabled = false;
                dueDateField.disabled = false;
                editButton.style.display = "none";
                saveButton.style.display = "inline";
            });

            // Save button functionality
            saveButton.addEventListener("click", () => {
                const updatedDescription = descriptionField.value;
                const updatedDueDate = dueDateField.value;
                const taskRef = ref(db, `PersonalTasks/${taskId}`);
                update(taskRef, {
                    description: updatedDescription,
                    dueDate: updatedDueDate
                }).then(() => {
                    descriptionField.disabled = true;
                    dueDateField.disabled = true;
                    editButton.style.display = "inline";
                    saveButton.style.display = "none";
                }).catch(error => {
                    console.error("Error updating task:", error);
                });
            });

            // Delete button functionality
            deleteButton.addEventListener("click", () => {
                const taskRef = ref(db, `PersonalTasks/${taskId}`);
                remove(taskRef).catch(error => {
                    console.error("Error deleting task:", error);
                });
            });
        });
    });
};

// Check due dates for Personal Tasks periodically
const checkDueDates = () => {
    const tasksRef = ref(db, "PersonalTasks");
    onValue(tasksRef, (snapshot) => {
        const currentDate = new Date();
        snapshot.forEach((childSnapshot) => {
            const taskData = childSnapshot.val();
            const dueDate = new Date(taskData.dueDate);
            if (
                dueDate.getFullYear() === currentDate.getFullYear() &&
                dueDate.getMonth() === currentDate.getMonth() &&
                dueDate.getDate() === currentDate.getDate() &&
                dueDate.getTime() <= currentDate.getTime()
            ) {
                alert("Your personal task is due today!");
            }
        });
    });
};

// Initialize display of tasks and set interval for due date check
displayTasks();
setInterval(checkDueDates, 60000); // Check every minuteS
