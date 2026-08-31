import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs) {
  await payload.db.drizzle.execute(`
    ALTER TABLE "contact_submissions" ADD COLUMN IF NOT EXISTS "phone" varchar;
    ALTER TABLE "contact_submissions" ADD COLUMN IF NOT EXISTS "service" varchar;
    ALTER TABLE "contact_submissions" ADD COLUMN IF NOT EXISTS "referral" varchar;
  `)
}

export async function down({ payload }: MigrateDownArgs) {
  await payload.db.drizzle.execute(`
    ALTER TABLE "contact_submissions" DROP COLUMN IF EXISTS "phone";
    ALTER TABLE "contact_submissions" DROP COLUMN IF EXISTS "service";
    ALTER TABLE "contact_submissions" DROP COLUMN IF EXISTS "referral";
  `)
}
