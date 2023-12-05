import { RegisterSuccessListener } from './../modules/user/listeners/register-success.listener';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService, JwtService, RegisterSuccessListener],
  exports: [
    UsersService
  ]
})
export class UsersModule {}
