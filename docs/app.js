// SmartFit Planner - Full Workout Generator
// GPL-3.0 License

const exerciseDB = {
    bodyweight: [
        { name: "Push-ups", muscle: "Chest", sets: 3, reps: "12-15", rest: "60s" },
        { name: "Squats", muscle: "Legs", sets: 3, reps: "15-20", rest: "60s" },
        { name: "Lunges", muscle: "Legs", sets: 3, reps: "12 each", rest: "60s" },
        { name: "Plank", muscle: "Core", sets: 3, reps: "45-60s", rest: "45s" },
        { name: "Burpees", muscle: "Full Body", sets: 3, reps: "10-12", rest: "90s" },
        { name: "Mountain Climbers", muscle: "Core", sets: 3, reps: "20", rest: "45s" },
        { name: "Glute Bridges", muscle: "Glutes", sets: 3, reps: "15-20", rest: "45s" },
        { name: "Tricep Dips", muscle: "Triceps", sets: 3, reps: "12-15", rest: "60s" }
    ],
    dumbbells: [
        { name: "Dumbbell Bench Press", muscle: "Chest", sets: 4, reps: "8-12", rest: "90s" },
        { name: "Goblet Squats", muscle: "Legs", sets: 4, reps: "10-12", rest: "90s" },
        { name: "Dumbbell Rows", muscle: "Back", sets: 4, reps: "10-12", rest: "90s" },
        { name: "Shoulder Press", muscle: "Shoulders", sets: 3, reps: "10-12", rest: "90s" },
        { name: "Bicep Curls", muscle: "Biceps", sets: 3, reps: "12-15", rest: "60s" },
        { name: "Romanian Deadlifts", muscle: "Hamstrings", sets: 4, reps: "10-12", rest: "90s" },
        { name: "Lateral Raises", muscle: "Shoulders", sets: 3, reps: "15", rest: "60s" },
        { name: "Chest Flyes", muscle: "Chest", sets: 3, reps: "12-15", rest: "60s" }
    ],
    barbell: [
        { name: "Barbell Squats", muscle: "Legs", sets: 4, reps: "5-8", rest: "3min" },
        { name: "Bench Press", muscle: "Chest", sets: 4, reps: "6-10", rest: "2min" },
        { name: "Deadlifts", muscle: "Back/Legs", sets: 3, reps: "5-6", rest: "3min" },
        { name: "Overhead Press", muscle: "Shoulders", sets: 4, reps: "6-8", rest: "2min" },
        { name: "Barbell Rows", muscle: "Back", sets: 4, reps: "8-10", rest: "2min" },
        { name: "Hip Thrusts", muscle: "Glutes", sets: 4, reps: "10-12", rest: "90s" }
    ],
    resistance_bands: [
        { name: "Band Pull-Aparts", muscle: "Rear Delts", sets: 3, reps: "20", rest: "45s" },
        { name: "Band Rows", muscle: "Back", sets: 4, reps: "15", rest: "60s" },
        { name: "Band Chest Press", muscle: "Chest", sets: 3, reps: "15", rest: "60s" },
        { name: "Band Squats", muscle: "Legs", sets: 3, reps: "20", rest: "60s" },
        { name: "Band Bicep Curls", muscle: "Biceps", sets: 3, reps: "20", rest: "45s" }
    ],
    pullup_bar: [
        { name: "Pull-ups", muscle: "Back", sets: 4, reps: "6-10", rest: "2min" },
        { name: "Chin-ups", muscle: "Biceps/Back", sets: 3, reps: "6-10", rest: "2min" },
        { name: "Hanging Leg Raises", muscle: "Core", sets: 3, reps: "10-12", rest: "60s" }
    ]
};

const ethnicAdjustments = {
    south_asian: { cardioMod: 1.2, note: "Higher intensity cardio recommended for metabolic health" },
    east_asian: { cardioMod: 1.0, note: "Standard protocols effective" },
    african: { muscleMod: 1.1, note: "Slightly higher volume tolerance observed" },
    caucasian: { cardioMod: 1.0, note: "Standard protocols effective" },
    hispanic: { cardioMod: 1.1, note: "Moderate cardio emphasis recommended" },
    other: { cardioMod: 1.0, note: "General population protocols" }
};

function calculateBMI(weight, height) {
    return (weight / ((height / 100) ** 2)).toFixed(1);
}

function calculateBMR(weight, height, age, sex) {
    if (sex === 'male') {
        return (10 * weight) + (6.25 * height) - (5 * age) + 5;
    }
    return (10 * weight) + (6.25 * height) - (5 * age) - 161;
}

function getFitnessLevel(bmi, age) {
    if (bmi < 18.5) return { level: 'beginner', focus: 'strength_gain', volume: 'low' };
    if (bmi < 25) return { level: 'intermediate', focus: 'maintenance', volume: 'moderate' };
    if (bmi < 30) return { level: 'beginner', focus: 'fat_loss', volume: 'moderate-high' };
    return { level: 'beginner', focus: 'fat_loss', volume: 'low', note: 'Start slow, focus on form' };
}

