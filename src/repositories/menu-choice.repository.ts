import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDatasource} from '../datasources';
import {MenuChoice, MenuChoiceRelations} from '../models';

export class MenuChoiceRepository extends DefaultCrudRepository<
  MenuChoice,
  typeof MenuChoice.prototype.id,
  MenuChoiceRelations
> {
  constructor(
    @inject('datasources.MongoDatasource') dataSource: MongoDatasource,
  ) {
    super(MenuChoice, dataSource);
  }
}
