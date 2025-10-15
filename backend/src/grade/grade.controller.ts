import {Body, Controller, Get, Param, Post, Put} from '@nestjs/common';
import {GradeService} from "./grade.service";
import {CreateGradeDto} from "./dto/createGrade.dto";
import {GradeEntity} from "./grade.entity";
import {GradeResponseDto} from "./dto/gradeResponse.dto";
import {UpdateGradeDto} from "./dto/updateGradeDto";


@Controller('grades')
export class GradeController {
    constructor(private gradeService: GradeService) {}

    @Post()
    async setGrade(
        @Body() createGradeDto: CreateGradeDto,
    ): Promise<GradeResponseDto> {
        return await this.gradeService.setGrade(createGradeDto);
    }


    @Put(':id')
    async updateGrade(
        @Param('id') id: number,
        @Body() updateGradeDto: UpdateGradeDto,
    ): Promise<GradeEntity> {
        return await this.gradeService.updateGrade(id, updateGradeDto);
    }


}