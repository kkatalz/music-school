import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Role } from 'src/auth/types/role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { StudentEntity } from 'src/student/student.entity';
import { SubjectEntity } from 'src/subject/subject.entity';
import { CreateTeacherDto } from 'src/teacher/dto/createTeacher.dto';
import { TeacherResponseDto } from 'src/teacher/dto/teacherResponse.dto';
import { UpdateTeacherDto } from 'src/teacher/dto/updateTeacherDto';
import { TeacherEntity } from 'src/teacher/teacher.entity';
import { TeacherService } from 'src/teacher/teacher.service';

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

  @Get(':teacherId/students')
  async getTeachersStudents(
    @Param('teacherId') teacherId: number,
    @Query('year') year?: number,
    @Query('semester') semester?: number,
  ): Promise<StudentEntity[]> {
    return await this.teacherService.getMyStudents(teacherId, year, semester);
  }

  @Get(':teacherId/subjects')
  async getTeachersSubjects(
    @Param('teacherId') teacherId: number,
    @Query('year') year?: number,
    @Query('semester') semester?: number,
  ): Promise<SubjectEntity[]> {
    return await this.teacherService.getMySubjects(teacherId, year, semester);
  }

  @Post()
  @Roles(Role.HeadTeacher)
  async createTeacher(
    @Body() createTeacherDto: CreateTeacherDto,
  ): Promise<TeacherResponseDto> {
    return await this.teacherService.createTeacher(createTeacherDto);
  }

  @Put(':id')
  @Roles(Role.HeadTeacher)
  async updateTeacher(
    @Param('id') teacherId: number,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ): Promise<TeacherEntity> {
    return await this.teacherService.updateTeacher(teacherId, updateTeacherDto);
  }

  @Delete(':id')
  @Roles(Role.HeadTeacher)
  async deleteTeacher(
    @Param('id') teacherId: number,
  ): Promise<TeacherResponseDto> {
    return await this.teacherService.deleteTeacher(teacherId);
  }
}
