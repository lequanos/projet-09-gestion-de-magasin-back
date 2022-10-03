import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from './mikro-orm.config';
import { ConfigModule } from '@nestjs/config';
import { StoreController } from './modules/store/store.controller';
import { StoreModule } from './modules/store/store.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(config),
    StoreModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [StoreController],
  providers: [],
})
export class AppModule {}
