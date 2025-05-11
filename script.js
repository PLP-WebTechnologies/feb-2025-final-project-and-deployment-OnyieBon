// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Check for saved theme preference or use system preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = 'Light Mode';
} else {
    themeToggle.textContent = 'Dark Mode';
}

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    themeToggle.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
});

// Newsletter Form Submission
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input').value;
        document.getElementById('form-feedback').textContent = `Thank you for subscribing with ${email}!`;
        newsletterForm.reset();
        setTimeout(() => {
            document.getElementById('form-feedback').textContent = '';
        }, 5000);
    });
}

// Save Recipe/Workout Buttons
document.querySelectorAll('.save-recipe, .save-workout').forEach(button => {
    button.addEventListener('click', function() {
        const postId = this.getAttribute('data-postid');
        const statusElement = document.getElementById(`save-status-${postId}`);
        
        // Toggle saved state
        if (this.textContent.includes('Save')) {
            this.textContent = this.textContent.replace('Save', 'Unsave');
            statusElement.textContent = 'Saved!';
            
            // Add to localStorage
            const savedItems = JSON.parse(localStorage.getItem('savedItems')) || {};
            savedItems[postId] = true;
            localStorage.setItem('savedItems', JSON.stringify(savedItems));
        } else {
            this.textContent = this.textContent.replace('Unsave', 'Save');
            statusElement.textContent = '';
            
            // Remove from localStorage
            const savedItems = JSON.parse(localStorage.getItem('savedItems')) || {};
            delete savedItems[postId];
            localStorage.setItem('savedItems', JSON.stringify(savedItems));
        }
        
        setTimeout(() => {
            statusElement.textContent = '';
        }, 2000);
    });
});

// Initialize saved state for buttons
document.addEventListener('DOMContentLoaded', () => {
    const savedItems = JSON.parse(localStorage.getItem('savedItems')) || {};
    Object.keys(savedItems).forEach(postId => {
        const button = document.querySelector(`[data-postid="${postId}"]`);
        if (button) {
            button.textContent = button.textContent.replace('Save', 'Unsave');
        }
    });
});

// Fitness Page Functionality
if (document.getElementById('calorie-calculator')) {
    const calorieCalculator = document.getElementById('calorie-calculator');
    calorieCalculator.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const activity = document.getElementById('activity').value;
        const duration = parseFloat(document.getElementById('duration').value);
        const weight = parseFloat(document.getElementById('weight').value);
        
        // MET values for different activities
        const metValues = {
            running: 9.8,
            walking: 3.5,
            cycling: 7.5,
            swimming: 6.0
        };
        
        // Calculate calories burned
        const calories = (metValues[activity] * weight * duration) / 60;
        
        document.getElementById('calorie-result').innerHTML = `
            <p>Estimated calories burned: <strong>${calories.toFixed(0)}</strong></p>
            <p>Activity: ${activity.charAt(0).toUpperCase() + activity.slice(1)}</p>
            <p>Duration: ${duration} minutes</p>
        `;
    });
}

// Run Progress Tracker
if (document.getElementById('log-run')) {
    document.getElementById('log-run').addEventListener('click', () => {
        const distance = parseFloat(document.getElementById('run-distance').value);
        if (isNaN(distance) || distance <= 0) return;
        
        // Get existing runs or initialize empty array
        const runs = JSON.parse(localStorage.getItem('runProgress')) || [];
        
        // Add new run with timestamp
        runs.push({
            distance: distance,
            date: new Date().toISOString()
        });
        
        // Save to localStorage
        localStorage.setItem('runProgress', JSON.stringify(runs));
        
        // Update display
        updateRunProgress();
    });
    
    function updateRunProgress() {
        const runs = JSON.parse(localStorage.getItem('runProgress')) || [];
        const totalDistance = runs.reduce((sum, run) => sum + run.distance, 0);
        const lastRun = runs.length > 0 ? runs[runs.length - 1].distance : 0;
        
        document.getElementById('run-progress').innerHTML = `
            <p>Total distance: ${totalDistance.toFixed(1)} miles</p>
            <p>Last run: ${lastRun.toFixed(1)} miles</p>
            <p>Total runs: ${runs.length}</p>
        `;
    }
    
    // Initialize on page load
    updateRunProgress();
}

