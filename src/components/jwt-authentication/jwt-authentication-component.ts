// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-access-control-migration
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {registerAuthenticationStrategy} from '@loopback/authentication';
import {
  Application,
  Binding,
  Component,
  CoreBindings,
  inject,
} from '@loopback/core';
import {
  PasswordHasherBindings,
  TokenServiceBindings,
  TokenServiceConstants,
  UserServiceBindings,
} from './keys';
import {BcryptHasher} from './services';
import {JWTService} from './services/jwt-service';
import {MyUserService} from './services/user-jwt.service';
import {JWTAuthenticationStrategy, SessionStrategy} from './strategies';

export class JWTAuthenticationComponent implements Component {
  bindings: Binding[] = [
    Binding.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstants.TOKEN_SECRET_VALUE,
    ),
    Binding.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
    ),
    Binding.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService),
    Binding.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService),
    Binding.bind(PasswordHasherBindings.ROUNDS).to(10),
    Binding.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher),
  ];
  constructor(@inject(CoreBindings.APPLICATION_INSTANCE) app: Application) {
    registerAuthenticationStrategy(app, JWTAuthenticationStrategy);
    registerAuthenticationStrategy(app, SessionStrategy);
  }
}
