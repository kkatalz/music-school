import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CreateSubjectDto } from 'src/subject/dto/createSubject.dto';
import { SubjectEntity } from 'src/subject/subject.entity';
import { SubjectService } from 'src/subject/subject.service';
import { UpdateSubjectDto } from './dto/updateSubject.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/auth/types/role.enum';
import { SubjectsNamesResponseDto } from 'src/subject/dto/subjectsNamesResponse.dto';
import { SubjectResponseDto } from 'src/subject/dto/subjectResponse.dto';

@Controller('subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Get()
  async getSubjectsNames(): Promise<SubjectsNamesResponseDto[]> {
    return await this.subjectService.getSubjectsNames();
  }

  @Get('info')
  async getSubjectsInfo(): Promise<SubjectEntity[]> {
    return await this.subjectService.getSubjectsInfo();
  }

  @Get(':id')
  async getSubjectById(@Param('id') subjectId: number): Promise<SubjectEntity> {
    return await this.subjectService.findSubjectById(subjectId);
  }

  @Post()
  @Roles(Role.HeadTeacher)
  async createSubject(
    @Body() createSubjectDto: CreateSubjectDto,
  ): Promise<SubjectEntity> {
    return await this.subjectService.createSubject(createSubjectDto);
  }

  @Patch(':id')
  @Roles(Role.HeadTeacher)
  async updateSubject(
    @Param('id') subjectId: number,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ): Promise<SubjectResponseDto> {
    return await this.subjectService.updateSubject(subjectId, updateSubjectDto);
  }

  @Delete(':id')
  @Roles(Role.HeadTeacher)
  async deleteSubject(@Param('id') subjectId: number): Promise<SubjectEntity> {
    return await this.subjectService.deleteSubject(subjectId);
  }

  @Post(':id/teachers')
  @Roles(Role.HeadTeacher)
  async addTeacherToSubject(
    @Body('teacherId') teacherId: number,
    @Param('id') subjectId: number,
  ): Promise<SubjectEntity> {
    return await this.subjectService.addTeacherToSubject(teacherId, subjectId);
  }

  @Post(':id/students')
  @Roles(Role.HeadTeacher)
  async addStudentToSubject(
    @Body('studentId') studentId: number,
    @Param('id') subjectId: number,
  ): Promise<SubjectEntity> {
    return await this.subjectService.addStudentToSubject(studentId, subjectId);
  }

  @Delete(':id/teachers')
  @Roles(Role.HeadTeacher)
  async removeTeacherFromSubject(
    @Param('id', ParseIntPipe) subjectId: number,
    @Body('teacherId', ParseIntPipe) teacherId: number,
  ): Promise<SubjectEntity> {
    return this.subjectService.removeTeacherFromSubject(teacherId, subjectId);
  }

  @Delete(':id/students')
  @Roles(Role.HeadTeacher)
  async removeStudentFromSubject(
    @Param('id', ParseIntPipe) subjectId: number,
    @Body('studentId', ParseIntPipe) studentId: number,
  ): Promise<SubjectEntity> {
    return this.subjectService.removeStudentFromSubject(studentId, subjectId);
  }
}
