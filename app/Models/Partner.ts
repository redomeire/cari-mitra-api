import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'

export default class Partner extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
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

  @beforeSave()
  public static async hashPassword(partner: Partner){
    if(partner.$dirty.password)
      partner.password = await Hash.make(partner.password)
  }
}
