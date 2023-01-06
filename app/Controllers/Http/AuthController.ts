import User from "App/Models/User";
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from "@ioc:Adonis/Core/Hash";


export default class AuthController {
    public async login({ auth, request, response }: HttpContextContract) {
        const body = request.only(['email', 'password']);

        try {                
            const foundUser = await User.query().where('email', body.email).first();

            if (foundUser !== null) {
                if ((await Hash.verify(foundUser.password, body.password))) {
                    const token = await auth.use('user').generate(foundUser, {
                        expiresIn: "30 mins"
                    });
                    return response.status(200).json({ status: 'success', code: 200, data: { ...token.toJSON() } })
                }
                else {
                    const error = new Error('invalid credential')
                    throw error
                }
            }
        } catch (err) {
            return response.status(404).json({ status: 'error', code: 404, data: { message: err.message } })
        }
    }

    public async register({ auth, request, response }: HttpContextContract) {
        const body = request.only(['nama_depan', 'nama_belakang', 'email', 'password', 'remember_me_token']);

        try {
            const isLoggedIn = await auth.use('user').check()
            const foundUser = await User.query().where('email', body.email).first()

            if (foundUser !== null)
                return response.status(500).json({ status: 'error', message: `user with email ${foundUser.email} has been created before` })

            if (isLoggedIn)
                return response.status(500).json({ status: 'error', message: 'need to log out first' })


            const user = new User();
            user.nama_depan = body.nama_depan;
            user.nama_belakang = body.nama_belakang;
            user.email = body.email;
            user.password = body.password;
            user.rememberMeToken = body.remember_me_token;

            await user.save();

            return response.status(200).json({ status: 'success', code: 200, data: { ...user.toJSON(), message: 'success create user' } })

        } catch (err) {
            return response.status(500).json({ status: 'error', code: 500, data: { message: err.message } })
        }
    }

    public async reset({ auth, request, response }: HttpContextContract) {
        const body = request.only(['old_password', 'new_password']);

        try {
            const user = auth.use('user').user;

            if (user !== undefined && await Hash.verify(user.password, body.old_password)) {
                const foundUser = await User.query().where('email', user.email).first();

                if (foundUser !== null) {
                    foundUser.password = body.new_password;
                    await foundUser.save();

                    return response.status(200).json({ code: 200, status: 'success', data: foundUser })
                } else throw response.status(404).json({ code: 404, status: 'error', message: 'user not found' })
            } else throw response.unauthorized('credential not match')

        } catch (err) {
            return response.status(500).json({ code: 500, status: 'error', message: err.message })
        }
    }

    public async delete({ auth, request, response }: HttpContextContract) {
        const body = request.only(['id'])
        
        try{
            if(!(await auth.use('user').check()))
                return response.unauthorized('operation not permitted')

            const foundUser = await User.findBy('id', body.id);

            if(foundUser !== null) {
                await foundUser.delete();

                return response.status(200).json({ code: 200, status: 'success', data: foundUser })
            } else throw new Error('user not found');

        } catch(err) {
            return response.status(404).json({ status: 'error', code: 404, data: { message: err.message } })
        }
    }
}
