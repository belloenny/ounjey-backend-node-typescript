import {
  authenticate,
  TokenService,
  UserService,
} from '@loopback/authentication';
import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  post,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {
  PasswordHasher,
  PasswordHasherBindings,
  TokenServiceBindings,
  UserServiceBindings,
} from '../components/jwt-authentication';
import {NewUserRequest, UserLogin} from '../dtos';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {UserCredentialsRepository} from '../repositories/user-credentials.repository';
import {UserIdentityRepository} from '../repositories/user-identity.repository';

export class UserLoginController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialsRepository)
    public userCredentialsRepository: UserCredentialsRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @repository(UserIdentityRepository)
    public userIdentityRepository: UserIdentityRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, UserLogin>,
  ) {}

  @post('/signup')
  async signup(
    @requestBody({
      description: 'signup user locally',
      required: true,
      content: {
        'application/json': {schema: getModelSchemaRef(NewUserRequest)},
      },
    })
    credentials: NewUserRequest,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<{token: string; user: User} | HttpErrors.HttpError> {
    const users = await this.userRepository.find({
      where: {
        email: credentials.email,
      },
    });
    if (!users || !users.length) {
      const user = await this.userRepository.create({
        email: credentials.email,
        username: credentials.email,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        roles: ['customer'],
      });
      await this.userCredentialsRepository.create({
        password: await this.passwordHasher.hashPassword(credentials.password),
        userId: user.id,
      });
      const profile = this.userService.convertToUserProfile(user);
      const token = await this.jwtService.generateToken(profile);

      return {token, user};
    } else {
      /**
       * The express app that routed the /signup call to LB App, will handle the error event.
       */
      throw new HttpErrors.NotAcceptable('User exists');
    }
  }

  @post('/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody({
      description: 'login to create a user session',
      required: true,
      content: {
        'application/json': {schema: getModelSchemaRef(UserLogin)},
      },
    })
    credentials: UserLogin,
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);
    const profile = this.userService.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(profile);
    return {token};
  }

  @authenticate('session')
  @get('/users/me')
  async getCurrentUser(
    @inject(SecurityBindings.USER)
    user: UserProfile,
  ) {
    return user;
  }
}
