import { Product, ProductStats } from './Product.entity';
import { Store, StoreStats } from './Store.entity';
import { SupplierStats } from './Supplier.entity';
import { UserStats } from './User.entity';

export class Dashboard {
  stats: {
    store?: StoreStats;
    user?: UserStats;
    supplier?: SupplierStats;
    product?: ProductStats;
  };
  tableData: (Store | Product)[];
}
