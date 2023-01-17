import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import Chat from 'App/Models/Chat';
import Pesan from 'App/Models/Pesan';
import Ws from 'App/Services/Ws';

export default class ChatsController {
    async createRoom({ auth, request, response }: HttpContextContract) {
        const body = request.only(['id_pengajuan'])

        try {
            const user = auth.use('user').user;

            if (user === undefined)
                return response.unauthorized({ status: 'error', message: 'unauthorized operation' })

            const foundChatRoom = await Chat.findBy('id_pengajuan', body.id_pengajuan);

            if (foundChatRoom === null) {
                const newChatRoom = new Chat();

                newChatRoom.id_pengajuan = body.id_pengajuan;

                await newChatRoom.save();

                Ws.io.emit('client:room', { isOpen: true })
                return response.ok({ status: 'success', code: 200, data: newChatRoom, message: 'new chatroom created' })
            }

            Ws.io.emit('client:room:' + body.id_pengajuan, { isOpen: true })
        } catch (error) {
            return { status: 'error', code: 500, message: error.message }
        }
    }

    async storeMessage({ auth, request, response }: HttpContextContract) {
        const body = request.only(['id_chat', 'text_message', 'sent_by_partner'])

        try {
            const user = auth.use('user').user || auth.use('partner').user;

            if (user === undefined)
                return response.unauthorized({ status: 'error', message: 'unauthorized operation' })

            const newMessage = new Pesan();

            newMessage.id_chat = body.id_chat;
            newMessage.text_message = body.text_message;
            newMessage.sent_by_partner = body.sent_by_partner;
            await newMessage.save();

            Ws.io.socketsJoin("room:" + body.id_chat);

            Ws.io.to("room:" + body.id_chat).emit('client:chat:' + body.id_chat, {
                id_chat: body.id_chat,
                text_message: body.text_message,
                sent_by_partner: body.sent_by_partner,
                created_at: newMessage.createdAt
            })
            return { status: 'success', code: 200, data: newMessage }
        } catch (error) {
            return { status: 'error', code: 500, message: error.message }
        }
    }

    async detail({ auth, request, response }: HttpContextContract) {
        const body = request.params();

        try {
            const user = auth.use('user').user || auth.use('partner').user;

            if (user === undefined)
                return response.unauthorized({ status: 'error', code: 401, message: 'unauthorized operation' })

            const foundPengajuan = await Database
            .from('pengajuans')
            .join('partners', 'partners.id', '=', 'pengajuans.id_partner')
            .select('pengajuans.*')
            .select('partners.image_url')
            .select('partners.id')
            .select('partners.nama')
            .where('pengajuans.id', body.id)
            .limit(1);

            const foundsChats = await Database
                .from('pengajuans')
                .join('chats', 'chats.id_pengajuan', '=', 'pengajuans.id')
                .join('pesans', 'pesans.id_chat', '=', 'chats.id')
                .select('pesans.*')
                .where('pengajuans.id', body.id)

            return response.ok({ status: 'success', code: 200, data: foundPengajuan, message: foundsChats })

        } catch (error) {
            return response.internalServerError({ status: 'error', code: 500, message: error.message })
        }
    }
}
