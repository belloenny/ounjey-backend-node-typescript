import {Entity, model, property, hasMany} from '@loopback/repository';
import {MenuCategory} from './menu-category.model';
import {Address} from './address.model';
import {MenuItem} from './menu-item.model';

@model({settings: {strict: false}})
export class CatererProfile extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  businessName: string;

  @property({
    type: 'string',
    required: true,
  })
  businessEmail: string;

  @property({
    type: 'string',
  })
  businessPhone?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  isApproved?: boolean;

  @hasMany(() => MenuCategory, {keyTo: 'catererId'})
  menuCategories: MenuCategory[];

  @hasMany(() => Address, {keyTo: 'belongsTo'})
  addresses: Address[];

  @hasMany(() => MenuItem, {keyTo: 'belongsTo'})
  menuItems: MenuItem[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<CatererProfile>) {
    super(data);
  }
}

export interface CatererProfileRelations {
  // describe navigational properties here
}

export type CatererProfileWithRelations = CatererProfile & CatererProfileRelations;
