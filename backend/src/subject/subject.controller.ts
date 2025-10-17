import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateSubjectDto } from 'src/subject/dto/createSubject.dto';
import { SubjectEntity } from 'src/subject/subject.entity';
import { SubjectService } from 'src/subject/subject.service';
import { UpdateSubjectDto } from './dto/UpdateSubject.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/auth/types/role.enum';

@Controller('subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Get()
  async getSubjectsNames() {
    return await this.subjectService.getSubjectsNames();
  }

  @Get('info')
  async getSubjectsInfo() {
    return await this.subjectService.getSubjectsInfo();
  }

  @Post()
  @Roles(Role.HeadTeacher)
  async createSubject(
    @Body() createSubjectDto: CreateSubjectDto,
  ): Promise<SubjectEntity> {
    return await this.subjectService.createSubject(createSubjectDto);
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

  @Patch('id')
  @Roles(Role.HeadTeacher)
  async updateSubject(
    @Param('id') id: number,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ): Promise<SubjectEntity> {
    return await this.subjectService.updateSubject(id, updateSubjectDto);
  }
}
