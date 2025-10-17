import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentEntity } from 'src/student/student.entity';
import { CreateStudentDto } from './dto/createStudent.dto';
import { UpdateStudentDto } from './dto/updateStudent.dto';
import { StudentResponseDto } from './dto/studentResponse.dto';
import { SubjectEntity } from 'src/subject/subject.entity';
import { TeacherEntity } from 'src/teacher/teacher.entity';
import { DeleteResult } from 'typeorm/browser';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { Role } from 'src/auth/types/role.enum';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
    @InjectRepository(SubjectEntity)
    private readonly subjectRepository: Repository<SubjectEntity>,
    @InjectRepository(TeacherEntity)
    private readonly teacherRepository: Repository<TeacherEntity>,
  ) {}

  async createStudent(
    createStudentDto: CreateStudentDto,
  ): Promise<StudentResponseDto> {
    await this.findStudentByEmail(createStudentDto.email);

    const newStudent = new StudentEntity();
    Object.assign(newStudent, createStudentDto);

    const savedStudent = await this.studentRepository.save(newStudent);
    return this.generateStudentResponse(savedStudent);
  }

  async updateStudent(
    studentId: number,
    updateStudentDto: UpdateStudentDto,
  ): Promise<StudentEntity> {
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
    return await this.studentRepository.findOneOrFail({
      where: { id: studentId },
      relations: ['subjects'],
    });
  }

  async getAllStudents(): Promise<StudentEntity[]> {
    return await this.studentRepository.find();
  }

  async getStudentsByPeriod(
    startDate: Date,
    endDate: Date,
  ): Promise<StudentEntity[]> {
    return await this.studentRepository
      .createQueryBuilder('student')
      .where('student.startStudyDate BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      })
      .getMany();
  }

  async getTotalStudents(startDate: Date, endDate: Date): Promise<number> {
    return await this.studentRepository
      .createQueryBuilder('student')
      .where('student.startStudyDate BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      })
      .getCount();
  }

  async getStudyYears(studentId: number): Promise<number> {
    const student = await this.findStudentById(studentId);
    const start = student.startStudyDate.getTime();
    const now = Date.now();
    const years = (now - start) / (1000 * 60 * 60 * 24 * 365.25);
    return Math.floor(years);
  }

  async getStudentSubjects(
    studentId: number,
    year?: number,
    semester?: number,
  ): Promise<SubjectEntity[]> {
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
    }

    const query = this.subjectRepository
      .createQueryBuilder('subject')
      .innerJoin('subject.students', 'student')
      .where('student.id = :studentId', { studentId });

    if (year !== undefined) {
      query.andWhere('subject.studyYear = :year', { year });
    }

    if (semester !== undefined) {
      query.andWhere('subject.semester = :semester', { semester });
    }

    return query.getMany();
  }

  async getStudentTeachers(
    studentId: number,
    year?: number,
    semester?: number,
  ): Promise<TeacherEntity[]> {
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
    }

    const query = this.teacherRepository
      .createQueryBuilder('teacher')
      .innerJoin('teacher.subjects', 'subject')
      .innerJoin('subject.students', 'student', 'student.id = :studentId', {
        studentId,
      })
      .distinct(true);

    if (year !== undefined) {
      query.andWhere('subject.studyYear = :year', { year });
    }

    if (semester !== undefined) {
      query.andWhere('subject.semester = :semester', { semester });
    }

    return query.getMany();
  }

  generateToken(student: StudentEntity): string {
    return sign(
      {
        id: student.id,
        role: Role.Student,
      },
      process.env.JWT_SECRET ?? '',
    );
  }

  // Helpers
  async findStudentById(id: number): Promise<StudentEntity> {
    const studentById = await this.studentRepository.findOne({ where: { id } });

    if (!studentById)
      throw new HttpException('Student was not found', HttpStatus.NOT_FOUND);

    return studentById;
  }

  private async findStudentByEmail(email: string): Promise<void> {
    const studentByEmail = await this.studentRepository.findOne({
      where: { email },
    });

    if (studentByEmail) {
      throw new HttpException(
        'Email is already taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  generateStudentResponse(student: StudentEntity): StudentResponseDto {
    return {
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      phone: student.phone,
      parentPhone: student.parentPhone,
      email: student.email,
      address: student.address,
      startStudyDate: student.startStudyDate,
      token: this.generateToken(student),
      role: Role.Student,
    };
  }
}
