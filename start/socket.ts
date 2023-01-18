import Ws from "App/Services/Ws";

Ws.boot()

Ws.io.on('connection', (socket) => {
    console.log('user connected')

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
        socket.disconnect();
    });

    // typing user
    socket.on(`user:typing`, (data: { isTyping: boolean, id: number, isPartner: boolean }) => {        
        Ws.io.socketsJoin('typing:' + data.id)

        socket.to(`typing:${data.id}`).emit(`user:typing:${data.id}`, { isTyping: data.isTyping, isPartner: data.isPartner })
    })
})
