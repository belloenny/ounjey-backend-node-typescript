import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {MongoDatasource} from '../datasources';
import {MenuCategory, MenuCategoryRelations, MenuItem} from '../models';
import {MenuItemRepository} from './menu-item.repository';

export class MenuCategoryRepository extends DefaultCrudRepository<
  MenuCategory,
  typeof MenuCategory.prototype.id,
  MenuCategoryRelations
> {
  public readonly menuItems: HasManyRepositoryFactory<
    MenuItem,
    typeof MenuCategory.prototype.id
  >;

  constructor(
    @inject('datasources.MongoDatasource')
    dataSource: MongoDatasource,
    @repository.getter('MenuItemRepository')
    protected menuItemRepositoryGetter: Getter<MenuItemRepository>,
  ) {
    super(MenuCategory, dataSource);
    this.menuItems = this.createHasManyRepositoryFactoryFor(
      'menuItems',
      menuItemRepositoryGetter,
    );
    this.registerInclusionResolver(
      'menuItems',
      this.menuItems.inclusionResolver,
    );
  }
}
