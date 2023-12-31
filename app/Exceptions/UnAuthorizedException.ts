import { Exception } from '@adonisjs/core/build/standalone'


/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new UnAuthorizedException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class UnAuthorizedException extends Exception {
    
    constructor(message: string,){
        super(message, 403)
    }


    public async handle(error:this, {}){
        return {
            code: 403,
            message: error.message
        }
    }
}
