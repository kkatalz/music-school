import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentEntity } from 'src/student/student.entity';
import { CreateStudentDto } from './dto/createStudent.dto';
import { UpdateStudentDto } from './dto/updateStudent.dto';
import { StudentResponseDto } from './dto/studentResponse.dto';
import { DeleteResult } from 'typeorm/browser';
import { Repository } from 'typeorm';
import { LessThanOrEqual, MoreThanOrEqual, IsNull } from 'typeorm';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
  ) {}

  async createStudent(createStudentDto: CreateStudentDto): Promise<StudentEntity> {
    await this.findStudentByEmail(createStudentDto.email);

    const newStudent = new StudentEntity();
    Object.assign(newStudent, createStudentDto);

    const savedStudent = await this.studentRepository.save(newStudent);
    return savedStudent;
  }

  async updateStudent(studentId: number, updateStudentDto: UpdateStudentDto): Promise<StudentEntity> {
    const student = await this.findStudentById(studentId);

    if (updateStudentDto.email && updateStudentDto.email !== student.email)
      await this.findStudentByEmail(updateStudentDto.email);

    Object.assign(student, updateStudentDto);

    return await this.studentRepository.save(student);
  }

  async deleteStudent(studentId: number): Promise<DeleteResult> {
    await this.findStudentById(studentId);
    return await this.studentRepository.delete(studentId);
  }

  async getStudentInfo(studentId: number): Promise<StudentEntity> {
    return await this.findStudentById(studentId);
  }

  async getStudentsByPeriod(startDate: Date, endDate: Date): Promise<StudentEntity[]> {
    return await this.studentRepository
      .createQueryBuilder('student')
      .where('student.startStudyDate BETWEEN :start AND :end', { start: startDate, end: endDate })
      .getMany();
  }

  async getTotalStudents(startDate: Date, endDate: Date): Promise<number> {
    return await this.studentRepository
      .createQueryBuilder('student')
      .where('student.startStudyDate BETWEEN :start AND :end', { start: startDate, end: endDate })
      .getCount();
  }

  async getStudyYears(studentId: number): Promise<number> {
    const student = await this.findStudentById(studentId);
    const start = student.startStudyDate.getTime();
    const now = Date.now();
    const years = (now - start) / (1000 * 60 * 60 * 24 * 365.25);
    return Math.floor(years);
  }

  // Helpers
  private async findStudentById(id: number): Promise<StudentEntity> {
    const studentById = await this.studentRepository.findOne({ where: { id } });

    if (!studentById)
      throw new HttpException('Student was not found', HttpStatus.NOT_FOUND);

    return studentById;
  }

  private async findStudentByEmail(email: string): Promise<void> {
    const studentByEmail = await this.studentRepository.findOne({ where: { email } });

    if (studentByEmail) {
      throw new HttpException('Email is already taken', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  generateStudentsResponse(students: StudentEntity[]): StudentResponseDto[] {
    return students.map((student) => ({
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      phone: student.phone,
      parentPhone: student.parentPhone,
      email: student.email,
      address: student.address,
      startStudyDate: student.startStudyDate,
    }));
  }

}
