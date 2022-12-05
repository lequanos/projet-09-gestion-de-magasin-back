import { Injectable, Logger } from '@nestjs/common';
import { User, Dashboard } from 'src/entities';
import { ProductService } from '../product/product.service';
import { StoreService } from '../store/store.service';
import { SupplierService } from '../supplier/supplier.service';
import { UserService } from '../user/user.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly logger: Logger = new Logger('DashboardService'),
    private readonly productService: ProductService,
    private readonly storeService: StoreService,
    private readonly supplierService: SupplierService,
    private readonly userService: UserService,
  ) {}

  async getInfos(user: User): Promise<Dashboard> {
    const infos: Dashboard = {
      stats: {},
      tableData: [],
    };

    const serviceDictionary = {
      user: this.userService,
      store: this.storeService,
      supplier: this.supplierService,
      product: this.productService,
    };

    const userReadPermissionsEntity = user.role.permissions
      .map((perm) =>
        perm.includes('READ')
          ? perm.split('_')[1].toLocaleLowerCase()
          : undefined,
      )
      .filter(
        (value) =>
          !!value && [...Object.keys(serviceDictionary), 'all'].includes(value),
      );

    if (userReadPermissionsEntity.includes('all')) {
      const [store, user, supplier, product] = await Promise.all([
        this.storeService.getStats(),
        this.userService.getStats(),
        this.supplierService.getStats(),
        this.productService.getStats(),
      ]);
      infos.stats = {
        store,
        user,
        supplier,
        product,
      };

      infos.tableData = await this.storeService.getAll([
        'id',
        'name',
        'city',
        'siret',
        'movement',
      ]);
    } else {
      const mappedEntityStats = await Promise.all(
        userReadPermissionsEntity.map(
          async (entity: 'user' | 'product' | 'supplier' | 'store') => ({
            [entity]: await serviceDictionary[entity].getStats(),
          }),
        ),
      );

      mappedEntityStats.forEach((mappedEntity) => {
        infos.stats = {
          ...infos.stats,
          ...mappedEntity,
        };
      });

      infos.tableData = await this.productService.getAll(user, [
        'id',
        'name',
        'code',
        'sales',
      ]);
    }

    return infos;
  }
}
