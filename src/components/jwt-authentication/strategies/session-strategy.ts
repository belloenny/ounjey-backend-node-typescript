import {AuthenticationStrategy} from '@loopback/authentication';
import {extensions, Getter} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, RedirectRoute, RequestWithSession} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {User} from '../../../models';
import {UserRepository} from '../../../repositories';
import {JwtAuthBindings} from '../keys';

export class SessionStrategy implements AuthenticationStrategy {
  name = 'session';

  constructor(
    @extensions(JwtAuthBindings.JWT_STRATEGY)
    private getStrategies: Getter<SessionStrategy[]>,
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  /**
   * authenticate a request
   * @param request
   */
  async authenticate(
    request: RequestWithSession,
  ): Promise<UserProfile | RedirectRoute | undefined> {
    if (request.headers.authorization) {
      const strategies: SessionStrategy[] = await this.getStrategies();
      const strategy = strategies.find(
        (s: SessionStrategy) => s.name === 'jwt',
      );
      if (!strategy) throw new Error('provider not found');
      return strategy.authenticate(request);
    } else {
      if (!request.session || !request.session.user) {
        throw new HttpErrors.Unauthorized(`You are not Logged In `);
      }
      const user: User = request.session.user as User;
      if (!user.email || !user.id) {
        throw new HttpErrors.Unauthorized(`Invalid user profile`);
      }
      const users: User[] = await this.userRepository.find({
        where: {
          email: user.email,
        },
      });
      if (!users || !users.length) {
        throw new HttpErrors.Unauthorized(`User not registered`);
      }
      return this.mapProfile(request.session.user as User);
    }
  }

  private mapProfile(user: User): UserProfile {
    const userProfile: UserProfile = {
      [securityId]: '' + user.id,
      profile: {
        ...user,
      },
    };
    return userProfile;
  }
}
