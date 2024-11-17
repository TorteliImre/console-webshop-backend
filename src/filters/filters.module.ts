import { Module } from '@nestjs/common';
import { FiltersService } from './filters.service';
import { FiltersController } from './filters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from 'entities/Location';
import { Manufacturer } from 'entities/Manufacturer';
import { ProductState } from 'entities/ProductState';
import { Model } from 'entities/Model';

@Module({
  imports: [
    TypeOrmModule.forFeature([Location, Manufacturer, Model, ProductState]),
  ],
  providers: [FiltersService],
  controllers: [FiltersController],
  exports: [FiltersService],
})
export class FiltersModule {}
