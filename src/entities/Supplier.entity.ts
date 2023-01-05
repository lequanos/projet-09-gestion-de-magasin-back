import {
  Collection,
  Entity,
  Filter,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Property,
  TextType,
} from '@mikro-orm/core';
import {
  SireneV3Response,
  AdresseEtablissement,
} from '../responseModels/sireneV3';
import { isSireneV3Response } from '../utils/typeguards/StoreTypeGuards';
import { CustomBaseEntity, Product, ProductSupplier, Store, User } from './';
@Entity()
@Filter({
  name: 'fromStore',
  cond: ({ user }: { user: Partial<User> }) => ({ store: user.store }),
})
export class Supplier extends CustomBaseEntity {
  constructor(supplier?: SireneV3Response | Partial<Supplier>) {
    super();
    if (supplier && isSireneV3Response(supplier)) {
      const {
        etablissement: { siren, siret, uniteLegale, adresseEtablissement },
      } = supplier;

      const addressArray: (string | null)[] = [];

      Object.keys(adresseEtablissement).forEach(
        (key: keyof AdresseEtablissement) => {
          if (
            adresseEtablissement[key] &&
            ![
              'codePostalEtablissement',
              'libelleCommuneEtablissement',
            ].includes(key) &&
            [
              'complementAdresseEtablissement',
              'numeroVoieEtablissement',
              'indiceRepetitionEtablissement',
              'typeVoieEtablissement',
              'libelleVoieEtablissement',
            ].includes(key)
          )
            addressArray.push(adresseEtablissement[key]);
        },
      );

      this.name = uniteLegale.denominationUniteLegale;
      this.address = addressArray.join(' ');
      this.postcode = adresseEtablissement.codePostalEtablissement || '';
      this.city = adresseEtablissement.libelleCommuneEtablissement || '';
      this.siren = siren || '';
      this.siret = siret || '';
    }
  }
  @Property({ type: 'string', nullable: false, length: 64 })
  name: string;

  @Property({ type: 'string', nullable: false, length: 10 })
  phoneNumber: string;

  @Property({ type: TextType, nullable: false, length: 150 })
  address: string;

  @Property({ type: 'string', nullable: false, length: 5 })
  postcode: string;

  @Property({ type: 'string', nullable: false, length: 64 })
  city: string;

  @Property({ type: 'string', nullable: false, length: 9 })
  siren: string;

  @Property({ type: 'string', nullable: true, length: 14 })
  siret: string;

  @Property({ type: 'string', nullable: true, length: 64 })
  contact: string;

  @Property({ type: 'boolean', nullable: false })
  isActive: boolean;

  @Property({ type: 'string', nullable: true, default: 'pictureStore' })
  pictureUrl: string;

  @ManyToMany({
    entity: () => Product,
    pivotEntity: () => ProductSupplier,
    mappedBy: 'suppliers',
  })
  products = new Collection<Product>(this);

  @ManyToOne({ entity: () => Store, onDelete: 'cascade' })
  store: Store;

  @OneToMany(
    () => ProductSupplier,
    (productSupplier) => productSupplier.supplier,
  )
  productSuppliers = new Collection<ProductSupplier>(this);
}

@Entity({
  expression: `
  SELECT
    (SELECT COUNT(*) FROM supplier WHERE is_active = true)::INT AS active_suppliers_count,
    (SELECT COUNT(*) FROM supplier)::INT AS suppliers_count,
    (
      COALESCE((
        (SELECT COUNT(*) FROM supplier WHERE is_active = true) - (SELECT COUNT(*) FROM supplier WHERE is_active = true AND supplier.created_at <= NOW() - INTERVAL '7 DAYS')
      )::FLOAT * 100
      / NULLIF((SELECT COUNT(*) FROM supplier WHERE is_active = true AND supplier.created_at <= NOW() - INTERVAL '7 DAYS'), 0), 0)
    ) as progression
  `,
})
export class SupplierStats {
  @Property({ type: 'number', nullable: false })
  activeSuppliersCount: number;

  @Property({ type: 'number', nullable: false })
  suppliersCount: number;

  @Property({ type: 'number', nullable: false })
  progression: number;
}
