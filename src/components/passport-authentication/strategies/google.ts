import {
  AuthenticationStrategy,
  UserIdentityService,
} from '@loopback/authentication';
import {StrategyAdapter} from '@loopback/authentication-passport';
import {bind, inject} from '@loopback/context';
import {extensionFor} from '@loopback/core';
import {RedirectRoute, Request, RestBindings} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {Profile} from 'passport';
import {Strategy, StrategyOptions} from 'passport-google-oauth2';
import {User} from '../../../models';
import {UserServiceBindings} from '../keys';
import {
  mapProfile,
  PassportAuthenticationBindings,
  verifyFunctionFactory,
} from './types';

@bind(extensionFor(PassportAuthenticationBindings.OAUTH2_STRATEGY))
export class GoogleOauth2Authorization implements AuthenticationStrategy {
  name = 'oauth2-google';
  passportstrategy: Strategy;
  protected strategy: StrategyAdapter<User>;

  /**
   * create an oauth2 strategy for google
   */
  constructor(
    @inject(UserServiceBindings.PASSPORT_USER_IDENTITY_SERVICE)
    public userService: UserIdentityService<Profile, User>,
    @inject('googleOAuth2Options')
    public googleOptions: StrategyOptions,
    @inject(RestBindings.Http.REQUEST) request: Request,
  ) {
    this.passportstrategy = new Strategy(
      googleOptions,
      verifyFunctionFactory(userService).bind(this),
    );

    this.strategy = new StrategyAdapter(
      this.passportstrategy,
      this.name,
      mapProfile.bind(this),
    );
  }

  /**
   * authenticate a request
   * @param request
   */
  async authenticate(request: Request): Promise<UserProfile | RedirectRoute> {
    return this.strategy.authenticate(request);
  }
}
