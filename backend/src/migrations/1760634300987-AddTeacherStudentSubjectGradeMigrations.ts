import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTeacherStudentSubjectGradeMigrations1760634300987 implements MigrationInterface {
    name = 'AddTeacherStudentSubjectGradeMigrations1760634300987'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "grades" ADD "student_id" integer`);
        await queryRunner.query(`ALTER TABLE "grades" ADD "teacher_id" integer`);
        await queryRunner.query(`ALTER TABLE "grades" ADD CONSTRAINT "FK_9acca493883cee3b9e8f9e01cd1" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "grades" ADD CONSTRAINT "FK_4e40960913bb4a4c059fa9939d6" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "grades" DROP CONSTRAINT "FK_4e40960913bb4a4c059fa9939d6"`);
        await queryRunner.query(`ALTER TABLE "grades" DROP CONSTRAINT "FK_9acca493883cee3b9e8f9e01cd1"`);
        await queryRunner.query(`ALTER TABLE "grades" DROP COLUMN "teacher_id"`);
        await queryRunner.query(`ALTER TABLE "grades" DROP COLUMN "student_id"`);
    }

}
