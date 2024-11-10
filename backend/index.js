const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3001;

app.use(cors());

const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:5173'],
        methods: ["GET", "POST"],
    },
});

io.on("connection", socket => {
    console.log('A user connected with ID:', socket.id);

    // Listen for the custom event from the connected socket
    socket.on('custom-event', (num, str, obj) => {
        console.log('Received custom-event with data:', num, str, obj);
    });

    // Optional: Handle disconnect event
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
