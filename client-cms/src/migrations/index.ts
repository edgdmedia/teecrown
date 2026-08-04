import * as migration_20260804_085509_initial from './20260804_085509_initial';
import * as migration_20260804_100456_drop_unused_pages_services from './20260804_100456_drop_unused_pages_services';

export const migrations = [
  {
    up: migration_20260804_085509_initial.up,
    down: migration_20260804_085509_initial.down,
    name: '20260804_085509_initial',
  },
  {
    up: migration_20260804_100456_drop_unused_pages_services.up,
    down: migration_20260804_100456_drop_unused_pages_services.down,
    name: '20260804_100456_drop_unused_pages_services'
  },
];
