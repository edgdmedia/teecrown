import * as migration_20260825_104232_init_postgres from './20260825_104232_init_postgres';
import * as migration_20260825_184500_drop_legacy_image_fields from './20260825_184500_drop_legacy_image_fields';

export const migrations = [
  {
    up: migration_20260825_104232_init_postgres.up,
    down: migration_20260825_104232_init_postgres.down,
    name: '20260825_104232_init_postgres'
  },
  {
    up: migration_20260825_184500_drop_legacy_image_fields.up,
    down: migration_20260825_184500_drop_legacy_image_fields.down,
    name: '20260825_184500_drop_legacy_image_fields'
  },
];
