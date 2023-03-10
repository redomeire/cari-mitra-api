import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'partners'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('email', 255).unique().notNullable()
      table.string('password', 180).notNullable()
      table.string('nama').notNullable().defaultTo('nama partner')
      table.text('sop').nullable()
      table.json('dukungan').nullable()
      table.string('no_telp').nullable()
      table.text('deskripsi').nullable()
      table.string('alamat').nullable()
      table.string('image_url').nullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
