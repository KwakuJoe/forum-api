import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Thread from 'App/Models/Thread'
import ResponseController from './ResponsesController'
import UpdateThreadValidator from 'App/Validators/UpdateThreadValidator'
import CreateThreadValidator from 'App/Validators/ThreadValidator'
import SortValidator from 'App/Validators/SortValidator'
import UnAuthorizedException from 'App/Exceptions/UnAuthorizedException'



export default class ThreadsController extends ResponseController {

  public async store({ request, response, auth }: HttpContextContract) {
    const validatedData = await request.validate(CreateThreadValidator)

    try {
      // create the thread using the current user id
      const thread = await Thread.create({
        userId: auth.user?.id,
        categoryId: validatedData.categoryId,
        content: validatedData.content,
        title: validatedData.title,
      })

      //   Gte the current user
      const user = auth.user

      //   resturn the thread and current user
      this.sendResponse(response, 'Thread created successfully', { thread, user })
    } catch (error) {
      {
        this.sendError(response, error.message, {})
      }
    }

    // const thread  = await auth.user?.related('threads').create(validatedData)
    // await thread?.preload('user')
  }



  public async show({response, params,}:HttpContextContract){

    try{
    // find the thread based on id provided

        const thread = await Thread.query()
        .where('id', params.id)
        .preload('user')
        .preload('category')
        .preload('replies')
        .firstOrFail();

        this.sendResponse(response, 'thread found sucessfully', {thread})

    }catch(error){

        this.notFound(response, error.message, {})

    }


  }


  public async index({request, response}:HttpContextContract){

    const page = request.input('page', 1)
    const pagePage = request.input('per_page', 30)
    // filtering parameters
    const userId = request.input('user_id') 
    const categoryId = request.input('category_id') 

    // Sort parameters
    const validatedData = await request.validate(SortValidator)

    const sortBy = validatedData.sort_by || 'id'
    const order = validatedData.order || 'asc'


    //  
    try{

        const threads = await Thread.query()
        .if(userId, (query) =>{
          query.where('user_id', userId)
        })
        .if(categoryId, (query) =>{
          query.where('category_id', categoryId)
        })
        .orderBy(sortBy, order)
        .preload('user')
        .preload('category')
        .preload('replies')
        .paginate(page, pagePage)

        this.sendResponse(response,'Threads queried successfully', {threads})

    }catch(error){
        this.sendError(response, error.message, {})
    }

  }


  public async update({request, response, params, bouncer}:HttpContextContract){

    const validatedData = await request.validate(UpdateThreadValidator)


    try{

        const thread = await Thread.findOrFail(params.id)

        //  await bouncer.with('ThreadPolicy').authorize('delete', thread)
         if(await bouncer.with('ThreadPolicy').denies('delete', thread)){
          throw new UnAuthorizedException('You are not allowed to update this thread')
        }

        thread.merge(validatedData)

        await thread.save()

        this.sendResponse(response, 'Thread updated successfully', {thread})

    } catch(error){

        this.sendError(response, error.message, {})

    }

  }


  public async destroy({ response, params, bouncer}:HttpContextContract){


    try{

        const thread = await Thread.findOrFail(params.id)

      if(await bouncer.with('ThreadPolicy').denies('delete', thread)){
        throw new UnAuthorizedException('You are not allowed to delete this thread')
      }

        await thread.delete()

        this.sendResponse(response, 'Thread deleted successfully', {thread})

    }catch(error){

        this.sendError(response, error.message  , {})
    }

  }
}
