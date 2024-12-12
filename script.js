// Initialize or fetch workouts from localStorage
let workouts = JSON.parse(localStorage.getItem('workouts')) || [];

// Function to populate the progress table on the home page
function populateProgressTable() {
    const tableBody = document.querySelector('#progress-table tbody');
    if (!tableBody) {
        console.error;
        return;
    }

    tableBody.innerHTML = ''; // Clear previous entries

    // Check if there are workouts to display
    if (workouts.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4">No workout data available.</td></tr>';
        return;
    }

    // Add rows to the table for each workout
    workouts.forEach((workout, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${workout.exerciseType}</td>
            <td>${workout.duration}</td>
            <td>${workout.calories}</td>
            <td><button class="delete-btn" data-index="${index}">Delete</button></td>
        `;
        tableBody.appendChild(row);
    });

    // Add event listeners for delete buttons
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const index = button.getAttribute('data-index');
            deleteWorkout(index);
        });
    });
}

// Function to handle logging workouts on the "log.html" page
function handleWorkoutLogging() {
    const form = document.getElementById('workout-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Fetch input values
            const exerciseType = document.getElementById('exercise-type').value;
            const duration = document.getElementById('duration').value;
            const calories = document.getElementById('calories').value;

            // Ensure valid data (non-empty, numeric for duration and calories)
            if (!exerciseType || !duration || !calories) {
                document.getElementById('message').innerText = "All fields are required!";
                return;
            }

            // Create a workout object
            const workout = {
                exerciseType,
                duration: parseInt(duration),  // Ensure duration is an integer
                calories: parseInt(calories)   // Ensure calories is an integer
            };

            // Add workout to the array and update localStorage
            workouts.push(workout);
            localStorage.setItem('workouts', JSON.stringify(workouts));

            // Show success message and reset form
            document.getElementById('message').innerText = "Workout logged successfully!";
            form.reset(); // Reset form inputs

            // Optionally update the progress page immediately if needed
            if (document.getElementById('workout-history')) {
                updateProgressPage();
            }

            // Also, update the progress table on the homepage if open
            if (document.getElementById('progress-table')) {
                populateProgressTable();
            }
        });
    }
}

// Function to delete a workout
function deleteWorkout(index) {
    // Remove the workout from the array
    workouts.splice(index, 1);

    // Update localStorage with the modified workouts array
    localStorage.setItem('workouts', JSON.stringify(workouts));

    // Re-populate the progress table
    if (document.getElementById('progress-table')) {
        populateProgressTable();
    }

    // Optionally update progress page (if on progress page)
    if (document.getElementById('workout-history')) {
        updateProgressPage();
    }
}

// Function to populate the workout history table on the "progress.html" page
function updateProgressPage() {
    const progressTable = document.getElementById('workout-history');
    if (progressTable) {
        progressTable.innerHTML = ''; // Clear previous entries

        // Check if there are workouts to display
        if (workouts.length === 0) {
            progressTable.innerHTML = '<tr><td colspan="4">No workout data available.</td></tr>';
            return;
        }

        // Add rows for each workout
        workouts.forEach((workout, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${workout.exerciseType}</td>
                <td>${workout.duration}</td>
                <td>${workout.calories}</td>
                <td><button class="delete-btn" data-index="${index}">Delete</button></td>
            `;
            progressTable.appendChild(row);
        });

        // Add event listeners for delete buttons
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function () {
                const index = button.getAttribute('data-index');
                deleteWorkout(index);
            });
        });
    }
}

// Event listener for the navigation toggle (if applicable)
function setupNavigationToggle() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        // Toggle the visibility of the navigation menu
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('hidden');
        });

        // Close menu when a link is clicked
        navMenu.addEventListener('click', (event) => {
            if (event.target.tagName === 'A') {
                navMenu.classList.add('hidden');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    populateProgressTable(); // Populate progress table on the home page
    handleWorkoutLogging(); // Set up form submission on the log page
    setupNavigationToggle(); // Set up navigation toggle if applicable
});

