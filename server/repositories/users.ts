import { BaseRepository } from './base';

class UserRepository extends BaseRepository {
  constructor() {
    super(
      'users',
      ['account', 'name', 'email'],
      ['updated_at'],
      ['account', 'name', 'email', 'status', 'updated_at'],
    );
  }
}

export const userRepository = new UserRepository();
