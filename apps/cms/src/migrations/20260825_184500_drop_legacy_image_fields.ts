import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "posts" DROP COLUMN IF EXISTS "image";
    ALTER TABLE "tour_packages" DROP COLUMN IF EXISTS "image";
    DROP TABLE IF EXISTS "tour_packages_gallery" CASCADE;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "posts" ADD COLUMN "image" varchar;
    UPDATE "posts" SET "image" = '' WHERE "image" IS NULL;
    ALTER TABLE "posts" ALTER COLUMN "image" SET NOT NULL;

    ALTER TABLE "tour_packages" ADD COLUMN "image" varchar;
    UPDATE "tour_packages" SET "image" = '' WHERE "image" IS NULL;
    ALTER TABLE "tour_packages" ALTER COLUMN "image" SET NOT NULL;

    CREATE TABLE "tour_packages_gallery" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "src" varchar NOT NULL
    );

    ALTER TABLE "tour_packages_gallery"
      ADD CONSTRAINT "tour_packages_gallery_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."tour_packages"("id")
      ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "tour_packages_gallery_order_idx" ON "tour_packages_gallery" USING btree ("_order");
    CREATE INDEX "tour_packages_gallery_parent_id_idx" ON "tour_packages_gallery" USING btree ("_parent_id");
  `)
}
