import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMigrations1760103186309 implements MigrationInterface {
    name = 'UpdateMigrations1760103186309'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "students" ("id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "phone" character varying NOT NULL, "parent_phone" character varying NOT NULL, "address" character varying NOT NULL, "start_study_date" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_7d7f07271ad4ce999880713f05e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "teachers" ("id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "phone" character varying NOT NULL, "education" character varying NOT NULL, "start_work_date" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password" character varying NOT NULL, "is_head_teacher" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_a8d4f83be3abe4c687b0a0093c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subjects" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "study_year" integer NOT NULL, "semester" integer NOT NULL, CONSTRAINT "PK_1a023685ac2b051b4e557b0b280" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subjects_teachers_teachers" ("subjectsId" integer NOT NULL, "teachersId" integer NOT NULL, CONSTRAINT "PK_a4cd768e43d499d55f28ec992a4" PRIMARY KEY ("subjectsId", "teachersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5277f266ba42ba3daf25718e85" ON "subjects_teachers_teachers" ("subjectsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9be8d621d037fc355e4dbfea42" ON "subjects_teachers_teachers" ("teachersId") `);
        await queryRunner.query(`CREATE TABLE "subjects_students_students" ("subjectsId" integer NOT NULL, "studentsId" integer NOT NULL, CONSTRAINT "PK_dfc83d7e87b6f29a21d530bc5a2" PRIMARY KEY ("subjectsId", "studentsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_415a19ba92a50b33a3cecb76be" ON "subjects_students_students" ("subjectsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d36ae861c4d45d9ba98b42efac" ON "subjects_students_students" ("studentsId") `);
        await queryRunner.query(`ALTER TABLE "subjects_teachers_teachers" ADD CONSTRAINT "FK_5277f266ba42ba3daf25718e850" FOREIGN KEY ("subjectsId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "subjects_teachers_teachers" ADD CONSTRAINT "FK_9be8d621d037fc355e4dbfea42e" FOREIGN KEY ("teachersId") REFERENCES "teachers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subjects_students_students" ADD CONSTRAINT "FK_415a19ba92a50b33a3cecb76bea" FOREIGN KEY ("subjectsId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "subjects_students_students" ADD CONSTRAINT "FK_d36ae861c4d45d9ba98b42efaca" FOREIGN KEY ("studentsId") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subjects_students_students" DROP CONSTRAINT "FK_d36ae861c4d45d9ba98b42efaca"`);
        await queryRunner.query(`ALTER TABLE "subjects_students_students" DROP CONSTRAINT "FK_415a19ba92a50b33a3cecb76bea"`);
        await queryRunner.query(`ALTER TABLE "subjects_teachers_teachers" DROP CONSTRAINT "FK_9be8d621d037fc355e4dbfea42e"`);
        await queryRunner.query(`ALTER TABLE "subjects_teachers_teachers" DROP CONSTRAINT "FK_5277f266ba42ba3daf25718e850"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d36ae861c4d45d9ba98b42efac"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_415a19ba92a50b33a3cecb76be"`);
        await queryRunner.query(`DROP TABLE "subjects_students_students"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9be8d621d037fc355e4dbfea42"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5277f266ba42ba3daf25718e85"`);
        await queryRunner.query(`DROP TABLE "subjects_teachers_teachers"`);
        await queryRunner.query(`DROP TABLE "subjects"`);
        await queryRunner.query(`DROP TABLE "teachers"`);
        await queryRunner.query(`DROP TABLE "students"`);
    }

}
