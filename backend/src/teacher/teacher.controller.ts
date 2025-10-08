import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateTeacherDto } from 'src/teacher/dto/createTeacher.dto';
import { TeacherEntity } from 'src/teacher/teacher.entity';
import { TeacherService } from 'src/teacher/teacher.service';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post()
  async createTeacher(
    @Body() createTeacherDto: CreateTeacherDto,
  ): Promise<TeacherEntity> {
    return await this.teacherService.createTeacher(createTeacherDto);
  }
}
