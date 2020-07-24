import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDatasource} from '../datasources';
import {UserIdentity, UserIdentityRelations} from '../models';

export class UserIdentityRepository extends DefaultCrudRepository<
  UserIdentity,
  typeof UserIdentity.prototype.id,
  UserIdentityRelations
> {
  constructor(
    @inject('datasources.MongoDatasource') dataSource: MongoDatasource,
  ) {
    super(UserIdentity, dataSource);
  }
}
