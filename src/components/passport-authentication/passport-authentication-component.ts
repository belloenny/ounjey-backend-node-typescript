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
import {UserServiceBindings} from './keys';
import {PassportUserIdentityService} from './services';
import {
  FaceBookOauth2Authorization,
  GoogleOauth2Authorization,
  LocalAuthStrategy,
  Oauth2AuthStrategy,
} from './strategies';

export class PassportAuthComponent implements Component {
  bindings: Binding[] = [
    Binding.bind(UserServiceBindings.PASSPORT_USER_IDENTITY_SERVICE).toClass(
      PassportUserIdentityService,
    ),
  ];
  constructor(@inject(CoreBindings.APPLICATION_INSTANCE) app: Application) {
    registerAuthenticationStrategy(app, GoogleOauth2Authorization);
    registerAuthenticationStrategy(app, FaceBookOauth2Authorization);
    registerAuthenticationStrategy(app, LocalAuthStrategy);
    registerAuthenticationStrategy(app, Oauth2AuthStrategy);
  }
}
