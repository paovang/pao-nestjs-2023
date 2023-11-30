import { UserModel } from './../../domain/entities/user.model';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { hash } from 'bcrypt';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
  ): Promise<any> {
    const usersRepository = dataSource.getRepository(UserModel);

    const user = new UserModel();
    user.first_name = 'alex';
    user.last_name = 'vang';
    user.email = 'alex_vang@gmail.com';
    user.password = await hash('123456', 10);

    const user1 = new UserModel();
    user1.first_name = 'test 1';
    user1.last_name = 'vang 1';
    user1.email = 'user@gmail.com';
    user1.password = await hash('123456', 10);

    const newUser = await usersRepository.save([user, user1]);
  }
}