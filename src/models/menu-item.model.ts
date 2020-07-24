import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class MenuItem extends Entity {
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
    required: true,
  })
  description: string;

  @property({
    type: 'boolean',
  })
  vegetarianOption?: boolean;

  @property({
    type: 'number',
    required: true,
  })
  minimumQuantity: number;

  @property({
    type: 'number',
  })
  maximumQuantity?: number;

  @property({
    type: 'string',
  })
  menuCategory?: string;

  @property({
    type: 'string',
  })
  belongsTo?: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<MenuItem>) {
    super(data);
  }
}

export interface MenuItemRelations {
  // describe navigational properties here
}

export type MenuItemWithRelations = MenuItem & MenuItemRelations;
