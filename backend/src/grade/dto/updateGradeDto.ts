import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateGradeDto {
    @IsNumber()
    @IsNotEmpty()
    value: number;
}
