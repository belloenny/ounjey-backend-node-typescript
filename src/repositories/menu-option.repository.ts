import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {MongoDatasource} from '../datasources';
import {MenuChoice, MenuOption, MenuOptionRelations} from '../models';
import {MenuChoiceRepository} from './menu-choice.repository';

export class MenuOptionRepository extends DefaultCrudRepository<
  MenuOption,
  typeof MenuOption.prototype.id,
  MenuOptionRelations
> {
  public readonly menuChoices: HasManyRepositoryFactory<
    MenuChoice,
    typeof MenuOption.prototype.id
  >;

  constructor(
    @inject('datasources.MongoDatasource') dataSource: MongoDatasource,
    @repository.getter('MenuChoiceRepository')
    protected menuChoiceRepositoryGetter: Getter<MenuChoiceRepository>,
  ) {
    super(MenuOption, dataSource);
    this.menuChoices = this.createHasManyRepositoryFactoryFor(
      'menuChoices',
      menuChoiceRepositoryGetter,
    );
    this.registerInclusionResolver(
      'menuChoices',
      this.menuChoices.inclusionResolver,
    );
  }
}
