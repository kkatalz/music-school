import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTeacherEntity1759931891350 implements MigrationInterface {
  name = 'CreateTeacherEntity1759931891350';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "teachers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "phone" character varying NOT NULL, "education" character varying NOT NULL, "start_work_date" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password" character varying NOT NULL, "is_head_teacher" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_a8d4f83be3abe4c687b0a0093c8" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "teachers"`);
  }
}
