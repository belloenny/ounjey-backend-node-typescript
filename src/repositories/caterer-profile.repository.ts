import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {MongoDatasource} from '../datasources';
import {
  Address,
  CatererProfile,
  CatererProfileRelations,
  MenuCategory,
  MenuItem,
} from '../models';
import {AddressRepository} from './address.repository';
import {MenuCategoryRepository} from './menu-category.repository';
import {MenuItemRepository} from './menu-item.repository';

export class CatererProfileRepository extends DefaultCrudRepository<
  CatererProfile,
  typeof CatererProfile.prototype.id,
  CatererProfileRelations
> {
  public readonly menuCategories: HasManyRepositoryFactory<
    MenuCategory,
    typeof CatererProfile.prototype.id
  >;

  public readonly addresses: HasManyRepositoryFactory<
    Address,
    typeof CatererProfile.prototype.id
  >;

  public readonly menuItems: HasManyRepositoryFactory<
    MenuItem,
    typeof CatererProfile.prototype.id
  >;

  constructor(
    @inject('datasources.MongoDatasource')
    dataSource: MongoDatasource,
    @repository.getter('MenuCategoryRepository')
    protected menuCategoryRepositoryGetter: Getter<MenuCategoryRepository>,
    @repository.getter('AddressRepository')
    protected addressRepositoryGetter: Getter<AddressRepository>,
    @repository.getter('MenuItemRepository')
    protected menuItemRepositoryGetter: Getter<MenuItemRepository>,
  ) {
    super(CatererProfile, dataSource);
    this.menuItems = this.createHasManyRepositoryFactoryFor(
      'menuItems',
      menuItemRepositoryGetter,
    );
    this.registerInclusionResolver(
      'menuItems',
      this.menuItems.inclusionResolver,
    );
    this.addresses = this.createHasManyRepositoryFactoryFor(
      'addresses',
      addressRepositoryGetter,
    );
    this.menuCategories = this.createHasManyRepositoryFactoryFor(
      'menuCategories',
      menuCategoryRepositoryGetter,
    );
    this.registerInclusionResolver(
      'menuCategories',
      this.menuCategories.inclusionResolver,
    );
    this.registerInclusionResolver(
      'addresses',
      this.addresses.inclusionResolver,
    );
  }
}
