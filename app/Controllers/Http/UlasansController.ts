import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Ulasan from 'App/Models/Ulasan';

export default class UlasansController {
    public async create({ auth, request, response }: HttpContextContract) {
        const body = request.all()

        try {
            const user = auth.use('user').user;
            const newUlasan = new Ulasan()

            if (user !== undefined) {
                newUlasan.id_user = user.id;
                newUlasan.nilai = body.nilai;
                newUlasan.id_partner = body.id_partner;
                newUlasan.deskripsi = body.deskripsi;

                return response.status(200).json({ status: 'success', code: 200, data: newUlasan })
            } else throw new Error('cannot create ulasan')

        } catch (error) {
            return response.status(500).json({ status: 'error', code: 500, message: error.message })
        }
    }

    public async getAll({ auth, response }: HttpContextContract){
        try {
            const partner = auth.use('partner').user;
            if(partner === undefined)
                return response.unauthorized('operation not permitted')
            
            const foundUlasan = await Ulasan.all();

            return response.status(200).json({ status: 'success', code: 200, data: foundUlasan, message: 'ulasan berhasil didapatkan' })
        } catch (error) {
            return response.status(500).json({ status: 'success', code: 500, message: error.message })
        }
    }

    public async getById({ auth, request, response }: HttpContextContract){
        const body = request.only(['id']);

        try {
            const user = auth.use('user').user;
            if(user === undefined)
                return response.unauthorized('operation not permitted')
            
            const foundUlasan = await Ulasan.findBy('id', body.id);

            if(foundUlasan === null)
                return response.notFound('ulasan tidak ditemukan')

                return response.status(200).json({ status: 'success', code: 200, data: foundUlasan, message: 'ulasan berhasil didapatkan' })
        } catch (error) {
            return response.status(500).json({ status: 'success', code: 500, message: error.message })
        }
    }

    public async update({ auth, request, response }: HttpContextContract) {
        const body = request.all();

        try {
            const user = auth.use('user').user;

            if (user === undefined)
                return response.unauthorized('operation not permitted')

            const foundUlasan = await Ulasan.findBy('id', body.id);

            if (foundUlasan === null)
                return response.notFound('ulasan yang diinginkan tidak ditemukan')

            foundUlasan.deskripsi = body.deskripsi;
            foundUlasan.nilai = body.nilai;

            return response.status(200).json({ status: 'sucess', code: 200, data: foundUlasan })

        } catch (error) {
            return response.status(500).json({ status: 'error', code: 500, message: error.message })
        }
    }

    public async delete({ auth, request, response }: HttpContextContract) {
        const body = request.only(['id'])

        try {
            const user = auth.use('user').user;
            const foundUlasan = await Ulasan.findBy('id', body.id);

            if (user === undefined)
                return response.unauthorized('operation not permitted')

            if (foundUlasan === null)
                return response.notFound('ulasan yang diinginkan tidak ditemukan')

            await foundUlasan.delete()

            return response.status(200).json({ status: 'success', code: 200, data: foundUlasan, message: 'success delete ulasan' })
        } catch (error) {
            return response.status(500).json({ status: 'error', code: 500, message: error.message })
        }
    }
}
