import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class MenuOption extends Entity {
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
