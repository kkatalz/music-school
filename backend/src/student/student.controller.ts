import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { Role } from 'src/auth/types/role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { StudentEntity } from 'src/student/student.entity';
import { StudentService } from 'src/student/student.service';
import { SubjectEntity } from 'src/subject/subject.entity';
import { TeacherEntity } from 'src/teacher/teacher.entity';
import { DeleteResult } from 'typeorm/browser';
import { CreateStudentDto } from './dto/createStudent.dto';
import { StudentResponseDto } from './dto/studentResponse.dto';
import { UpdateStudentDto } from './dto/updateStudent.dto';
import { ChangePasswordDto } from 'src/types/changePassword.dto';

@Controller('students')
export class StudentContoller {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  async getAllStudents(): Promise<StudentEntity[]> {
    return await this.studentService.getAllStudents();
  }

  @Patch('password')
  @Roles(Role.Student)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req,
  ): Promise<StudentEntity> {
    const myId = req.student.id;
    return await this.studentService.changeStudentPassword(
      changePasswordDto,
      myId,
    );
  }

  @Get('/total')
  async getTotalStudents(
    @Query('start') startDate: string,
    @Query('end') endDate: string,
  ): Promise<number> {
    if (!startDate || !endDate) {
      throw new BadRequestException('Both start and end dates are required');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    return await this.studentService.getTotalStudents(start, end);
  }

  @Get(':studentId/subjects')
  async getStudentSubjects(
    @Param('studentId') studentId: number,
    @Query('year') year?: number,
    @Query('semester') semester?: number,
  ): Promise<SubjectEntity[]> {
    return await this.studentService.getStudentSubjects(
      studentId,
      year,
      semester,
    );
  }

  @Get(':id/teachers')
  async getStudentTeachers(
    @Param('id') studentId: number,
    @Query('year') year?: number,
    @Query('semester') semester?: number,
  ): Promise<TeacherEntity[]> {
    return await this.studentService.getStudentTeachers(
      studentId,
      year,
      semester,
    );
  }

  @Get()
  async getStudentsByPeriod(
    @Query('start') startDate: string,
    @Query('end') endDate: string,
  ): Promise<StudentEntity[]> {
    return await this.studentService.getStudentsByPeriod(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get(':id')
  async getStudentInfo(@Param('id') studentId: number): Promise<StudentEntity> {
    return await this.studentService.getStudentInfo(studentId);
  }

  @Get(':id/study-years')
  async getStudyYears(@Param('id') studentId: number): Promise<number> {
    return await this.studentService.getStudyYears(studentId);
  }

  @Post()
  @Roles(Role.HeadTeacher)
  async createStudent(
    @Body() createStudentDto: CreateStudentDto,
  ): Promise<StudentResponseDto> {
    return await this.studentService.createStudent(createStudentDto);
  }

  @Put(':id')
  @Roles(Role.HeadTeacher)
  async updateStudent(
    @Param('id') studentId: number,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<StudentEntity> {
    return await this.studentService.updateStudent(studentId, updateStudentDto);
  }

  @Delete(':id')
  @Roles(Role.HeadTeacher)
  async deleteStudent(
    @Param('id') studentId: number,
  ): Promise<StudentResponseDto> {
    return await this.studentService.deleteStudent(studentId);
  }
}
