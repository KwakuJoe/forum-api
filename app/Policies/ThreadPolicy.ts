import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Thread from 'App/Models/Thread'

export default class ThreadPolicy extends BasePolicy {
	// public async create(user: User) {}
	public async update(user: User, thread: Thread) {
		return thread.userId  === user.id
	}

	public async delete(user: User, thread: Thread) {
		return thread.userId  === user.id
	}

}
