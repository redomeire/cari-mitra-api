import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash';

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await User.createMany([
      {
        nama_depan: 'Agung',
        nama_belakang: 'Hapsah',
        email: 'agunghapsah@gmail.com',
        password: await Hash.make('12345')
      },
      {
        nama_depan: 'Rafli',
        nama_belakang: 'Saos',
        email: 'raflisaos@gmail.com',
        password: await Hash.make('12345')
      },
    ])
  }
}
