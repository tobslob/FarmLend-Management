import { Organization } from '@app/data/models';
import { BaseRepository } from './base.repo';

class UserRepo extends BaseRepository<Organization> {}

export const orgRepo = new UserRepo(Organization);
