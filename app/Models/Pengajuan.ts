import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Partner from 'App/Models/Partner'
import Chat from './Chat'

export default class Pengajuan extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nama_acara: string

  @column()
  public jenis_acara: Array<string> = ["Dies natalis", "seminar", "lomba"]

  @column()
  public tanggal: Date

  @column()
  public waktu: DateTime

  @column()
  public status: Array<string> = ["berlangsung", "berhasil", "selesai", "gagal"]

  @column()
  public deskripsi_acara: string

  @column()
  public instansi : string

  @column()
  public tempat: string

  @column()
  public id_user: number

  @column()
  public id_partner: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Chat)
  public chats: HasOne<typeof Chat>

  @belongsTo(() => User, {
    foreignKey: 'id_user'
  })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Partner, {
    foreignKey: 'id_partner'
  })
  public partner: BelongsTo<typeof Partner>
}
