import Ws from "App/Services/Ws";
import ChatController from "App/Controllers/Http/ChatsController";

Ws.boot()

Ws.io.on('connection', (socket) => {
    console.log('user connected')

    socket.on('createChatRoom', (data) => {
        socket.emit('generateChatRoom', ChatController.createRoom(data))
        console.log('chat room created')
    })

    socket.on('storeMessage', (data) => {
        socket.emit('generateMessage', ChatController.storeMessage(data))
    })

    socket.on('message', (data) => {
        socket.emit('messageResponse', data)
    })

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
        socket.disconnect();
    });
})
