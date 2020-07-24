import {Model, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class NewCatererRequest extends Model {
  @property({
    type: 'string',
    required: true,
  })
  businessEmail: string;

  @property({
    type: 'string',
    required: true,
  })
  businessPhone: string;

  @property({
    type: 'string',
    required: true,
  })
  businessName: string;

  @property({
    type: 'string',
  })
  lastName?: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
  })
  firstName?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<NewCatererRequest>) {
    super(data);
  }
}

export interface NewCatererRequestRelations {
  // describe navigational properties here
}

export type NewCatererRequestWithRelations = NewCatererRequest &
  NewCatererRequestRelations;
