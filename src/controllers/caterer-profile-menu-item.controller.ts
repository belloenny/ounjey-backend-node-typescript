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
import {MenuItem} from '../models';
import {CatererProfileRepository} from '../repositories';

export class CatererProfileMenuItemController {
  constructor(
    @repository(CatererProfileRepository)
    protected catererProfileRepository: CatererProfileRepository,
  ) {}

  @get('/caterer-profiles/{id}/menu-items', {
    responses: {
      '200': {
        description: 'Array of CatererProfile has many MenuItem',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(MenuItem)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<MenuItem>,
  ): Promise<MenuItem[]> {
    return this.catererProfileRepository.menuItems(id).find(filter);
  }

  @post('/caterer-profiles/menu-items', {
    responses: {
      '200': {
        description: 'CatererProfile model instance',
        content: {'application/json': {schema: getModelSchemaRef(MenuItem)}},
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
          schema: getModelSchemaRef(MenuItem, {
            title: 'NewMenuItemInCatererProfile',
            exclude: ['id', 'belongsTo'],
            optional: ['belongsTo'],
          }),
        },
      },
    })
    menuItem: Omit<MenuItem, 'id'>,
  ): Promise<MenuItem> {
    return this.catererProfileRepository
      .menuItems(user[securityId])
      .create(menuItem);
  }

  @patch('/caterer-profiles/menu-items', {
    responses: {
      '200': {
        description: 'CatererProfile.MenuItem PATCH success count',
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
          schema: getModelSchemaRef(MenuItem, {partial: true}),
        },
      },
    })
    menuItem: Partial<MenuItem>,
    @param.query.object('where', getWhereSchemaFor(MenuItem))
    where?: Where<MenuItem>,
  ): Promise<Count> {
    return this.catererProfileRepository
      .menuItems(user[securityId])
      .patch(menuItem, where);
  }

  @del('/caterer-profiles/menu-items', {
    responses: {
      '200': {
        description: 'CatererProfile.MenuItem DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['caterer'], voters: [basicAuthorization]})
  async delete(
    @inject(SecurityBindings.USER) user: UserProfile,
    @param.query.object('where', getWhereSchemaFor(MenuItem))
    where?: Where<MenuItem>,
  ): Promise<Count> {
    return this.catererProfileRepository
      .menuItems(user[securityId])
      .delete(where);
  }
}
