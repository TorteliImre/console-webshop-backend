import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'entities/User';
import { Purchase } from 'entities/Purchase';

@Module({
  imports: [TypeOrmModule.forFeature([User, Purchase])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
