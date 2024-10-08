import { Module } from '@nestjs/common';
import { FiltersService } from './filters.service';
import { FiltersController } from './filters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from 'entities/Location';
import { Manufacturers } from 'entities/Manufacturers';
import { ProductStates } from 'entities/ProductStates';

@Module({
  imports: [TypeOrmModule.forFeature([Location, Manufacturers, ProductStates])],
  providers: [FiltersService],
  controllers: [FiltersController],
  exports: [FiltersService],
})
export class FiltersModule {}
