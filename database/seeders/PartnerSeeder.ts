import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Partner from 'App/Models/Partner'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await Partner.createMany([
      {
        nama: 'Radio Kencana',
        deskripsi: 'Radio kencana mengudara dengan jangkauan Malang Raya dan kota Batu. Memutarkan lagu - lagu hits lokalan internasional dipadu dengan gaya siaran yang akrab, dinamis, dan up to date',
        no_telp: '081234567890',
        sop: 'ini adalah sop radio kencana',
        dukungan: '{ dukungan: ["Postingan Feed Instagram", "Snapgram"]}',
        alamat: 'Jalan Candi Panggung No.2 Mojolangu, Kec.Lowokwaru, Kota Malang',
        email: 'radiokencana@gmail.com',
        password: '12345'
      },
      {
        nama: 'Radio Rusak',
        deskripsi: 'Radio rusak mengudara dengan jangkauan Malang Raya dan kota Batu. Memutarkan lagu - lagu hits lokalan internasional dipadu dengan gaya siaran yang akrab, dinamis, dan up to date',
        no_telp: '081234567890',
        sop: 'ini adalah sop radio rusak',
        dukungan: '{ dukungan: ["Postingan Feed Instagram", "Snapgram"]}',
        alamat: 'Jalan Candi Panggung No.1 Mojolangu, Kec.Lowokwaru, Kota Malang',
        email: 'radiorusak@gmail.com',
        password: '12345'
      }
    ])
  }
}
