const express = require('express');
const app = express();

app.get('/api/plan', (req, res) => {
    res.json({ message: 'Workout plan API ready' });
});

app.listen(3000);
