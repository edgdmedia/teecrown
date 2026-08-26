import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs) {
  await payload.db.drizzle.execute(`
    ALTER TABLE "contact_submissions" ADD COLUMN "phone" varchar;
    ALTER TABLE "contact_submissions" ADD COLUMN "service" varchar;
    ALTER TABLE "contact_submissions" ADD COLUMN "referral" varchar;
  `)
}

export async function down({ payload }: MigrateDownArgs) {
  await payload.db.drizzle.execute(`
    ALTER TABLE "contact_submissions" DROP COLUMN "phone";
    ALTER TABLE "contact_submissions" DROP COLUMN "service";
    ALTER TABLE "contact_submissions" DROP COLUMN "referral";
  `)
}
