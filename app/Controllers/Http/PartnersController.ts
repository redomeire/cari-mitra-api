import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Partner from 'App/Models/Partner'
import Hash from '@ioc:Adonis/Core/Hash'

export default class PartnersController {

    public async index({ auth, response }: HttpContextContract) {
        try {
            if(await auth.use('partner').check()) {
                return response.status(200).json({ data: await Partner.all() })
            }

            else 
                return response.status(401).json({ message: 'unauthorized operation' })
        } catch(err){
            return response.status(401).json({ status: 'error', code: 401, message: err.message })
        }

    }

    public async edit({ request, response }: HttpContextContract) {
        const body = request.all();

        try {
            const partner = await Partner.findBy('id', body.id);

            if (partner !== null) {
                partner.nama = body.nama;
                partner.sop = body.sop;
                partner.dukungan = body.dukungan;
                partner.no_telp = body.no_telp;
                partner.deskripsi = body.deskripsi;

                await partner.save();

                return response.status(200).json({ status: 'success', code: 200, data: partner })
            }
            else
                throw new Error('partner not found');

        } catch (err) {
            return response.status(404).json({ status: 'error', code: 404, message: err.message })
        }
    }

    public async create({ request, response }: HttpContextContract) {
        const body = request.all()

        try {
            const foundPartner = await Partner.query().where('email', body.email);

            if (foundPartner !== null)
                return response.status(500).json({ status: 'error', code: 500, message: `partner with email ${body.email} already been created` })

            const newPartner = new Partner();

            newPartner.email = body.email;
            newPartner.password = body.password;
            newPartner.nama = body.nama;
            newPartner.sop = body.sop;
            newPartner.dukungan = body.dukungan;
            newPartner.no_telp = body.no_telp;
            newPartner.alamat = body.alamat;

            await newPartner.save();

            return response.status(200).json({ status: 'success', code: 200, data: newPartner })
        } catch (err) {
            return response.status(500).json({ status: 'error', code: 500, message: err.message })
        }
    }

    public async login({ auth, request, response }: HttpContextContract) {
        const body = request.only(['email', 'password']);

        try {
            const foundPartner = await Partner.findBy('email', body.email);

            if (foundPartner === null)
                throw new Error('partner not found')

            else if (await Hash.verify(foundPartner.password, body.password)) {
                const token = await auth.use('partner').generate(foundPartner);
                return response.status(200).json({ status: 'success', code: 200, data: { ...token.toJSON() } })
            }
        } catch (err) {
            return response.status(500).json({ status: 'error', code: 500, message: err.message })
        }
    }

    public async delete({ auth, request, response }: HttpContextContract) {
        const body = request.only(['id'])

        try {
            const foundPartner = await Partner.findBy('id', body.id);
            await auth.use('partner').check()

            if (foundPartner === null)
                throw new Error('Partner not found')
            else {
                return response.status(200).json({ status: 'success', code: 200, data: foundPartner })
            }
        } catch (err) {
            return response.status(500).json({ status: 'error', code: 500, message: err.message })
        }
    }

    public async find({ auth, request, response }: HttpContextContract){
        const body = request.qs();

        try {
            const user = auth.use('user').user;
            if(user === undefined)
                return response.unauthorized('operation not permitted')

                const foundPartner = await Partner.query().where('nama', 'like', `%${body.q}%`);

                return response.status(200).json({ status: 'success', code: 200, data: foundPartner, message: 'success get' })

        } catch (error) {
            return response.status(500).json({ status: 'error', code: 500, message: error.message })
        }
    }
}
