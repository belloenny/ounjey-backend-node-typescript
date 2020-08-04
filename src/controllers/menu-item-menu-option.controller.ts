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
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {basicAuthorization} from '../authorizer/basic.authorizor';
import {MenuItem, MenuOption} from '../models';
import {MenuItemRepository} from '../repositories';

export class MenuItemMenuOptionController {
  constructor(
    @repository(MenuItemRepository)
    protected menuItemRepository: MenuItemRepository,
  ) {}

  @get('/menu-items/{id}/menu-options', {
    responses: {
      '200': {
        description: 'Array of MenuItem has many MenuOption',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(MenuOption)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<MenuOption>,
  ): Promise<MenuOption[]> {
    return this.menuItemRepository.menuOptions(id).find(filter);
  }

  @post('/menu-items/{id}/menu-options', {
    responses: {
      '200': {
        description: 'MenuItem model instance',
        content: {'application/json': {schema: getModelSchemaRef(MenuOption)}},
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
          schema: getModelSchemaRef(MenuOption, {
            title: 'NewMenuOptionInMenuItem',
            exclude: ['id'],
            optional: ['menuItemId'],
          }),
        },
      },
    })
    menuOption: Omit<MenuOption, 'id'>,
  ): Promise<MenuOption> {
    return this.menuItemRepository.menuOptions(id).create(menuOption);
  }

  @patch('/menu-items/{id}/menu-options', {
    responses: {
      '200': {
        description: 'MenuItem.MenuOption PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['caterer'], voters: [basicAuthorization]})
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MenuOption, {partial: true}),
        },
      },
    })
    menuOption: Partial<MenuOption>,
    @param.query.object('where', getWhereSchemaFor(MenuOption))
    where?: Where<MenuOption>,
  ): Promise<Count> {
    return this.menuItemRepository.menuOptions(id).patch(menuOption, where);
  }

  @del('/menu-items/{id}/menu-options', {
    responses: {
      '200': {
        description: 'MenuItem.MenuOption DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['caterer'], voters: [basicAuthorization]})
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(MenuOption))
    where?: Where<MenuOption>,
  ): Promise<Count> {
    return this.menuItemRepository.menuOptions(id).delete(where);
  }
}
