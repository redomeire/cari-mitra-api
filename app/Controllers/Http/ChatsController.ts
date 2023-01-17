import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Chat from 'App/Models/Chat';
import Pesan from 'App/Models/Pesan';
import Ws from 'App/Services/Ws';

export default class ChatsController {
    async createRoom({ auth, request, response }: HttpContextContract){
        const body = request.only(['id_pengajuan'])

        try {
            const user = auth.use('user').user;

            if(user === undefined)
                return response.unauthorized({ status: 'error', message: 'unauthorized operation' })
            
            const foundChatRoom = await Chat.findBy('id_pengajuan', body.id_pengajuan);

            if(foundChatRoom === null) {
                const newChatRoom = new Chat();

                newChatRoom.id_pengajuan = body.id_pengajuan;

                await newChatRoom.save();

                Ws.io.emit('client:room', { isOpen: true })
                return response.ok({ status: 'success', code: 200, data: newChatRoom, message: 'new chatroom created' })
            }

            Ws.io.emit('client:room', { isOpen: true })
        } catch (error) {
            return { status: 'error', code: 500, message: error.message}
        }
    }

    async storeMessage ({ auth, request, response }: HttpContextContract) {
        const body = request.only(['id_chat','text_message', 'sent_by_partner'])

        try {
            const user = auth.use('user').user;

            if(user === undefined)
                return response.unauthorized({ status: 'error', message: 'unauthorized operation' })

            const newMessage = new Pesan();

            newMessage.id_chat = body.id_chat;
            newMessage.text_message = body.text_message;
            newMessage.sent_by_partner = body.sent_by_partner;
            // await newMessage.save();

            Ws.io.emit('client:chat', { 
                id_chat: body.id_chat,
                text_message: body.text_message, 
                sent_by_partner: body.sent_by_partner,
                created_at: newMessage.createdAt
             })
            return { status: 'success', code: 200, data: newMessage }
        } catch (error) {
            return { status: 'error', code: 500, message: error.message}
        }
    }

    async getAllMessages({ auth, request, response }: HttpContextContract){
        const body = request.params();

        try {
            const user = auth.use('user').user;

            if(user === undefined)
                return response.unauthorized({ status: 'error', code: 401, message: 'unauthorized operation' })

            const chats = await Pesan
            .query()
            .where('id_chat', body.id_chat)

            return response.ok({ status: 'success', code: 200, data: chats })

        } catch (error) {
            return response.internalServerError({ status: 'error', code: 500, message: error.message})
        }
    }
}
