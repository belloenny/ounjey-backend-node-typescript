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
import {MenuChoice, MenuOption} from '../models';
import {MenuOptionRepository} from '../repositories';

export class MenuOptionMenuChoiceController {
  constructor(
    @repository(MenuOptionRepository)
    protected menuOptionRepository: MenuOptionRepository,
  ) {}

  @get('/menu-options/{id}/menu-choices', {
    responses: {
      '200': {
        description: 'Array of MenuOption has many MenuChoice',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(MenuChoice)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<MenuChoice>,
  ): Promise<MenuChoice[]> {
    return this.menuOptionRepository.menuChoices(id).find(filter);
  }

  @post('/menu-options/{id}/menu-choices', {
    responses: {
      '200': {
        description: 'MenuOption model instance',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(MenuChoice)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['caterer'], voters: [basicAuthorization]})
  async create(
    @param.path.string('id') id: typeof MenuOption.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(MenuChoice, {
              title: 'NewMenuChoiceInMenuOption',
              exclude: ['id'],
              optional: ['menuOptionId'],
            }),
          },
        },
      },
    })
    menuChoices: Omit<MenuChoice[], 'id'>,
  ): Promise<MenuChoice[]> {
    return Promise.all(
      menuChoices.map(async menuChoice => {
        return this.menuOptionRepository.menuChoices(id).create(menuChoice);
      }),
    );
  }

  @patch('/menu-options/{id}/menu-choices', {
    responses: {
      '200': {
        description: 'MenuOption.MenuChoice PATCH success count',
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
          schema: getModelSchemaRef(MenuChoice, {partial: true}),
        },
      },
    })
    menuChoice: Partial<MenuChoice>,
    @param.query.object('where', getWhereSchemaFor(MenuChoice))
    where?: Where<MenuChoice>,
  ): Promise<Count> {
    return this.menuOptionRepository.menuChoices(id).patch(menuChoice, where);
  }

  @del('/menu-options/{id}/menu-choices', {
    responses: {
      '200': {
        description: 'MenuOption.MenuChoice DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['caterer'], voters: [basicAuthorization]})
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(MenuChoice))
    where?: Where<MenuChoice>,
  ): Promise<Count> {
    return this.menuOptionRepository.menuChoices(id).delete(where);
  }
}
