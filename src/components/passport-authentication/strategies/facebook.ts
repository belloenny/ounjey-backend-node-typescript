import {
  AuthenticationStrategy,
  UserIdentityService,
} from '@loopback/authentication';
import {StrategyAdapter} from '@loopback/authentication-passport';
import {bind, inject} from '@loopback/context';
import {extensionFor} from '@loopback/core';
import {RedirectRoute, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {Profile} from 'passport';
import {Strategy, StrategyOption} from 'passport-facebook';
import {User} from '../../../models';
import {UserServiceBindings} from '../keys';
import {
  mapProfile,
  PassportAuthenticationBindings,
  verifyFunctionFactory,
} from './types';

@bind(extensionFor(PassportAuthenticationBindings.OAUTH2_STRATEGY))
export class FaceBookOauth2Authorization implements AuthenticationStrategy {
  name = 'oauth2-facebook';
  protected strategy: StrategyAdapter<User>;
  passportstrategy: Strategy;

  /**
   * create an oauth2 strategy for facebook
   */
  constructor(
    @inject(UserServiceBindings.PASSPORT_USER_IDENTITY_SERVICE)
    public userService: UserIdentityService<Profile, User>,
    @inject('facebookOAuth2Options')
    public facebookOptions: StrategyOption,
  ) {
    this.passportstrategy = new Strategy(
      facebookOptions,
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
