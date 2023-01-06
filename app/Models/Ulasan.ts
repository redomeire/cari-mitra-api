import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Partner from 'App/Models/Partner'

export default class Ulasan extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public id_user: number

  @column()
  public id_partner: number

  @column()
  public deskripsi: string

  @column()
  public nilai: Float32Array

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'id_user'
  })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Partner, {
    foreignKey: 'id_partner'
  })
  public partner: BelongsTo<typeof Partner>
}
