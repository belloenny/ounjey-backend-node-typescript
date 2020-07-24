import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {basicAuthorization} from '../authorizer/basic.authorizor';
import {Address} from '../models';
import {CatererProfileRepository} from '../repositories';
import {AddressRepository} from '../repositories/address.repository';

export class CatererProfileAddressController {
  constructor(
    @repository(CatererProfileRepository)
    protected catererProfileRepository: CatererProfileRepository,
    @repository(AddressRepository)
    protected addressRepository: AddressRepository,
  ) {}

  @get('/caterer/addresses', {
    responses: {
      '200': {
        description: 'Array of CatererProfile has many Address',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Address)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['caterer'], voters: [basicAuthorization]})
  async find(
    @inject(SecurityBindings.USER) user: UserProfile,
    @param.query.object('filter') filter?: Filter<Address>,
  ): Promise<Address[]> {
    return this.catererProfileRepository
      .addresses(user[securityId])
      .find(filter);
  }

  @post('/caterer/addresses', {
    responses: {
      '200': {
        description: 'CatererProfile model instance',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Address)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['caterer'], voters: [basicAuthorization]})
  async create(
    @inject(SecurityBindings.USER) user: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(Address, {
              title: 'NewAddressInCatererProfile',
              exclude: ['id'],
              optional: ['belongsTo'],
            }),
          },
        },
      },
    })
    addresses: Omit<Address[], 'id'>,
  ): Promise<Address[]> {
    return Promise.all(
      addresses.map(async address => {
        return this.catererProfileRepository
          .addresses(user[securityId])
          .create(address);
      }),
    );
  }

  @patch('/caterer/addresses', {
    responses: {
      '200': {
        description: 'CatererProfile.Address PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['caterer'], voters: [basicAuthorization]})
  async patch(
    @inject(SecurityBindings.USER) user: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Address, {partial: true}),
        },
      },
    })
    address: Partial<Address>,
    @param.query.object('where', getWhereSchemaFor(Address))
    where?: Where<Address>,
  ): Promise<Count> {
    return this.catererProfileRepository
      .addresses(user[securityId])
      .patch(address, where);
  }

  @del('/caterer/addresses', {
    responses: {
      '200': {
        description: 'CatererProfile.Address DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['caterer'], voters: [basicAuthorization]})
  async delete(
    @inject(SecurityBindings.USER) user: UserProfile,
    @param.query.object('where', getWhereSchemaFor(Address))
    where?: Where<Address>,
  ): Promise<Count> {
    return this.catererProfileRepository
      .addresses(user[securityId])
      .delete(where);
  }
}
