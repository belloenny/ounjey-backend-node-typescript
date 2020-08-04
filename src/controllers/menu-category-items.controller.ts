import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
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
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {basicAuthorization} from '../authorizer/basic.authorizor';
import {MenuCategory, MenuItem} from '../models';
import {MenuCategoryRepository} from '../repositories';

export class MenuCategoryItemsController {
  constructor(
    @repository(MenuCategoryRepository)
    public menuCategoryRepository: MenuCategoryRepository,
  ) {}

  @get('/menu-categories/{id}/menu-items', {
    responses: {
      '200': {
        description: 'Array of MenuItem For A Menu Category',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(MenuItem, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.filter(MenuItem) filter?: Filter<MenuItem>,
  ): Promise<MenuItem[]> {
    return this.menuCategoryRepository.menuItems(id).find(filter);
  }

  @post('/menu-categories/{id}/menu-items', {
    responses: {
      '200': {
        description: 'MenuOption model instance',
        content: {'application/json': {schema: getModelSchemaRef(MenuItem)}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['caterer'], voters: [basicAuthorization]})
  async create(
    @param.path.string('id') id: typeof MenuItem.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MenuItem, {
            title: 'New Menu Item',
            exclude: ['id'],
            optional: ['menuCategory'],
          }),
        },
      },
    })
    menuItem: Omit<MenuItem, 'id'>,
  ): Promise<MenuItem> {
    return this.menuCategoryRepository.menuItems(id).create(menuItem);
  }

  @patch('/menu-categories/{id}/menu-items', {
    responses: {
      '200': {
        description: 'MenuCategory PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['caterer'], voters: [basicAuthorization]})
  async updateAll(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MenuCategory, {partial: true}),
        },
      },
    })
    menuItem: MenuItem,
    @param.where(MenuItem) where?: Where<MenuItem>,
  ): Promise<Count> {
    return this.menuCategoryRepository.menuItems(id).patch(menuItem, where);
  }

  @del('/menu-categories/{id}/menu-items', {
    responses: {
      '204': {
        description: 'MenuCategory DELETE success',
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['caterer'], voters: [basicAuthorization]})
  async deleteById(
    @param.path.string('id') id: string,
    @param.where(MenuItem) where?: Where<MenuItem>,
  ): Promise<void> {
    await this.menuCategoryRepository.menuItems(id).delete(where);
  }
}
