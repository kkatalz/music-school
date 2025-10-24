import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentEntity } from '../student/student.entity';
import { SubjectEntity } from '../subject/subject.entity';
import { CreateTeacherDto } from './dto/createTeacher.dto';
import { TeacherResponseDto } from './dto/teacherResponse.dto';
import { UpdateTeacherDto } from './dto/updateTeacherDto';
import { TeacherEntity } from './teacher.entity';
import { Repository } from 'typeorm';
import { DeleteResult } from 'typeorm/browser';
import * as dotenv from 'dotenv';
import { sign } from 'jsonwebtoken';
import { Role } from '../auth/types/role.enum';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { ChangePasswordDto } from 'src/types/changePassword.dto';
import { GradeEntity } from 'src/grade/grade.entity';

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
    private readonly dataSource: DataSource,
  ) {}

  async getAllTeachers(): Promise<TeacherResponseDto[]> {
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
      })
      .leftJoinAndSelect('student.subjects', 'allSubjects');

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

    const studentWithGivenEmail = await this.studentRepository.find({
      where: {
        email: createTeacherDto.email,
      },
    });
    if (studentWithGivenEmail) {
      throw new HttpException(
        'Email is already taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

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

  async deleteTeacher(
    teacherId: number,
    authHeadTeacherId: number,
  ): Promise<TeacherResponseDto> {
    const teacher = await this.findTeacherById(teacherId);
    if (teacherId == authHeadTeacherId) {
      throw new HttpException(
        'You can not delete yourself',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.dataSource.transaction(async (manager) => {
      // Remove M:N join rows: subjects <-> teacher
      const subjectIds = await manager
        .createQueryBuilder(SubjectEntity, 's')
        .innerJoin('s.teachers', 'teacher', 'teacher.id = :teacherId', {
          teacherId,
        })
        .select('s.id', 'id')
        .getRawMany()
        .then((rows) => rows.map((r) => r.id as number));

      if (subjectIds.length) {
        await manager
          .createQueryBuilder()
          .relation(TeacherEntity, 'subjects')
          .of(teacherId)
          .remove(subjectIds);
      }

      //Delete grades for this teacher
      await manager
        .createQueryBuilder()
        .delete()
        .from(GradeEntity)
        .where('teacher_id = :teacherId', { teacherId })
        .execute();

      await manager.delete(TeacherEntity, teacherId);
    });

    return this.generateTeacherResponse(teacher);
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

  async changeTeacherPassword(
    changePasswordDto: ChangePasswordDto,
    myId: number,
  ): Promise<TeacherEntity> {
    const teacher = await this.teacherRepository.findOne({
      where: { id: myId },
    });

    if (!teacher) {
      throw new HttpException('Teacher is not found', HttpStatus.NOT_FOUND);
    }

    const salt = await bcrypt.genSalt(10);
    teacher.password = await bcrypt.hash(changePasswordDto.password, salt);

    return await this.teacherRepository.save(teacher);
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

  private async findTeacherByEmail(email: string): Promise<void> {
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
    const role = teacher.isHeadTeacher ? Role.HeadTeacher : Role.Teacher;
    return {
      id: teacher.id,
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      phone: teacher.phone,
      education: teacher.education,
      startWorkDate: teacher.startWorkDate,
      email: teacher.email,
      token: this.generateToken(teacher),
      isHeadTeacher: teacher.isHeadTeacher,
      role,
    };
  }
}
