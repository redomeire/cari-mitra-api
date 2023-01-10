import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import LikedPartner from 'App/Models/LikedPartner';
import Partner from 'App/Models/Partner';

export default class LikedPartnersController {
    public async create({ auth, request, response }: HttpContextContract){
        const body = request.only(['id']);
        
        try {
            const foundPartner = await Partner.findBy('id', body.id);
            const user = auth.use('user').user;

            if(foundPartner === null)
                throw new Error('Partner not found')

            if(user !== undefined) {
                const newLiked = new LikedPartner();
                newLiked.disukai = true;
                newLiked.id_user = user.id;
                newLiked.id_partner = foundPartner.id;

                await newLiked.save()

                return response.status(200).json({ status: 'success', code: 200, data: newLiked })
            }            
        } catch (error) {
            return response.status(500).json({ status: 'error', code: 500, message: error.message })
        }
    }

    public async toggle({ auth, request, response }: HttpContextContract){
        const body = request.only(['id']);
        
        try {
            if(await auth.use('user').check()) {
                const foundLikedPartner = await LikedPartner.findBy('id', body.id);

                if(foundLikedPartner !== null) {
                    foundLikedPartner.disukai = !foundLikedPartner.disukai

                    await foundLikedPartner.save();

                    return response.status(200).json({ status: 'success', code: 200, data: foundLikedPartner, message: 'success toggle user' })
                } else throw new Error('partner not found')
            }
            else return response.unauthorized('request not permitted')

        } catch (error) {
            return response.status(500).json({ status: 'error', code: 500, message: error.message })
        }
    }

    public async getAll({ auth, response }: HttpContextContract){
        try {
            const user = auth.use('user').user;

            if(user === undefined)
                return response.unauthorized('operation not permitted')

                const allLikedPartners = await Database
                .from('users')
                .join('liked_partners', 'users.id', '=', 'liked_partners.id_user')
                .join('partners', 'partners.id', '=', 'liked_partners.id_partner')
                .select('partners.id')
                .select('partners.nama')
                .select('partners.deskripsi')
                .select('partners.alamat')
                .select('partners.no_telp')

                    return response.status(200).json({ status: 'success', code: 200, data: allLikedPartners, message: 'success getting favorites' })
        } catch (error) {
            return response.status(500).json({ status: 'error', code: 500, message: error.message })
        }
    }
}
