import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class UpdateSubjectDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    studyYear?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    semester?: number;
}
