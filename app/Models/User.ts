import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import LikedPartner from 'App/Models/LikedPartner'
import Ulasan from 'App/Models/Ulasan'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nama_depan: string

  @column()
  public nama_belakang: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => LikedPartner)
  public likedpartners: HasMany<typeof LikedPartner>

  @hasMany(() => Ulasan)
  public ulasans: HasMany<typeof Ulasan>

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
