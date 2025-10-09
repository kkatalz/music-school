import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTeacherDto } from 'src/teacher/dto/createTeacher.dto';
import { UpdateTeacherDto } from 'src/teacher/dto/updateTeacherDto';
import { TeacherEntity } from 'src/teacher/teacher.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(TeacherEntity)
    private readonly teacherRepository: Repository<TeacherEntity>,
  ) {}

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

  // update_teacher(head_teacher_id:String, data:dict) : void
  //   + delete_teacher(head_teacher_id:String, teacher_id:String) : void // if is_head_teacher

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
}
