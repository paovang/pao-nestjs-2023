import { JwtService } from '@nestjs/jwt';
import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService, JwtService],
  exports: [UsersService]
})
export class UsersModule {}
