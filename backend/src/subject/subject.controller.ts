import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateSubjectDto } from 'src/subject/dto/createSubject.dto';
import { SubjectEntity } from 'src/subject/subject.entity';
import { SubjectService } from 'src/subject/subject.service';

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
  async createSubject(
    @Body() createSubjectDto: CreateSubjectDto,
  ): Promise<SubjectEntity> {
    return await this.subjectService.createSubject(createSubjectDto);
  }

  @Post(':id')
  async addTeacherToSubject(
    @Body('teacherId') teacherId: number,
    @Param('id') subjectId: number,
  ): Promise<SubjectEntity> {
    return await this.subjectService.addTeacherToSubject(teacherId, subjectId);
  }
}
