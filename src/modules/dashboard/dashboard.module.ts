import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Logger, Module } from '@nestjs/common';
import {
  Supplier,
  Product,
  User,
  Store,
  Brand,
  Stock,
  Aisle,
  Category,
  Role,
} from 'src/entities';
import { ProductService } from '../product/product.service';
import { StoreService } from '../store/store.service';
import { SupplierService } from '../supplier/supplier.service';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Supplier,
      Product,
      User,
      Store,
      Brand,
      Stock,
      Aisle,
      Category,
      Role,
    ]),
  ],
  providers: [
    DashboardService,
    ProductService,
    UserService,
    SupplierService,
    StoreService,
    MailService,
    Logger,
  ],
  controllers: [DashboardController],
  exports: [DashboardService],
})
export class DashboardModule {}
