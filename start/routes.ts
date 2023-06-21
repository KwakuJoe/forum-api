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

Route.group(() => {
 // auth
Route.post('auth/register', 'AuthController.register')
Route.post('auth/login', 'AuthController.login')

// threads
// Route.post('threads', 'ThreadsController.store').middleware('auth')
// Route.get('thread/:id', 'ThreadsController.show').middleware('auth')
// Route.get('threads', 'ThreadsController.index').middleware('auth')
// Route.patch('thread/:id', 'ThreadsController.update').middleware('auth')
// Route.delete('thread/:id', 'ThreadsController.destroy').middleware('auth')

// let refactor the thread routes with resources
Route.resource('threads', 'ThreadsController')
.apiOnly()
.middleware({
    store:'auth',
    update:'auth',
    destroy:'auth',
})


// thread
// Route.post('thread/:thread_id/replies', 'RepliesController.store').middleware('auth')

// lets refactor replies routes with resources
Route.resource('threads.replies', 'RepliesController')
.only(['store'])
.middleware({store:'auth'})


}).prefix('api')