import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import LikedPartner from 'App/Models/LikedPartner'
import Ulasan from 'App/Models/Ulasan'
import Pengajuan from 'App/Models/Pengajuan'

export default class Partner extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public nama: string

  @column()
  public sop: string

  @column()
  public dukungan: string

  @column()
  public no_telp: string

  @column()
  public deskripsi: string

  @column()
  public alamat: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async JSONify(partner: Partner){
      partner.dukungan = JSON.stringify(partner.dukungan)
  }

  @hasMany(() => LikedPartner)
  public likedpartners: HasMany<typeof LikedPartner>

  @hasMany(() => Ulasan)
  public ulasans: HasMany<typeof Ulasan>

  @hasMany(() => Pengajuan)
  public pengajuans: HasMany<typeof Pengajuan>

  @beforeSave()
  public static async hashPassword(partner: Partner){
    if(partner.$dirty.password)
      partner.password = await Hash.make(partner.password)
  }
}
