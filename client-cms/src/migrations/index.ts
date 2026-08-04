import * as migration_20260804_085509_initial from './20260804_085509_initial';

export const migrations = [
  {
    up: migration_20260804_085509_initial.up,
    down: migration_20260804_085509_initial.down,
    name: '20260804_085509_initial'
  },
];
