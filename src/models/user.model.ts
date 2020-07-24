import {Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {UserCredentials} from './user-credentials.model';
import {UserIdentity} from './user-identity.model';
import {Address} from './address.model';

@model({settings: {strict: false}})
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    mongodb: {dataType: 'ObjectId'},
  })
  id?: string;

  @property({
    type: 'string',
  })
  firstName?: string;

  @property({
    type: 'string',
  })
  lastName?: string;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'boolean',
  })
  emailVerified?: boolean;

  @property({
    type: 'string',
  })
  verificationToken?: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  roles?: string[];

  @hasOne(() => UserCredentials)
  userCredentials: UserCredentials;

  @hasMany(() => UserIdentity)
  profiles: UserIdentity[];

  @hasMany(() => Address, {keyTo: 'belongsTo'})
  addresses: Address[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
