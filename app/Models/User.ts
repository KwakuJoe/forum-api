import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasMany, HasMany,  } from '@ioc:Adonis/Lucid/Orm'
import Thread from './Thread'
import Reply from './Reply'
// import Member from './Member'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public name: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  // @belongsTo(() => Member)
  // public category: BelongsTo<typeof Member>

  @hasMany(() => Thread)
  public threads: HasMany<typeof Thread>

  @hasMany(() => Reply)
  public replies: HasMany<typeof Reply>
}
