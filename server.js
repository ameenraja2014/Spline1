const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(bodyParser.json());

let variables = { cream: 0, white: 0, black: 0, blue: 0, red: 0 };

app.post('/update-variables', (req, res) => {
    const { cream, white, black, blue, red } = req.body;
    variables = { cream, white, black, blue, red };
    console.log('Updated variables:', variables);
    io.emit('updateVariables', variables);
    res.send('Variables updated');
});

app.get('/get-variables', (req, res) => {
    res.json(variables);
});

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.emit('updateVariables', { cream: 100, white: 0, black: 0, blue: 0, red: 0 });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
