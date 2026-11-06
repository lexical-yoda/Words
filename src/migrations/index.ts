import * as migration_20261106_062230_initial from './20261106_062230_initial';
import * as migration_20261106_064917_author_photo_lookup from './20261106_064917_author_photo_lookup';

export const migrations = [
  {
    up: migration_20261106_062230_initial.up,
    down: migration_20261106_062230_initial.down,
    name: '20261106_062230_initial',
  },
  {
    up: migration_20261106_064917_author_photo_lookup.up,
    down: migration_20261106_064917_author_photo_lookup.down,
    name: '20261106_064917_author_photo_lookup'
  },
];
