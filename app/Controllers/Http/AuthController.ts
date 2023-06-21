import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import RegisterValidator from 'App/Validators/RegisterValidator'
import ResponseController from './ResponsesController'
import LoginValidator from 'App/Validators/LoginValidator'
import Hash from '@ioc:Adonis/Core/Hash'


export default class AuthController extends ResponseController{

    public async register({request, auth, response}: HttpContextContract) {

        // validate the request
        const validatedData = await request.validate(RegisterValidator)

        try{

            // create the user with validated
            const user = await User.create(validatedData)
            // login in the user
            const token = await auth.login(user)
            // send response
            this.sendResponse(
                response, 
                'User registered successfully', {
                    user,
                    token
                }
                )

        }catch(error){
            // catch error
            this.sendError(response, error.message, {})
        }


      }



      public async login({request, response, auth}: HttpContextContract) {
        const {email, password} = await request.validate(LoginValidator)

        const user = await User.query().where('email', email).first()

        if(!user){
            return this.notFound(response, 'We could not find user with this email', [])
        }

        const passwordVerified = await Hash.verify(user!.password, password)

        if (!passwordVerified) {
           return this.sendError(response, 'Authentication failed, Incorrect credentials',[])
          }

          const token = await auth.use('api').generate(user!)

          return this.sendResponse(response, 'Authenticated successfully', {user, token})

    }
}
