import {
  authenticate,
  TokenService,
  UserService,
} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  post,
  requestBody,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {
  PasswordHasher,
  PasswordHasherBindings,
  TokenServiceBindings,
  UserServiceBindings,
} from '../components/jwt-authentication';
import {NewCatererRequest} from '../dtos';
import {CatererProfile, User} from '../models';
import {
  UserCredentialsRepository,
  UserIdentityRepository,
  UserRepository,
} from '../repositories';
import {CatererProfileRepository} from '../repositories/caterer-profile.repository';

export class CatererLoginController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialsRepository)
    public userCredentialsRepository: UserCredentialsRepository,
    @repository(CatererProfileRepository)
    public catererProfileRepository: CatererProfileRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @repository(UserIdentityRepository)
    public userIdentityRepository: UserIdentityRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, NewCatererRequest>,
  ) {}

  @post('/caterer/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewCatererRequest, {
            title: 'NewCatererRquest',
          }),
        },
      },
    })
    newCatererRequest: NewCatererRequest,
  ): Promise<{token: string; user: User} | HttpErrors.HttpError> {
    const users = await this.userRepository.find({
      where: {
        email: newCatererRequest.businessEmail,
      },
    });

    if (!users || !users.length) {
      const user = await this.userRepository.create({
        email: newCatererRequest.businessEmail,
        username: newCatererRequest.businessEmail,
        firstName: newCatererRequest.firstName,
        lastName: newCatererRequest.lastName,
        roles: ['caterer'],
      });

      await this.userCredentialsRepository.create({
        password: await this.passwordHasher.hashPassword(
          newCatererRequest.password,
        ),
        userId: user.id,
      });

      await this.catererProfileRepository.create({
        id: user.id,
        businessName: newCatererRequest.businessName,
        businessEmail: newCatererRequest.businessEmail,
      });
      const profile = this.userService.convertToUserProfile(user);
      const token = await this.jwtService.generateToken(profile);
      return {token, user};
    } else {
      throw new HttpErrors.NotAcceptable('User exists');
    }
  }

  @get('/caterer/profile', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': CatererProfile,
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(@inject(SecurityBindings.USER) user: UserProfile) {
    return this.catererProfileRepository.findById(user[securityId]);
  }
}
