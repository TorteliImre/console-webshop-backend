import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { FiltersModule } from './filters/filters.module';
import { FiltersController } from './filters/filters.controller';
import { FiltersService } from './filters/filters.service';
import { AdvertModule } from './advert/advert.module';
import { AppLoggerMiddleware } from './logger/logger';
import { DataSourceModule } from './datasource/datasource.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { CartModule } from './cart/cart.module';
import { ConfigModule } from '@nestjs/config';
import { SuggestionsModule } from './suggestions/suggestions.module';
import { RatingModule } from './rating/rating.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DataSourceModule,
    UserModule,
    AuthModule,
    FiltersModule,
    AdvertModule,
    BookmarkModule,
    CartModule,
    SuggestionsModule,
    RatingModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
