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
  post,
  put,
  requestBody,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {basicAuthorization} from '../authorizer/basic.authorizor';
import {UpdateMenu} from '../dtos';
import {MenuCategory} from '../models';
import {
  CatererProfileRepository,
  MenuCategoryRepository,
  MenuItemRepository,
} from '../repositories';

export class CatererProfileController {
  constructor(
    @repository(CatererProfileRepository)
    protected catererProfileRepository: CatererProfileRepository,
    @repository(MenuItemRepository)
    protected menuItemRepository: MenuItemRepository,
    @repository(MenuCategoryRepository)
    protected menuCategoryRepository: MenuCategoryRepository,
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
  @post('/caterer/menu-category', {
    responses: {
      '200': {
        description: 'CatererProfile model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(MenuCategory)},
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
          schema: getModelSchemaRef(MenuCategory, {
            title: 'NewMenuCategoryInCatererProfile',
            exclude: ['id', 'catererId'],
            optional: ['catererId'],
          }),
        },
      },
    })
    menuCategory: Omit<MenuCategory, 'id'>,
  ): Promise<MenuCategory> {
    return this.catererProfileRepository
      .menuCategories(user[securityId])
      .create(menuCategory);
  }
  @put('/caterer/{id}/menu-categories', {
    responses: {
      '200': {
        description: 'MenuOption model instance',
        content: {
          'application/json': {
            schema: CountSchema,
          },
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['caterer'], voters: [basicAuthorization]})
  async update(
    @param.path.string('id') menuId: typeof MenuCategory.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UpdateMenu, {
            title: 'IdsForMenuItems',
          }),
        },
      },
    })
    ids: UpdateMenu,
  ): Promise<{message: string}> {
    await Promise.all(
      ids.menuItems!.map(id => {
        return this.menuItemRepository.updateById(id, {
          menuCategory: menuId,
        });
      }),
    );
    return {
      message: 'done',
    };
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
