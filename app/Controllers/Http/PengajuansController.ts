import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import Pengajuan from 'App/Models/Pengajuan';

export default class PengajuansController {
    public async create({ auth, request, response }: HttpContextContract){
        const body = request.all();

        try {
            const user = auth.use('user').user

            if(user === undefined)
                return response.unauthorized('operation not permitted')

                const newPengajuan = new Pengajuan()
                newPengajuan.nama_acara = body.nama_acara
                newPengajuan.jenis_acara = body.jenis_acara
                newPengajuan.tanggal = body.tanggal
                newPengajuan.waktu = body.waktu
                newPengajuan.status = ["berlangsung"]
                newPengajuan.id_user = user.id
                newPengajuan.id_partner = body.id_partner
                newPengajuan.deskripsi_acara = body.deskripsi_acara
                newPengajuan.instansi = body.instansi
                newPengajuan.tempat = body.tempat

                await newPengajuan.save()

                return response.status(200).json({ status: 'success', code: 200, data: newPengajuan, message: 'pengajuan baru berhasil dibuat' })

        } catch (error) {
            return response.status(500).json({ status: 'error', code: 500, message: error.message })
        }
    }

    public async update({ auth, request, response }: HttpContextContract) {
        const body = request.only(['id', 'status']);

        try {
            const partner = auth.use('partner').user;

            if(partner === undefined)
                return response.unauthorized('only partner has the authority')

            const foundPengajuan = await Pengajuan.query().where('id', body.id).where('id_partner', partner.id).first();

            if(foundPengajuan === null)
                return response.notFound(`cannot find pengajuan with id ${body.id}`)

            foundPengajuan.status = body.status;
            await foundPengajuan.save()

            return response.ok({ code: 200, data: foundPengajuan })
        } catch (error) {
            return response.internalServerError({ code: 500, message: error.message })
        }
    }

    public async userFind({ auth, request, response }: HttpContextContract){
        const body = request.params()

        try {
            const user = auth.use('user').user;

            if(user === undefined)
                return response.unauthorized({ status: 'error', code: 401, message: 'operation not permitted' })

                const foundPengajuan = await Pengajuan.query().where('id', body.id).where('id_user', user.id).first();

                return response.ok({ status: 'success', code: 200, data: foundPengajuan })
        } catch (error) {
                return response.internalServerError({ status: 'error', code: 500, message: error.message })
        }
    }

    public async partnerFind({ auth, request, response }: HttpContextContract){
        const body = request.params()

        try {
            const partner = auth.use('partner').user;

            if(partner === undefined)
                return response.unauthorized({ status: 'error', code: 401, message: 'operation not permitted' })

                const foundPengajuan = await Pengajuan.query().where('id', body.id).where('id_partner', partner.id).first();

                return response.ok({ status: 'success', code: 200, data: foundPengajuan })
        } catch (error) {
                return response.internalServerError({ status: 'error', code: 500, message: error.message })
        }
    }

    public async getAllPengajuan({ auth, request ,response }: HttpContextContract){
        const body = request.qs();

        try {
            const user = auth.use('user').user || auth.use('partner').user;
            
            if(user === undefined)
                return response.unauthorized({ status: 'error', code: 401, message: 'operation not permitted' })

                let foundPengajuans = {};

                if(body.role === 'user') {
                    foundPengajuans = await Database
                    .from('pengajuans')
                    .join('partners', 'partners.id', '=', 'pengajuans.id_partner')
                    .join('users', 'users.id', '=', 'pengajuans.id_user')
                    .where('pengajuans.id_user', user.id)
                    .select('pengajuans.id')
                    .select('partners.nama')
                    .select('partners.image_url')
                    .select('pengajuans.created_at')
                    .select('pengajuans.status')
                    .select('pengajuans.nama_acara')
                } else if(body.role === 'partner') {
                    foundPengajuans = await Database
                    .from('pengajuans')
                    .join('partners', 'partners.id', '=', 'pengajuans.id_partner')
                    .join('users', 'users.id', '=', 'pengajuans.id_user')
                    .where('pengajuans.id_partner', user.id)
                    .select('pengajuans.id as id_pengajuan')
                    .select('partners.nama')
                    .select('partners.image_url')
                    .select('pengajuans.created_at')
                    .select('users.nama_depan')
                    .select('users.nama_belakang')
                    .select('pengajuans.status')
                    .select('pengajuans.nama_acara')
                }

                return response.ok({ status: 'ok', code: 200, data: foundPengajuans })
        } catch (error) {
            return response.internalServerError({ status: 'error', code: 500, data: error.message })
        }
    }

    // public async delete({ auth, request, response }: HttpContextContract){
    //     const body = request.only(['id'])

    //     try {
            
    //     } catch (error) {
            
    //     }
    // }
}
