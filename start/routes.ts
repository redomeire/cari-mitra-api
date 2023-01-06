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
    Route.post('/register', 'AuthController.register');
    Route.post('/login', 'AuthController.login');
    Route.put('/password-reset', 'AuthController.reset').middleware('auth');
    Route.delete('/delete', 'AuthController.delete').middleware('auth');
}).prefix('/auth')

Route.group(() => {
    Route.get('/get', 'PartnersController.index').middleware('auth');
    Route.put('/edit', 'PartnersController.edit').middleware('auth');
    Route.post('/create', 'PartnersController.create');
    Route.post('/login', 'PartnersController.login');
    Route.delete('/delete', 'PartnersController.delete').middleware('auth');
}).prefix('/partner')

