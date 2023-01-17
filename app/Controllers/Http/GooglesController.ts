import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class GooglesController {
    public async redirect({ ally }: HttpContextContract) {
        return ally.use('google').redirect()
    }

    public async callback({ auth, ally, response }: HttpContextContract) {
        const google = ally.use('google')

        if (google.accessDenied())
            return response.abort({ message: 'access denied', status: 'error' })

        if (google.stateMisMatch())
            return response.abort({ message: 'Request expired', status: 'error' })

        if (google.hasError())
            return response.internalServerError({ message: google.getError(), status: 'error' })

        const googleUser = await google.user()

        const googleUserName = googleUser.name.split(' ');

        const user = await User.firstOrCreate({
            email: googleUser.email !== null ? googleUser.email : '',
        }, {
            email: googleUser.email !== null ? googleUser.email : '',
            nama_depan: googleUserName[0],
            nama_belakang: googleUserName[1],
            rememberMeToken: googleUser.token.token,
        })

        await auth.use('user').login(user);

        return response.ok({ data: user, message: 'success login user' })
    }
}
