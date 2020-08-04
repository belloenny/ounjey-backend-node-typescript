import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class MenuChoice extends Entity {
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
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'number',
  })
  choicePrice?: number;

  @property({
    type: 'boolean',
  })
  useCheckboxes?: boolean;

  @property({
    type: 'string',
  })
  menuOptionId?: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<MenuChoice>) {
    super(data);
  }
}

export interface MenuChoiceRelations {
  // describe navigational properties here
}

export type MenuChoiceWithRelations = MenuChoice & MenuChoiceRelations;
