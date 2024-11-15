// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

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

// Function to handle the "Exit" button click
document.getElementById("exitButton").addEventListener("click", () => {
    // Example data to save before exiting; replace with actual data as needed
    const userTasks = {
        task1: "Complete portfolio project",
        task2: "Review class notes"
    };

    // Save data to Firebase database
    set(ref(db, 'user_tasks/task_data'), userTasks)
        .then(() => {
            // Redirect to login.html after saving data
            window.location.href = "login.html";
        })
        .catch((error) => {
            console.error("Error saving tasks:", error);
            alert("Failed to save tasks. Please try again.");
        });
});
