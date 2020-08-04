import {Entity, hasMany, model, property} from '@loopback/repository';
import {MenuItem, MenuItemWithRelations} from './menu-item.model';

@model({settings: {strict: false}})
export class MenuCategory extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
  })
  catererId?: string;

  @hasMany(() => MenuItem, {keyTo: 'menuCategory'})
  menuItems: MenuItem[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<MenuCategory>) {
    super(data);
  }
}

export interface MenuCategoryRelations {
  // describe navigational properties here
  menuItems?: MenuItemWithRelations[];
}

export type MenuCategoryWithRelations = MenuCategory & MenuCategoryRelations;
