import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
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
}
