import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Uploads extends BaseSchema {
  protected tableName = 'uploads'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('csv_file_name')
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}