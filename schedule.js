// DOM Elements for Schedule Management
const selectedDayElement = document.getElementById("selected-day");
const scheduleTableBody = document.getElementById("schedule-body");
const addScheduleButton = document.querySelector(".add-entry-btn");
const roomInput = document.getElementById("room-input");
const teacherInput = document.getElementById("teacher-input");
const subjectInput = document.getElementById("subject-input");
const timeInput = document.getElementById("time-input");
const daysButtons = document.querySelectorAll(".days-nav button");

// Variables and Data Storage
let selectedDay = "Monday"; // Default selected day
const schedules = JSON.parse(localStorage.getItem("schedules")) || {};

// Functions to Manage Schedule Display and Day Selection
function selectDay(day) {
    selectedDay = day;
    selectedDayElement.textContent = day;
    displaySchedule(); // Display schedule for the newly selected day
}

function displaySchedule() {
    const scheduleForDay = schedules[selectedDay] || [];
    scheduleTableBody.innerHTML = ""; // Clear current schedule entries

    scheduleForDay.forEach((entry, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${entry.room}</td>
            <td>${entry.teacher}</td>
            <td>${entry.subject}</td>
            <td>${entry.time}</td>
            <td>
                <button onclick="editEntry(${index})">Edit</button>
                <button onclick="deleteEntry(${index})">Delete</button>
            </td>
        `;
        scheduleTableBody.appendChild(row);
    });
}

// Schedule Entry Functions
function addEntry() {
    const room = roomInput.value;
    const teacher = teacherInput.value;
    const subject = subjectInput.value;
    const time = timeInput.value;

    // Validate input fields
    if (!room || !teacher || !subject || !time) {
        alert("Please fill in all fields!");
        return;
    }

    const newEntry = { room, teacher, subject, time };
    if (!schedules[selectedDay]) schedules[selectedDay] = [];
    schedules[selectedDay].push(newEntry);

    // Update local storage and display updated schedule
    localStorage.setItem("schedules", JSON.stringify(schedules));
    clearInputs();
    displaySchedule();
}

function editEntry(index) {
    const entry = schedules[selectedDay][index];
    roomInput.value = entry.room;
    teacherInput.value = entry.teacher;
    subjectInput.value = entry.subject;
    timeInput.value = entry.time;

    // Update button to save edited entry
    addScheduleButton.textContent = "Save Changes";
    addScheduleButton.onclick = () => saveEntry(index);
}

function saveEntry(index) {
    const room = roomInput.value;
    const teacher = teacherInput.value;
    const subject = subjectInput.value;
    const time = timeInput.value;

    // Validate input fields
    if (!room || !teacher || !subject || !time) {
        alert("Please fill in all fields!");
        return;
    }

    schedules[selectedDay][index] = { room, teacher, subject, time };
    localStorage.setItem("schedules", JSON.stringify(schedules));

    clearInputs();
    resetAddButton();
    displaySchedule();
}

function deleteEntry(index) {
    schedules[selectedDay].splice(index, 1);
    localStorage.setItem("schedules", JSON.stringify(schedules));
    displaySchedule();
}

// Helper Functions
function clearInputs() {
    roomInput.value = "";
    teacherInput.value = "";
    subjectInput.value = "";
    timeInput.value = "";
}

function resetAddButton() {
    addScheduleButton.textContent = "Add Schedule";
    addScheduleButton.onclick = addEntry;
}

// Event Listeners
if (addScheduleButton) addScheduleButton.addEventListener('click', addEntry);

daysButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectDay(button.textContent);
    });
});

// Initial Display
displaySchedule(); // Show the schedule on load
