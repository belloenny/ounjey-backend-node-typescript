import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoDatasource} from '../datasources';
import {MenuItem, MenuItemRelations, MenuOption} from '../models';
import {MenuOptionRepository} from './menu-option.repository';

export class MenuItemRepository extends DefaultCrudRepository<
  MenuItem,
  typeof MenuItem.prototype.id,
  MenuItemRelations
> {

  public readonly menuOptions: HasManyRepositoryFactory<MenuOption, typeof MenuItem.prototype.id>;

  constructor(
    @inject('datasources.MongoDatasource')
    dataSource: MongoDatasource, @repository.getter('MenuOptionRepository') protected menuOptionRepositoryGetter: Getter<MenuOptionRepository>,
  ) {
    super(MenuItem, dataSource);
    this.menuOptions = this.createHasManyRepositoryFactoryFor('menuOptions', menuOptionRepositoryGetter,);
    this.registerInclusionResolver('menuOptions', this.menuOptions.inclusionResolver);
  }
}
