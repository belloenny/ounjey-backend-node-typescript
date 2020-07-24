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
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {MenuCategory} from '../models';
import {CatererProfileRepository} from '../repositories';

export class CatererProfileController {
  constructor(
    @repository(CatererProfileRepository)
    protected catererProfileRepository: CatererProfileRepository,
  ) {}

  @get('/caterer/{id}/menu-categories', {
    responses: {
      '200': {
        description: 'Array of CatererProfile has many MenuCategory',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(MenuCategory)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<MenuCategory>,
  ): Promise<MenuCategory[]> {
    return this.catererProfileRepository.menuCategories(id).find(filter);
  }

  @del('/caterer-profiles/menu-categories', {
    responses: {
      '200': {
        description: 'CatererProfile.MenuCategory DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @inject(SecurityBindings.USER) user: UserProfile,
    @param.query.object('where', getWhereSchemaFor(MenuCategory))
    where?: Where<MenuCategory>,
  ): Promise<Count> {
    return this.catererProfileRepository
      .menuCategories(user[securityId])
      .delete(where);
  }
}
