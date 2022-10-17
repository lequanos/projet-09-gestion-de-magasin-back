import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from './mikro-orm.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

import { SupplierController } from './modules/supplier/supplier.controller';
import { SupplierModule } from './modules/supplier/supplier.module';
import { StoreController } from './modules/store/store.controller';
import { StoreModule } from './modules/store/store.module';
import { UserController } from './modules/user/user.controller';
import { UserModule } from './modules/user/user.module';
import { MailController } from './modules/mail/mail.controller';
import { MailModule } from './modules/mail/mail.module';
import { AuthModule } from './modules/auth/auth.module';
import { appendFile } from 'fs';
import { BrandModule } from './modules/brand/brand.module';
import { BrandController } from './modules/brand/brand.controller';
import { AuthController } from './modules/auth/auth.controller';
import { AccessTokenGuard } from './utils/guards/access-token.guard';
import { RolesGuard } from './utils/guards/roles.guard';
import { ProductController } from './modules/product/product.controller';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(config),
    SupplierModule,
    StoreModule,
    BrandModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    MailModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'in-v3.mailjet.com',
          secure: false,
          port: 587,
          ignoreTLS: true,
          auth: {
            user: configService.get<string>('MAILJET_API_KEY'),
            pass: configService.get<string>('MAILJET_SECRET_KEY'),
          },
        },
        defaults: {
          from: '"Retail Store" <noreplyretailstore@gmail.com>',
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new EjsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    ProductModule,
  ],
  controllers: [
    StoreController,
    SupplierController,
    UserController,
    BrandController,
    MailController,
    AuthController,
    ProductController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
