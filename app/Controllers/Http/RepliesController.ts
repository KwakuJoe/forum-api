import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Reply from 'App/Models/Reply'
import Thread from 'App/Models/Thread'
import CreateReplyValidator from 'App/Validators/CreateReplyValidator'
import ResponseController from './ResponsesController'

export default class RepliesController extends ResponseController{

    public async store({response, params, request, auth}:HttpContextContract){

        const validatedData = await request.validate(CreateReplyValidator)

        try{
            // finf the thread by id
            const thread  =await Thread.findByOrFail('id', params.thread_id)
            // create a reply
            const reply = await Reply.create({
                userId:auth.user?.id,
                content: validatedData.content,
                threadId:thread?.id
            })
            
           const user =  auth.user

            this.sendResponse(response, 'Reply created successfully', {reply, user})

    
        }catch(error){

            this.sendError(response, error.message, {})
        }



    }
}
