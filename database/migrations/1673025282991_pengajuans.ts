import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'pengajuans'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nama_acara').nullable()
      table.enu('jenis_acara', ['Dies natalis', 'seminar', 'lomba']).nullable()
      table.date('tanggal').nullable()
      table.dateTime('waktu').nullable()
      table.enu('status', ['berlangsung', 'berhasil', 'selesai', 'gagal']).notNullable().defaultTo('berlangsung')
      table.text('deskripsi_acara').nullable()
      table.string('instansi').nullable()
      table.string('tempat').nullable()

      // foreign keys
      table.integer('id_user').unsigned().references('users.id').onDelete('CASCADE')
      table.integer('id_partner').unsigned().references('partners.id').onDelete('CASCADE')
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
