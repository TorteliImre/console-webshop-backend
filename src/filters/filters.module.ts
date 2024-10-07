import { Module } from '@nestjs/common';
import { FiltersService } from './filters.service';
import { FiltersController } from './filters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from 'entities/Location';

@Module({
  imports: [TypeOrmModule.forFeature([Location])],
  providers: [FiltersService],
  controllers: [FiltersController],
})
export class FiltersModule {}
