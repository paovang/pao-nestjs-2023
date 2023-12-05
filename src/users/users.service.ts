import { RegisterSuccessEvent } from './../modules/user/domain/events/register-success.event';
import { UserModel } from './../modules/user/domain/entities/user.model';
import { DatabaseConnection } from './../common/configurations/typeorm.config';
import { LOGGER_SERVICE } from '@/infrastructure/adapters/logger/inject-key';
import { ILogger } from '@/infrastructure/ports/logger/logger.interface';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './../auth/auth.service';
import { IMail } from './../infrastructure/ports/mail/mail.interface';
import { MAIL_SERVICE } from './../infrastructure/adapters/mail/inject-key';
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { EventBus } from '@nestjs/cqrs';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  constructor(
    private readonly _jwt: JwtService,
    @Inject(MAIL_SERVICE) private readonly _mailer: IMail<any>,
    @Inject(LOGGER_SERVICE) private readonly _logger: ILogger,
    @InjectDataSource(DatabaseConnection.Main)
    private _dataSource: DataSource,
    private readonly _eventBus: EventBus,
  ) {

  }

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }


  async forgotPassword(body): Promise<any> {
    /** Publish Event */
      // await this._eventBus.publish(new RegisterSuccessEvent(1, 20000));

    /** Get User From Database */
      // const queryBuilder = this._dataSource
      //   .getRepository(UserModel)
      //   .createQueryBuilder('users')
      //   .orderBy('id', 'DESC')
      //   .getMany();

      // return queryBuilder;


    /** Test Logger */
      // this._logger.error(`[Server Error] Message: ${body.email} + ${body.subject}`);


    /** Test Send Email */
      // const user = this.users.find(user => user.username === 'john');

      // if (!user) throw new NotFoundException();

      // const payload = {
      //   sub: user.userId,
      //   username: user.username,
      //   timestamp: new Date().getTime(),
      // };

      // const token = await this._jwt.sign(payload);
      // console.log(token); 

      // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG4iLCJzdWIiOjEsImlhdCI6MTcwMTM0MTMzOCwiZXhwIjoxNzAxMzQxMzk4fQ.PSGa3uXcxSrS_9j8PH4xDrD1xDyCuqUkGmXpjmaWlPE';

      // await this._mailer.sendMail({
      //   to: body.email,
      //   subject: body.subject,
      //   template: 'forgot-password',
      //   context: {
      //     url: `http://uklao.com/forgot-password?token=${token}`
      //   },
      // });

    return { message: 'send email success.' };
  }
}

// url: this._config.get('ADMIN_URL') + `/auth/forgot-password?token=${token}`,