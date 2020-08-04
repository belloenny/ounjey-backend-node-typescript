import {Entity, model, property, hasMany} from '@loopback/repository';
import {MenuChoice} from './menu-choice.model';

@model({settings: {strict: false}})
export class MenuOption extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;
  @property({
    type: 'number',
    required: true,
  })
  minimumChoice: number;

  @property({
    type: 'number',
    required: true,
  })
  maximumChoice: number;

  @property({
    type: 'string',
  })
  messages?: string;

  @property({
    type: 'string',
  })
  menuItemId?: string;

  @hasMany(() => MenuChoice)
  menuChoices: MenuChoice[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<MenuOption>) {
    super(data);
  }
}

export interface MenuOptionRelations {
  // describe navigational properties here
}

export type MenuOptionWithRelations = MenuOption & MenuOptionRelations;
