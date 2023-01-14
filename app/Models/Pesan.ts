import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Chat from './Chat'

export default class Pesan extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public id_chat: number

  @column()
  public text_message: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Chat, {
    foreignKey: 'id_chat'
  })
  public chat: BelongsTo<typeof Chat>
}
