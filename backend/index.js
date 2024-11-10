const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:5173','http://localhost:3001'],
        methods: ["GET", "POST"],
    },
});

io.on("connection", socket => {
    console.log('A user connected with ID:', socket.id);

    socket.on('send-message',(message,room)=>{
        if(room === ''){
            socket.broadcast.emit('receive-message',message);
            console.log(message)
        } else {
            socket.to(room).emit('receive-message',message);
        }
    });

    socket.on('join-room', room => {
        socket.join(room);
    });

    // socket.on('disconnect', () => {
    //     console.log('User disconnected:', socket.id);
    // });
});
