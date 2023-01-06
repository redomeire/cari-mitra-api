import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Partner from './Partner'

export default class LikedPartner extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public id_partner: number;

  @column()
  public id_user: number;

  @column()
  public disukai: boolean

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
