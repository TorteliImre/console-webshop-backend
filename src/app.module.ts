import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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

@Module({
  imports: [
    DataSourceModule,
    UserModule,
    AuthModule,
    FiltersModule,
    AdvertModule,
    BookmarkModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
