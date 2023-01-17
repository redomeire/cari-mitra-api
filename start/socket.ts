import Ws from "App/Services/Ws";

Ws.boot()

Ws.io.on('connection', (socket) => {
    console.log('user connected')

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
        socket.disconnect();
    });
})