function selectExercises(equipment, fitnessLevel) {
    let available = [];
    
    // Always include bodyweight
    available = [...exerciseDB.bodyweight];
    
    // Add selected equipment
    equipment.forEach(eq => {
        if (exerciseDB[eq]) {
            available = [...available, ...exerciseDB[eq]];
        }
    });
    
    // Filter by fitness level
    if (fitnessLevel === 'beginner') {
        return available.filter(ex => 
            !ex.name.includes('Deadlift') && 
            !ex.name.includes('Barbell Squat')
        );
    }
    
    return available;
}

function generateSplit(days, exercises) {
    const splits = {
        3: [['Full Body'], ['Rest'], ['Full Body'], ['Rest'], ['Full Body'], ['Rest'], ['Rest']],
        4: [['Upper'], ['Lower'], ['Rest'], ['Upper'], ['Lower'], ['Rest'], ['Rest']],
        5: [['Push'], ['Pull'], ['Legs'], ['Push'], ['Pull'], ['Rest'], ['Rest']],
        6: [['Push'], ['Pull'], ['Legs'], ['Push'], ['Pull'], ['Legs'], ['Rest']]
    };
    
    return splits[days] || splits[3];
}

function assignWorkouts(split, exercises, equipment) {
    const muscleGroups = {
        'Full Body': ['Chest', 'Legs', 'Back', 'Core', 'Shoulders'],
        'Upper': ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps'],
        'Lower': ['Legs', 'Glutes', 'Hamstrings'],
        'Push': ['Chest', 'Shoulders', 'Triceps'],
        'Pull': ['Back', 'Biceps', 'Rear Delts'],
        'Legs': ['Legs', 'Glutes', 'Hamstrings', 'Core']
    };
    
    const weekPlan = [];
    
    split.forEach((day, index) => {
        if (day[0] === 'Rest') {
            weekPlan.push({ day: index + 1, type: 'Rest', workouts: [] });
            return;
        }
        
        const targetMuscles = muscleGroups[day[0]];
        const dayExercises = [];
        
        targetMuscles.forEach(muscle => {
            const match = exercises.find(ex => 
                ex.muscle.includes(muscle) && 
                !dayExercises.find(d => d.name === ex.name)
            );
            if (match && dayExercises.length < 5) {
                dayExercises.push(match);
            }
        });
        
        // Fill remaining slots
        while (dayExercises.length < 4) {
            const random = exercises[Math.floor(Math.random() * exercises.length)];
            if (!dayExercises.find(d => d.name === random.name)) {
                dayExercises.push(random);
            }
        }
        
        weekPlan.push({
            day: index + 1,
            type: day[0],
            workouts: dayExercises
        });
    });
    
    return weekPlan;
}

function generatePlan(data) {
    const bmi = calculateBMI(data.weight, data.height);
    const bmr = calculateBMR(data.weight, data.height, data.age, data.sex);
    const fitness = getFitnessLevel(bmi, data.age);
    const ethnic = ethnicAdjustments[data.ethnicity] || ethnicAdjustments.other;
    
    const exercises = selectExercises(data.equipment, fitness.level);
    const split = generateSplit(data.days, exercises);
    const weekPlan = assignWorkouts(split, exercises, data.equipment);
    
    return {
        stats: { bmi, bmr: Math.round(bmr), fitness },
        ethnicNote: ethnic.note,
        plan: weekPlan
    };
}

// UI Handling
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('planner-form');
    const resultDiv = document.getElementById('result');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const data = {
            height: parseFloat(document.getElementById('height').value),
            weight: parseFloat(document.getElementById('weight').value),
            age: parseInt(document.getElementById('age').value),
            sex: document.getElementById('sex').value,
            ethnicity: document.getElementById('ethnicity').value,
            days: parseInt(document.getElementById('days').value),
            equipment: Array.from(document.querySelectorAll('input[name="equipment"]:checked')).map(cb => cb.value)
        };
        
        if (data.equipment.length === 0) {
            alert('Select at least one equipment type!');
            return;
        }
        
        const result = generatePlan(data);
        displayResult(result, resultDiv);
    });
});

function displayResult(result, container) {
    const { stats, ethnicNote, plan } = result;
    
    let html = `
        <div class="result-card">
            <h2>📊 Your Profile</h2>
            <p><strong>BMI:</strong> ${stats.bmi} (${getBMICategory(stats.bmi)})</p>
            <p><strong>BMR:</strong> ${stats.bmr} calories/day</p>
            <p><strong>Focus:</strong> ${stats.fitness.focus.replace('_', ' ')}</p>
            <p class="ethnic-note">🌍 ${ethnicNote}</p>
        </div>
        
        <h2>🏋️ Your 7-Day Plan</h2>
    `;
    
    plan.forEach(day => {
        html += `<div class="day-card">`;
        html += `<h3>Day ${day.day}: ${day.type}</h3>`;
        
        if (day.workouts.length === 0) {
            html += `<p>Rest & Recovery 🛌</p>`;
        } else {
            html += `<table class="workout-table">
                <tr><th>Exercise</th><th>Muscle</th><th>Sets</th><th>Reps</th><th>Rest</th></tr>`;
            
            day.workouts.forEach(w => {
                html += `<tr>
                    <td><strong>${w.name}</strong></td>
                    <td>${w.muscle}</td>
                    <td>${w.sets}</td>
                    <td>${w.reps}</td>
                    <td>${w.rest}</td>
                </tr>`;
            });
            
            html += `</table>`;
        }
        
        html += `</div>`;
    });
    
    container.innerHTML = html;
}

function getBMICategory(bmi) {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
}
