import { typeOrmOption } from '@/common/configurations/typeorm.config';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [TypeOrmModule.forRootAsync(typeOrmOption())],
})
export class TypeOrmRepositoryModule {}