// Healthy Living Page Functionality
if (document.getElementById('log-meditation')) {
    document.getElementById('log-meditation').addEventListener('click', () => {
        const minutes = parseInt(document.getElementById('meditation-time').value);
        if (isNaN(minutes)) return;
        
        // Get existing sessions or initialize empty array
        const sessions = JSON.parse(localStorage.getItem('meditationSessions')) || [];
        
        // Add new session with timestamp
        sessions.push({
            minutes: minutes,
            date: new Date().toISOString()
        });
        
        // Save to localStorage
        localStorage.setItem('meditationSessions', JSON.stringify(sessions));
        
        // Update display
        updateMeditationStats();
    });
    
    function updateMeditationStats() {
        const sessions = JSON.parse(localStorage.getItem('meditationSessions')) || [];
        const totalMinutes = sessions.reduce((sum, session) => sum + session.minutes, 0);
        const totalSessions = sessions.length;
        const avgMinutes = totalSessions > 0 ? (totalMinutes / totalSessions).toFixed(1) : 0;
        
        document.getElementById('meditation-stats').innerHTML = `
            <p>Total meditation: ${totalMinutes} minutes</p>
            <p>Sessions completed: ${totalSessions}</p>
            <p>Average session: ${avgMinutes} minutes</p>
        `;
    }
    
    // Initialize on page load
    updateMeditationStats();
}

// Sleep Calculator
if (document.getElementById('calculate-sleep')) {
    document.getElementById('calculate-sleep').addEventListener('click', () => {
        const wakeUpTime = document.getElementById('wake-up-time').value;
        const [hours, minutes] = wakeUpTime.split(':').map(Number);
        
        // Calculate bedtimes for 5-6 sleep cycles (each cycle ~90 minutes)
        const bedTimes = [];
        for (let cycles = 5; cycles <= 6; cycles++) {
            const totalMinutes = cycles * 90 + 15; // 15 minutes to fall asleep
            let bedHours = hours - Math.floor(totalMinutes / 60);
            let bedMinutes = minutes - (totalMinutes % 60);
            
            // Handle minute/hour overflow
            if (bedMinutes < 0) {
                bedMinutes += 60;
                bedHours -= 1;
            }
            
            // Handle day change
            if (bedHours < 0) {
                bedHours += 24;
            }
            
            // Format time
            const ampm = bedHours >= 12 ? 'PM' : 'AM';
            const displayHours = bedHours % 12 || 12;
            const displayMinutes = bedMinutes.toString().padStart(2, '0');
            
            bedTimes.push(`${displayHours}:${displayMinutes} ${ampm}`);
        }
        
        document.getElementById('sleep-times').innerHTML = `
            <p>For optimal sleep, try to fall asleep between:</p>
            <p><strong>${bedTimes[0]}</strong> and <strong>${bedTimes[1]}</strong></p>
            <p>(This allows for ${wakeUpTime.includes('07') ? '5-6' : '...'} complete sleep cycles)</p>
        `;
    });
}

// Habit Tracker
if (document.getElementById('habit-form')) {
    const habitForm = document.getElementById('habit-form');
    
    habitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get checked habits
        const habits = {
            water: document.getElementById('habit1').checked,
            exercise: document.getElementById('habit2').checked,
            meditation: document.getElementById('habit3').checked,
            sleep: document.getElementById('habit4').checked
        };
        
        // Save today's habits
        const today = new Date().toDateString();
        const habitHistory = JSON.parse(localStorage.getItem('habitHistory')) || {};
        habitHistory[today] = habits;
        localStorage.setItem('habitHistory', JSON.stringify(habitHistory));
        
        // Update streaks display
        updateHabitStreaks();
    });
    
    function updateHabitStreaks() {
        const habitHistory = JSON.parse(localStorage.getItem('habitHistory')) || {};
        const today = new Date().toDateString();
        
        // Check if today's habits are logged
        if (habitHistory[today]) {
            const checkedCount = Object.values(habitHistory[today]).filter(Boolean).length;
            document.getElementById('habit-streaks').textContent = 
                `Today's progress: ${checkedCount}/4 habits completed!`;
        }
    }
    
    // Initialize on page load
    updateHabitStreaks();
}