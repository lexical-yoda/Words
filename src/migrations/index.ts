import * as migration_20261106_062230_initial from './20261106_062230_initial';
import * as migration_20261106_064917_author_photo_lookup from './20261106_064917_author_photo_lookup';
import * as migration_20261106_070858_users_api_key from './20261106_070858_users_api_key';
import * as migration_20261106_071818_site_settings from './20261106_071818_site_settings';

export const migrations = [
  {
    up: migration_20261106_062230_initial.up,
    down: migration_20261106_062230_initial.down,
    name: '20261106_062230_initial',
  },
  {
    up: migration_20261106_064917_author_photo_lookup.up,
    down: migration_20261106_064917_author_photo_lookup.down,
    name: '20261106_064917_author_photo_lookup',
  },
  {
    up: migration_20261106_070858_users_api_key.up,
    down: migration_20261106_070858_users_api_key.down,
    name: '20261106_070858_users_api_key',
  },
  {
    up: migration_20261106_071818_site_settings.up,
    down: migration_20261106_071818_site_settings.down,
    name: '20261106_071818_site_settings'
  },
];
