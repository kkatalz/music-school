import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateTeacherDto } from 'src/teacher/dto/createTeacher.dto';
import { UpdateTeacherDto } from 'src/teacher/dto/updateTeacherDto';
import { TeacherEntity } from 'src/teacher/teacher.entity';
import { TeacherService } from 'src/teacher/teacher.service';
import { DeleteResult } from 'typeorm';

@Controller('teachers')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get()
  async getAllTeachers() {
    return await this.teacherService.getAllTeachers();
  }

  @Get('/experience/:id')
  async calculateExperience(@Param('id') teacherId: number) {
    return await this.teacherService.calculateExperience(teacherId);
  }

  @Get(':id')
  async getTeacher(@Param('id') teacherId: number) {
    return await this.teacherService.findTeacherById(teacherId);
  }

  // only for headTeacher. TODO: Auth, TeacherGuard
  @Post()
  async createTeacher(
    @Body() createTeacherDto: CreateTeacherDto,
  ): Promise<TeacherEntity> {
    return await this.teacherService.createTeacher(createTeacherDto);
  }

  @Put(':id')
  async updateTeacher(
    @Param('id') teacherId: number,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ): Promise<TeacherEntity> {
    return await this.teacherService.updateTeacher(teacherId, updateTeacherDto);
  }

  @Delete(':id')
  async deleteTeacher(@Param('id') teacherId: number): Promise<DeleteResult> {
    return await this.teacherService.deleteTeacher(teacherId);
  }
}
