const express = require('express');
const app = express();
const port = process.env.PORT || 5070;
const taskRoutes = require('./src/routes/task.routes');

app.use(express.json());
app.use('/api', taskRoutes);
app.get('/', (req, res) => {
    res.end('hello from express');
});










app.listen(port, () => console.log('server is running on port 5000'));


