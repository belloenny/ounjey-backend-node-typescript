import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDatasource} from '../datasources';
import {MenuItem, MenuItemRelations} from '../models';

export class MenuItemRepository extends DefaultCrudRepository<
  MenuItem,
  typeof MenuItem.prototype.id,
  MenuItemRelations
> {
  constructor(
    @inject('datasources.MongoDatasource')
    dataSource: MongoDatasource,
  ) {
    super(MenuItem, dataSource);
  }
}
