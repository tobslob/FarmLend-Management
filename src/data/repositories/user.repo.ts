import { User } from '@app/data/models';
import { BaseRepository } from './base.repo';

class UserRepository extends BaseRepository<User> {}

export const userRepo = new UserRepository(User);
