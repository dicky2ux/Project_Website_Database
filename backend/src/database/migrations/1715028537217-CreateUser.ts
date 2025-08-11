import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1715028537217 implements MigrationInterface {
  name = 'CreateUser1715028537217';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "role" (
        "id" integer NOT NULL,
        "name" character varying NOT NULL,
        CONSTRAINT "PK_role" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `CREATE TABLE "status" (
        "id" integer NOT NULL,
        "name" character varying NOT NULL,
        CONSTRAINT "PK_status" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `CREATE TABLE "file" (
        "id" integer NOT NULL,
        "path" character varying NOT NULL,
        CONSTRAINT "PK_file" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" (
        "id" SERIAL NOT NULL,
        "socialId" character varying,
        "photoId" integer,
        "roleId" integer,
        "statusId" integer,
        "email" character varying,
        "password" character varying,
        "provider" character varying NOT NULL DEFAULT 'email',
        "fullName" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        CONSTRAINT "UQ_email" UNIQUE ("email"),
        CONSTRAINT "REL_photo" UNIQUE ("photoId"),
        CONSTRAINT "PK_user" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_socialId" ON "user" ("socialId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fullName" ON "user" ("fullName")`,
    );
    await queryRunner.query(
      `CREATE TABLE "session" (
        "id" SERIAL NOT NULL,
        "hash" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        "userId" integer,
        CONSTRAINT "PK_session" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_userId" ON "session" ("userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user"
        ADD CONSTRAINT "FK_photoId"
        FOREIGN KEY ("photoId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user"
        ADD CONSTRAINT "FK_roleId"
        FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user"
        ADD CONSTRAINT "FK_statusId"
        FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "session"
        ADD CONSTRAINT "FK_userId"
        FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_userId"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "session"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_fullName"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_socialId"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "file"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "status"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "role"`);
  }
}
