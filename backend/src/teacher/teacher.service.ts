import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTeacherDto } from 'src/teacher/dto/createTeacher.dto';
import { TeacherEntity } from 'src/teacher/teacher.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(TeacherEntity)
    private readonly teacherRepository: Repository<TeacherEntity>,
  ) {}

  async createTeacher(
    createTeacherDto: CreateTeacherDto,
  ): Promise<TeacherEntity> {
    const teacherByEmail = await this.teacherRepository.findOne({
      where: {
        email: createTeacherDto.email,
      },
    });

    if (teacherByEmail) {
      throw new HttpException(
        'Email is already taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newTeacher = new TeacherEntity();
    Object.assign(newTeacher, createTeacherDto);

    newTeacher.isHeadTeacher = createTeacherDto.isHeadTeacher || false;

    const savedTeacher = await this.teacherRepository.save(newTeacher);
    return savedTeacher;
  }
}
