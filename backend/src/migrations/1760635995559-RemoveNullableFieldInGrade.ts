import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveNullableFieldInGrade1760635995559 implements MigrationInterface {
    name = 'RemoveNullableFieldInGrade1760635995559'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "grades" DROP CONSTRAINT "FK_ae1618ce22f07ef3e5e51d4c9e8"`);
        await queryRunner.query(`ALTER TABLE "grades" ALTER COLUMN "subject_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "grades" ADD CONSTRAINT "FK_ae1618ce22f07ef3e5e51d4c9e8" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "grades" DROP CONSTRAINT "FK_ae1618ce22f07ef3e5e51d4c9e8"`);
        await queryRunner.query(`ALTER TABLE "grades" ALTER COLUMN "subject_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "grades" ADD CONSTRAINT "FK_ae1618ce22f07ef3e5e51d4c9e8" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
