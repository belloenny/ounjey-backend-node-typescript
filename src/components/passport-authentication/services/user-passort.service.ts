/* eslint-disable @typescript-eslint/prefer-optional-chain */
import {UserIdentityService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Profile as PassportProfile} from 'passport';
import {User} from '../../../models';
import {UserIdentityRepository, UserRepository} from '../../../repositories';
import {PasswordHasher, PasswordHasherBindings} from '../../jwt-authentication';

/**
 * User service to accept a 'passport' user profile and save it locally
 */
export class PassportUserIdentityService
  implements UserIdentityService<PassportProfile, User> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserIdentityRepository)
    public userIdentityRepository: UserIdentityRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
  ) {}

  /**
   * find a linked local user for an external profile
   * create a local user if not created yet.
   * @param email
   * @param profile
   * @param token
   */
  async findOrCreateUser(profile: PassportProfile): Promise<User> {
    if (!profile.emails || !profile.emails.length) {
      throw new Error('email-id is required in returned profile to login');
    }
    const email = profile.emails[0].value;

    const users: User[] = await this.userRepository.find({
      where: {
        email: email,
      },
    });
    let user: User;
    if (!users || !users.length) {
      const name =
        profile.name && profile.name.givenName
          ? profile.name.givenName + ' ' + profile.name.familyName
          : profile.displayName;
      user = await this.userRepository.create({
        email: email,
        firstName: name || JSON.stringify(profile.name?.givenName),
        lastName: profile.name?.givenName,
        username: email,
        roles: ['customer'],
      });
    } else {
      user = users[0];
    }
    user = await this.linkExternalProfile('' + user.id, profile);
    return user;
  }

  /**
   * link external profile with local user
   * @param userId
   * @param userIdentity
   */
  async linkExternalProfile(
    userId: string,
    userIdentity: PassportProfile,
  ): Promise<User> {
    let profile;
    try {
      profile = await this.userIdentityRepository.findById(userIdentity.id);
    } catch (err) {
      // no need to throw an error if entity is not found
      if (!(err.code === 'ENTITY_NOT_FOUND')) {
        throw err;
      }
    }

    if (!profile) {
      await this.createUser(userId, userIdentity);
    } else {
      await this.userIdentityRepository.updateById(userIdentity.id, {
        profile: {
          emails: userIdentity.emails,
        },
        createdAt: new Date(),
      });
    }
    if (!userId) console.log('user id is empty');
    return this.userRepository.findById(userId, {
      include: [
        {
          relation: 'profiles',
        },
      ],
    });
  }

  /**
   * create a copy of the external profile
   * @param userId
   * @param userIdentity
   */
  async createUser(
    userId: string,
    userIdentity: PassportProfile,
  ): Promise<void> {
    await this.userIdentityRepository.create({
      id: userIdentity.id,
      provider: userIdentity.provider,
      authScheme: userIdentity.provider,
      userId: userId,
      profile: {
        emails: userIdentity.emails,
      },
      created: new Date(),
    });
  }
}
