import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  get,
  param,
  RequestWithSession,
  Response,
  RestBindings,
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';

/**
 * Login controller for third party oauth provider
 */
export class Oauth2Controller {
  constructor() {}

  @authenticate('oauth2')
  @get('/auth/thirdparty/{provider}')
  /**
   * Endpoint: '/auth/thirdparty/{provider}'
   *          an endpoint for api clients to login via a third party app, redirects to third party app
   */
  loginToThirdParty(
    @param.path.string('provider') provider: string,
    @inject('authentication.redirect.url')
    redirectUrl: string,
    @inject('authentication.redirect.status')
    status: number,
    @inject(RestBindings.Http.RESPONSE)
    response: Response,
  ) {
    response.statusCode = status || 302;
    response.setHeader('Location', redirectUrl);
    response.end();
    return response;
  }

  @authenticate('oauth2')
  @get('/auth/thirdparty/{provider}/callback')
  /**
   * Endpoint: '/auth/thirdparty/{provider}/callback'
   *          an endpoint which serves as a oauth2 callback for the thirdparty app
   *          this endpoint sets the user profile in the session
   */
  async thirdPartyCallBack(
    @param.path.string('provider') provider: string,
    @inject(SecurityBindings.USER) user: UserProfile,
    @inject(RestBindings.Http.REQUEST) request: RequestWithSession,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    const profile = {
      ...user.profile,
    };
    request.session.user = profile;
    response.redirect('http://localhost:4000/account');
    return response;
  }
}
