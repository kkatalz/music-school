import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { GradeService } from './grade.service';
import { CreateGradeDto } from './dto/createGrade.dto';
import { GradeEntity } from './grade.entity';
import { GradeResponseDto } from './dto/gradeResponse.dto';
import { UpdateGradeDto } from './dto/updateGradeDto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/auth/types/role.enum';

@Controller('grades')
export class GradeController {
  constructor(private gradeService: GradeService) {}

  @Post()
  @Roles(Role.Teacher, Role.HeadTeacher)
  async setGrade(
    @Body() createGradeDto: CreateGradeDto,
  ): Promise<GradeResponseDto> {
    return await this.gradeService.setGrade(createGradeDto);
  }

  @Put(':id')
  @Roles(Role.Teacher, Role.HeadTeacher)
  async updateGrade(
    @Param('id') id: number,
    @Body() updateGradeDto: UpdateGradeDto,
  ): Promise<GradeEntity> {
    return await this.gradeService.updateGrade(id, updateGradeDto);
  }

  @Get('student/:studentId')
  async getStudentsGrades(
    @Param('studentId') studentId: number,
    @Query('subjectName') subjectName?: string,
    @Query('year') year?: number,
    @Query('semester') semester?: number,
  ): Promise<GradeEntity[]> {
    return await this.gradeService.getStudentsGrades(
      studentId,
      subjectName,
      year,
      semester,
    );
  }

  @Get('teacher/:teacherId')
  @Roles(Role.Teacher, Role.HeadTeacher)
  async getGradesByTeacher(
    @Param('teacherId') teacherId: number,
    @Query('subjectName') subjectName?: string,
    @Query('year') year?: number,
    @Query('semester') semester?: number,
  ): Promise<GradeEntity[]> {
    return await this.gradeService.getGradesByTeacher(
      teacherId,
      subjectName,
      year,
      semester,
    );
  }
}
