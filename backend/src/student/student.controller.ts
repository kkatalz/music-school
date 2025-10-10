import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Query
} from '@nestjs/common';
import { StudentEntity } from 'src/student/student.entity';
import { StudentService } from 'src/student/student.service';
import { CreateStudentDto } from './dto/createStudent.dto';
import { UpdateStudentDto } from './dto/updateStudent.dto';
import { StudentResponseDto } from './dto/studentResponse.dto';
import { DeleteResult } from 'typeorm/browser';
import { BadRequestException } from '@nestjs/common';

@Controller('students')
export class StudentContoller {
  constructor(private readonly studentService: StudentService) {}

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

  @Get()
  async getStudentsByPeriod(
    @Query('start') startDate: string,
    @Query('end') endDate: string,
  ): Promise<StudentEntity[]> {
    return await this.studentService.getStudentsByPeriod(new Date(startDate), new Date(endDate));
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
  async createStudent(@Body() createStudentDto: CreateStudentDto): Promise<StudentEntity> {
    return await this.studentService.createStudent(createStudentDto);
  }

  @Put(':id')
  async updateStudent(
    @Param('id') studentId: number,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<StudentEntity> {
    return await this.studentService.updateStudent(studentId, updateStudentDto);
  }

  @Delete(':id')
  async deleteStudent(@Param('id') studentId: number): Promise<DeleteResult> {
    return await this.studentService.deleteStudent(studentId);
  }

}
