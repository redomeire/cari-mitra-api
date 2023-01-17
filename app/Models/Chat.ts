import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Pengajuan from './Pengajuan'
import Pesan from './Pesan'

export default class Chat extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public id_pengajuan: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Pengajuan, {
    foreignKey: 'id_pengajuan'
  })
  public pengajuan: BelongsTo<typeof Pengajuan>

  @hasMany(() => Pesan)
  public pesans: HasMany<typeof Pesan>
}
