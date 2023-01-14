import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Chat from 'App/Models/Chat';
import Pesan from 'App/Models/Pesan';

export default class ChatsController {
    static async createRoom(data: { id_pengajuan: number; }){

        try {
            const foundChatRoom = await Chat.findBy('id_pengajuan', data.id_pengajuan);

            if(foundChatRoom === null) {
                const newChatRoom = new Chat();

                newChatRoom.id_pengajuan = data.id_pengajuan;

                await newChatRoom.save();

                return { status: 'success', code: 200, data: newChatRoom, message: 'new chatroom created' }
            }
                
        } catch (error) {
            return { status: 'error', code: 500, message: error.message}
        }
    }

    static async storeMessage (data: { id_chat: number, text_message: string }) {
        // const body = request.only(['id_chat','text_message'])

        try {
            const newMessage = new Pesan();

            newMessage.id_chat = data.id_chat;
            newMessage.text_message = data.text_message;

            // await newMessage.save();

            return { status: 'success', code: 200, data: newMessage }
        } catch (error) {
            return { status: 'error', code: 500, message: error.message}
        }
    }

    async getAllMessages({ auth, request, response }: HttpContextContract){
        const body = request.only(['id_chat']);

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
