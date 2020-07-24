import {authenticate} from '@loopback/authentication';
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
import {Address} from '../models';
import {UserRepository} from '../repositories';

export class UserAddressController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  @get('/users/addresses', {
    responses: {
      '200': {
        description: 'Array of User has many Address',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Address)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @inject(SecurityBindings.USER)
    user: UserProfile,
    @param.query.object('filter') filter?: Filter<Address>,
  ): Promise<Address[]> {
    return this.userRepository.addresses(user[securityId]).find(filter);
  }

  @post('/users/addresses', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Address)}},
      },
    },
  })
  async create(
    @inject(SecurityBindings.USER)
    user: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Address, {
            title: 'NewAddressInUser',
            exclude: ['id'],
            optional: ['belongsTo'],
          }),
        },
      },
    })
    address: Omit<Address, 'id'>,
  ): Promise<Address> {
    return this.userRepository.addresses(user[securityId]).create(address);
  }

  @patch('/users/addresses', {
    responses: {
      '200': {
        description: 'User.Address PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async patch(
    @inject(SecurityBindings.USER)
    user: UserProfile,
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
    return this.userRepository
      .addresses(user[securityId])
      .patch(address, where);
  }

  @del('/users/addresses', {
    responses: {
      '200': {
        description: 'User.Address DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async delete(
    @inject(SecurityBindings.USER)
    user: UserProfile,
    @param.query.object('where', getWhereSchemaFor(Address))
    where?: Where<Address>,
  ): Promise<Count> {
    return this.userRepository.addresses(user[securityId]).delete(where);
  }
}
