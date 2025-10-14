import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

/**
 * Data Transfer Object for creating a new grade.
 */
export class CreateGradeDto {
    /**
     * The ID of the student receiving the grade.
     */
    @IsNumber()
    @IsNotEmpty()
    studentId: number;

    /**
     * The ID of the subject for which the grade is given.
     */
    @IsNumber()
    @IsNotEmpty()
    subjectId: number;

    /**
     * The ID of the teacher who is giving the grade.
     */
    @IsNumber()
    @IsNotEmpty()
    teacherId: number;

    /**
     * The grade value itself. This is optional because a student
     * might be enrolled in a subject before receiving a grade.
     */
    @IsNumber()
    @IsOptional()
    value?: number;
}
