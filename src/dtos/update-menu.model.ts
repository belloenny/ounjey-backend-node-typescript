import {Model, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class UpdateMenu extends Model {
  @property({
    type: 'array',
    itemType: 'string',
  })
  menuItems?: string[];

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<UpdateMenu>) {
    super(data);
  }
}

export interface UpdateMenuRelations {
  // describe navigational properties here
}

export type UpdateMenuWithRelations = UpdateMenu & UpdateMenuRelations;
