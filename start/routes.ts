/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', ({ response }) => {
    return response.json({ data: { message: 'this is home' } })
})

// user
Route.group(() => {
    Route.group(() => {
        Route.post('/register', 'AuthController.register');
        Route.post('/login', 'AuthController.login');
        Route.put('/password-reset', 'AuthController.reset').middleware('auth');
        Route.put('/update', 'AuthController.update').middleware('auth');
        Route.get('/user', 'AuthController.getUser').middleware('auth')
        Route.delete('/delete', 'AuthController.delete').middleware('auth');
        Route.post('/logout', 'AuthController.logout').middleware('auth');

        // google
        Route.get('/google/redirect', 'GooglesController.redirect');
        Route.get('/google/callback', 'GooglesController.callback');
    }).prefix('/auth')

    Route.group(() => {
        Route.post('/create', 'PartnersController.create');
        Route.post('/login', 'PartnersController.login');
        Route.get('/get', 'PartnersController.index').middleware('auth');
        Route.get('/get/:id', 'PartnersController.getById').middleware('auth');
        Route.get('/search', 'PartnersController.find').middleware('auth');
        Route.put('/edit', 'PartnersController.edit').middleware('auth');
        Route.delete('/delete', 'PartnersController.delete').middleware('auth');
        Route.post('/logout', 'PartnersController.logout').middleware('auth');

        Route.group(() => {
            Route.get('/get/all', 'LikedPartnersController.getAll').middleware('auth')
            Route.post('/like', 'LikedPartnersController.create').middleware('auth')
            Route.put('/toggle', 'LikedPartnersController.toggle').middleware('auth')
        }).prefix('/favorite')

    }).prefix('/partner')

    Route.group(() => {
        Route.post('/create', 'UlasansController.create').middleware('auth')
        Route.get('/get/detail/:id', 'UlasansController.getById').middleware('auth')
        Route.get('/get/all', 'UlasansController.getAll').middleware('auth') // available for partner only
        Route.put('/update', 'UlasansController.update').middleware('auth')
        Route.delete('/delete', 'UlasansController.delete').middleware('auth')
    }).prefix('/ulasan')

    Route.group(() => {
        Route.post('/create', 'PengajuansController.create').middleware('auth') // for user
        Route.put('/update', 'PengajuansController.update').middleware('auth') // for partner
        Route.get('/user/find/:id', 'PengajuansController.userFind').middleware('auth') // for user
        Route.get('/user/get/all', 'PengajuansController.getAllPengajuan').middleware('auth')
        Route.get('/partner/find/:id', 'PengajuansController.partnerFind').middleware('auth') // for user

        Route.post('/create/chatroom', 'ChatsController.createRoom').middleware('auth'); // for user
        Route.get('/get/details/:id', 'ChatsController.detail').middleware('auth'); // for user
        Route.post('/store/messages', 'ChatsController.storeMessage').middleware('auth'); // for user
        Route.delete('/message/delete', 'ChatsController.deleteMessage').middleware('auth');
    }).prefix('/pengajuan')

}).prefix('/api')


