import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
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
                // newPengajuan.status = body.status
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

            const foundPengajuan = await Pengajuan.query().where('id', body.id).first();

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
        const body = request.only(['id'])

        try {
            const user = auth.use('user').user;

            if(user === undefined)
                return response.unauthorized({ status: 'error', code: 401, message: 'operation not permitted' })

                const foundPengajuan = await Pengajuan.findBy('id', body.id);

                return response.ok({ status: 'success', code: 200, data: foundPengajuan })
        } catch (error) {
                return response.internalServerError({ status: 'error', code: 500, message: error.message })
        }
    }

    public async partnerFind({ auth, request, response }: HttpContextContract){
        const body = request.only(['id'])

        try {
            const partner = auth.use('partner').user;

            if(partner === undefined)
                return response.unauthorized({ status: 'error', code: 401, message: 'operation not permitted' })

                const foundPengajuan = await Pengajuan.findBy('id', body.id);

                return response.ok({ status: 'success', code: 200, data: foundPengajuan })
        } catch (error) {
                return response.internalServerError({ status: 'error', code: 500, message: error.message })
        }
    }

    // public async delete({ auth, request, response }: HttpContextContract){
    //     const body = request.only(['id'])

    //     try {
            
    //     } catch (error) {
            
    //     }
    // }
}
