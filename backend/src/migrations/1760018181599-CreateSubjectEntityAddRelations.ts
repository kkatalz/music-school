import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSubjectEntityAddRelations1760018181599
  implements MigrationInterface
{
  name = 'CreateSubjectEntityAddRelations1760018181599';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "subjects" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_1a023685ac2b051b4e557b0b280" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "teachers_subjects_subjects" ("teachersId" integer NOT NULL, "subjectsId" integer NOT NULL, CONSTRAINT "PK_aad960b3f7d068c59c0181460e8" PRIMARY KEY ("teachersId", "subjectsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_881ae84e059f2d51ce60ea8d60" ON "teachers_subjects_subjects" ("teachersId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4afd1f51df48493ea92f3e62a8" ON "teachers_subjects_subjects" ("subjectsId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "students_subjects_subjects" ("studentsId" integer NOT NULL, "subjectsId" integer NOT NULL, CONSTRAINT "PK_6941530a259a3aea3b693ef8f45" PRIMARY KEY ("studentsId", "subjectsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8d9399d7f524908e22bcee07f1" ON "students_subjects_subjects" ("studentsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_544f61aa7d0742af13b32cd976" ON "students_subjects_subjects" ("subjectsId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "teachers_subjects_subjects" ADD CONSTRAINT "FK_881ae84e059f2d51ce60ea8d604" FOREIGN KEY ("teachersId") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "teachers_subjects_subjects" ADD CONSTRAINT "FK_4afd1f51df48493ea92f3e62a82" FOREIGN KEY ("subjectsId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "students_subjects_subjects" ADD CONSTRAINT "FK_8d9399d7f524908e22bcee07f18" FOREIGN KEY ("studentsId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "students_subjects_subjects" ADD CONSTRAINT "FK_544f61aa7d0742af13b32cd976a" FOREIGN KEY ("subjectsId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "students_subjects_subjects" DROP CONSTRAINT "FK_544f61aa7d0742af13b32cd976a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "students_subjects_subjects" DROP CONSTRAINT "FK_8d9399d7f524908e22bcee07f18"`,
    );
    await queryRunner.query(
      `ALTER TABLE "teachers_subjects_subjects" DROP CONSTRAINT "FK_4afd1f51df48493ea92f3e62a82"`,
    );
    await queryRunner.query(
      `ALTER TABLE "teachers_subjects_subjects" DROP CONSTRAINT "FK_881ae84e059f2d51ce60ea8d604"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_544f61aa7d0742af13b32cd976"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8d9399d7f524908e22bcee07f1"`,
    );
    await queryRunner.query(`DROP TABLE "students_subjects_subjects"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4afd1f51df48493ea92f3e62a8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_881ae84e059f2d51ce60ea8d60"`,
    );
    await queryRunner.query(`DROP TABLE "teachers_subjects_subjects"`);
    await queryRunner.query(`DROP TABLE "subjects"`);
  }
}
