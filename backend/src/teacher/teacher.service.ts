import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTeacherDto } from 'src/teacher/dto/createTeacher.dto';
import { TeacherResponseDto } from 'src/teacher/dto/teacherResponse.dto';
import { UpdateTeacherDto } from 'src/teacher/dto/updateTeacherDto';
import { TeacherEntity } from 'src/teacher/teacher.entity';
import { Repository } from 'typeorm';
import { DeleteResult } from 'typeorm/browser';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(TeacherEntity)
    private readonly teacherRepository: Repository<TeacherEntity>,
  ) {}

  async getAllTeachers() {
    const teachers = await this.teacherRepository.find();
    return this.generateTeachersResponse(teachers);
  }

  // if is head Teacher
  async createTeacher(
    createTeacherDto: CreateTeacherDto,
  ): Promise<TeacherEntity> {
    await this.findTeacherByEmail(createTeacherDto.email);

    const newTeacher = new TeacherEntity();
    Object.assign(newTeacher, createTeacherDto);

    newTeacher.isHeadTeacher = createTeacherDto.isHeadTeacher || false;

    const savedTeacher = await this.teacherRepository.save(newTeacher);
    return savedTeacher;
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

  generateTeachersResponse(teachers: TeacherEntity[]): TeacherResponseDto[] {
    return teachers.map((teacher) => ({
      id: teacher.id,
      lastName: teacher.lastName,
      phone: teacher.phone,
      email: teacher.email,
    }));
  }
}
