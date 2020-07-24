import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  HasOneRepositoryFactory,
  repository,
} from '@loopback/repository';
import {MongoDatasource} from '../datasources';
import {
  Address,
  User,
  UserCredentials,
  UserIdentity,
  UserRelations,
} from '../models';
import {AddressRepository} from './address.repository';
import {UserCredentialsRepository} from './user-credentials.repository';
import {UserIdentityRepository} from './user-identity.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  public readonly userCredentials: HasOneRepositoryFactory<
    UserCredentials,
    typeof User.prototype.id
  >;

  public readonly profiles: HasManyRepositoryFactory<
    UserIdentity,
    typeof User.prototype.id
  >;

  public readonly addresses: HasManyRepositoryFactory<
    Address,
    typeof User.prototype.id
  >;

  constructor(
    @inject('datasources.MongoDatasource')
    dataSource: MongoDatasource,
    @repository.getter('UserCredentialsRepository')
    protected userCredentialsRepositoryGetter: Getter<
      UserCredentialsRepository
    >,
    @repository.getter('UserIdentityRepository')
    protected userIdentityRepositoryGetter: Getter<UserIdentityRepository>,
    @repository.getter('AddressRepository')
    protected addressRepositoryGetter: Getter<AddressRepository>,
  ) {
    super(User, dataSource);
    this.addresses = this.createHasManyRepositoryFactoryFor(
      'addresses',
      addressRepositoryGetter,
    );
    this.profiles = this.createHasManyRepositoryFactoryFor(
      'profiles',
      userIdentityRepositoryGetter,
    );
    this.registerInclusionResolver('profiles', this.profiles.inclusionResolver);
    this.userCredentials = this.createHasOneRepositoryFactoryFor(
      'userCredentials',
      userCredentialsRepositoryGetter,
    );
    this.registerInclusionResolver(
      'userCredentials',
      this.userCredentials.inclusionResolver,
    );
  }
  async findCredentials(
    userId: typeof User.prototype.id,
  ): Promise<UserCredentials | undefined> {
    try {
      return await this.userCredentials(userId).get();
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined;
      }
      throw err;
    }
  }
}
