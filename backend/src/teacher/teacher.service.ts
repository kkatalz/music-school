import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentEntity } from 'src/student/student.entity';
import { SubjectEntity } from 'src/subject/subject.entity';
import { CreateTeacherDto } from 'src/teacher/dto/createTeacher.dto';
import { TeacherResponseDto } from 'src/teacher/dto/teacherResponse.dto';
import { UpdateTeacherDto } from 'src/teacher/dto/updateTeacherDto';
import { TeacherEntity } from 'src/teacher/teacher.entity';
import { Repository } from 'typeorm';
import { DeleteResult } from 'typeorm/browser';
import * as dotenv from 'dotenv';
import { sign } from 'jsonwebtoken';
import { Role } from 'src/auth/role.enum';

dotenv.config();

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(TeacherEntity)
    private readonly teacherRepository: Repository<TeacherEntity>,
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
    @InjectRepository(SubjectEntity)
    private readonly subjectRepository: Repository<SubjectEntity>,
  ) {}

  async getAllTeachers() {
    const teachers = await this.teacherRepository.find();
    return teachers.map((teacher) => this.generateTeacherResponse(teacher));
  }

  async getMyStudents(
    teacherId: number,
    year?: number,
    semester?: number,
  ): Promise<StudentEntity[]> {
    const qb = this.studentRepository
      .createQueryBuilder('student')
      .innerJoin('student.subjects', 'subject')
      .innerJoin('subject.teachers', 'teacher', 'teacher.id = :teacherId', {
        teacherId,
      });

    if (year !== undefined) {
      qb.andWhere('subject.studyYear = :year', { year });
    }
    if (semester !== undefined) {
      qb.andWhere('subject.semester = :semester', { semester });
    }

    qb.distinct(true);

    // subject names/ids if the student repeats:
    qb.addSelect([
      'subject.id',
      'subject.name',
      'subject.studyYear',
      'subject.semester',
    ]);

    return qb.getMany();
  }
  async getMySubjects(
    teacherId: number,
    year?: number,
    semester?: number,
  ): Promise<SubjectEntity[]> {
    const qb = this.subjectRepository
      .createQueryBuilder('subject')
      .innerJoin('subject.teachers', 'teacher', 'teacher.id = :teacherId', {
        teacherId,
      });

    if (year !== undefined) {
      qb.andWhere('subject.studyYear = :year', { year });
    }
    if (semester !== undefined) {
      qb.andWhere('subject.semester = :semester', { semester });
    }

    qb.distinct(true);

    return qb.getMany();
  }

  // if is head Teacher
  async createTeacher(
    createTeacherDto: CreateTeacherDto,
  ): Promise<TeacherResponseDto> {
    await this.findTeacherByEmail(createTeacherDto.email);

    const newTeacher = new TeacherEntity();
    Object.assign(newTeacher, createTeacherDto);

    newTeacher.isHeadTeacher = createTeacherDto.isHeadTeacher || false;

    const savedTeacher = await this.teacherRepository.save(newTeacher);
    return this.generateTeacherResponse(savedTeacher);
  }

  async updateTeacher(
    teacherId: number,
    updateTeacherDto: UpdateTeacherDto,
  ): Promise<TeacherEntity> {
    const teacher = await this.findTeacherById(teacherId);

    if (updateTeacherDto.email && updateTeacherDto.email !== teacher.email)
      await this.findTeacherByEmail(updateTeacherDto.email);

    Object.assign(teacher, updateTeacherDto);

    return await this.teacherRepository.save(teacher);
  }

  async deleteTeacher(teacherId: number): Promise<DeleteResult> {
    await this.findTeacherById(teacherId);

    return await this.teacherRepository.delete(teacherId);
  }

  async calculateExperience(teacherId: number): Promise<Number> {
    const teacher = await this.findTeacherById(teacherId);
    const diffMs = Date.now() - teacher.startWorkDate.getTime();
    const diffMonths = diffMs / (1000 * 60 * 60 * 24 * 30.44);
    return Math.floor(diffMonths);
  }

  generateToken(teacher: TeacherEntity): string {
    return sign(
      {
        id: teacher.id,
        role: teacher.isHeadTeacher ? Role.HeadTeacher : Role.Teacher,
      },
      process.env.JWT_SECRET ?? 'test',
    );
  }

  // Helpers
  async findTeacherById(id: number): Promise<TeacherEntity> {
    const teacherById = await this.teacherRepository.findOne({
      where: {
        id,
      },
    });

    if (!teacherById)
      throw new HttpException('Teacher was not found', HttpStatus.NOT_FOUND);

    return teacherById;
  }

  async findTeacherByEmail(email: string): Promise<void> {
    const teacherByEmail = await this.teacherRepository.findOne({
      where: {
        email,
      },
    });

    if (teacherByEmail) {
      throw new HttpException(
        'Email is already taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  generateTeacherResponse(teacher: TeacherEntity): TeacherResponseDto {
    return {
      id: teacher.id,
      lastName: teacher.lastName,
      phone: teacher.phone,
      email: teacher.email,
      token: this.generateToken(teacher),
    };
  }
}
