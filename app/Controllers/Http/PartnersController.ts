import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Partner from 'App/Models/Partner'
import cloudinary from '@ioc:Adonis/Addons/Cloudinary'
import Database from '@ioc:Adonis/Lucid/Database'

export default class PartnersController {

    public async index({ auth, response }: HttpContextContract) {
        try {
            const user = auth.use('partner').user;

            if(user === undefined)
                return response.unauthorized({ status: 'error', code: 401, message: 'unauthorized operation' })

            const results = await Database
            .from('partners')
            .join('pengajuans', 'pengajuans.id_partner', "=", "partners.id")
            .count('*', 'total_pengajuan')
            .where('partners.id', user.id)

            const pengajuanBerhasil = await Database
            .from('pengajuans')
            .join('partners', 'partners.id', '=', 'pengajuans.id')
            .count('*', 'total_pengajuan_berhasil')
            .where('partners.id', user.id)
            .where('pengajuans.status', 'berhasil')

            return response.ok({ status: 'success', total: results[0].total_pengajuan, total_pengajuan_berhasil: pengajuanBerhasil[0].total_pengajuan_berhasil })
            
        } catch (err) {
            return response.status(500).json({ status: 'error', code: 500, message: err.message })
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
        const file = request.file('file', {
            size: '500kb',
            extnames: ['jpg', 'jpeg', 'png']
        })

        try {
            const foundPartner = await Partner.query().where('email', body.email).first();

            if (foundPartner !== null)
                return response.status(500).json({ status: 'error', code: 500, message: `partner with email ${body.email} already been created` })

            if (!file?.isValid)
                return response.internalServerError({ status: 'error', code: 500, message: file?.errors })

            const image = await cloudinary.upload(file, file.clientName)

            const newPartner = new Partner();

            newPartner.email = body.email;
            newPartner.password = body.password;
            newPartner.nama = body.nama;
            newPartner.sop = body.sop;
            newPartner.dukungan = body.dukungan;
            newPartner.no_telp = body.no_telp;
            newPartner.alamat = body.alamat;
            newPartner.image_url = image.url;
            newPartner.deskripsi = body.deskripsi;

            await newPartner.save();

            return response.status(200).json({ status: 'success', code: 200, data: newPartner })
        } catch (err) {
            return response.status(500).json({ status: 'error', code: 500, message: err.message })
        }
    }

    public async login({ auth, request, response }: HttpContextContract) {
        const body = request.only(['email', 'password']);

        try {
            const token = await auth.use('partner').attempt(body.email, body.password)

            return response.status(200).json({ status: 'success', code: 200, data: { ...token.toJSON(), ...auth.use('partner').user?.toJSON(), role: 'partner' } })
        } catch (err) {
            return response.status(500).json({ status: 'error', code: 500, message: err.message })
        }
    }

    public async update({ auth, request, response }: HttpContextContract) {
        const body = request.all();

        try {
            const partner = auth.use('partner').user;

            if (partner === undefined)
                return response.unauthorized({ message: 'operation not permitted' })

            const foundPartner = await Partner.findBy('id', body.id);

            if (foundPartner === null)
                return response.notFound({ message: 'partner not found' })

            foundPartner.email = body.email;
            partner.nama = body.nama;
            partner.sop = body.sop;
            partner.dukungan = body.dukungan;
            partner.no_telp = body.no_telp;
            partner.deskripsi = body.deskripsi;
            partner.alamat = body.alamat;

            await foundPartner.save();

            return response.ok({ status: 'success', code: 200, data: foundPartner })
        } catch (error) {
            return response.internalServerError({ status: 'error', code: 500, message: error.message })
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

    public async getById({ auth, request, response }: HttpContextContract){
        const params = request.params();
        
        try {
            const user = auth.use('user').user;

            if(user === undefined)
                return response.unauthorized({ status: 'error', code: 401, message: 'unauthorized operation' })

            const foundPartner = await Partner.findBy('id', params.id);

            if(foundPartner === null)
                return response.notFound({ status: 'error', code: 404, message: 'partner not found' })

                return response.ok({ status: 'success', code: 200, data: foundPartner })
        } catch (error) {
            return response.internalServerError({ status: 'error', code: 500, message: error.message })
        }
    }

    public async find({ auth, request, response }: HttpContextContract) {
        const body = request.qs();

        try {
            const user = auth.use('user').user;
            if (user === undefined)
                return response.unauthorized('operation not permitted')

            // const foundPartner = await Partner.query().where('nama', 'like', `%${body.q}%`);

            const foundLike = await Database
            .from('partners')
            .leftJoin('liked_partners', 'partners.id', '=', 'liked_partners.id_partner')
            .select('partners.id')
            .select('partners.nama')
            .select('partners.deskripsi')
            .select('partners.image_url')
            .select('liked_partners.disukai')
            .where('partners.nama', 'like', `%${body.q}%`)

            return response.status(200).json({ status: 'success', code: 200, data: foundLike, message: 'success get' })

        } catch (error) {
            return response.status(500).json({ status: 'error', code: 500, message: error.message })
        }
    }

    public async logout({ auth, response }: HttpContextContract) {
        try {
            const partner = auth.use('partner').user;

            if (partner === undefined)
                return response.unauthorized({ status: 'error', code: 401, message: 'request unauthorized' })

            await auth.use('partner').revoke()

            return response.ok({ status: 'success', code: 200, message: 'partner token revoked' })
        } catch (error) {
            return response.internalServerError({ status: 'error', code: 500, message: error.message })
        }
    }
}
