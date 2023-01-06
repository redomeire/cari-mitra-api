import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'ulasans'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('deskripsi').nullable()
      table.integer('id_user').unsigned().references('users.id').onDelete('CASCADE')
      table.integer('id_partner').unsigned().references('partners.id').onDelete('CASCADE')
      table.float('nilai').nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
