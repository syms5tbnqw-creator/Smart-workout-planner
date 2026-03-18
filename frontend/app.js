document.getElementById('planner-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;
    const age = document.getElementById('age').value;
    const sex = document.getElementById('sex').value;
    
    // Simple BMI calculation
    const bmi = (weight / ((height/100) ** 2)).toFixed(1);
    
    let plan = '';
    if (bmi < 18.5) plan = 'Focus on strength training + calorie surplus';
    else if (bmi < 25) plan = 'Balanced mix of cardio and strength';
    else plan = 'Cardio-focused with moderate strength training';
    
    document.getElementById('result').innerHTML = `
        <h2>Your BMI: ${bmi}</h2>
        <p><strong>Plan:</strong> ${plan}</p>
    `;
});
