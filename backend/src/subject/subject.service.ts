import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSubjectDto } from 'src/subject/dto/createSubject.dto';
import { SubjectEntity } from 'src/subject/subject.entity';
import { CreateTeacherDto } from 'src/teacher/dto/createTeacher.dto';
import { TeacherResponseDto } from 'src/teacher/dto/teacherResponse.dto';
import { UpdateTeacherDto } from 'src/teacher/dto/updateTeacherDto';
import { TeacherEntity } from 'src/teacher/teacher.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(SubjectEntity)
    private readonly subjectRepository: Repository<SubjectEntity>,
    @InjectRepository(TeacherEntity)
    private readonly teacherRepository: Repository<TeacherEntity>,
  ) {}

  // if isHeadTeacher
  async createSubject(
    createSubjectDto: CreateSubjectDto,
  ): Promise<SubjectEntity> {
    const newSubject = new SubjectEntity();
    Object.assign(newSubject, createSubjectDto);

    const savedSubject = await this.subjectRepository.save(newSubject);
    return savedSubject;
  }

  // multiple teachers can teachone subject
  async addTeacherToSubject(
    teacherId: number,
    subjectId: number,
  ): Promise<SubjectEntity> {
    const subject = await this.subjectRepository.findOne({
      where: {
        id: subjectId,
      },
    });

    if (!subject) {
      throw new HttpException('Subject not found', HttpStatus.NOT_FOUND);
    }

    const teacher = await this.teacherRepository.findOne({
      where: { id: teacherId },
      relations: ['subjects'],
    });

    if (!teacher) {
      throw new HttpException('Teacher not found', HttpStatus.NOT_FOUND);
    }

    await this.subjectRepository
      .createQueryBuilder()
      .relation(SubjectEntity, 'teachers')
      .of(subjectId)
      .add(teacherId);

    const updatedSubject = await this.subjectRepository.findOneOrFail({
      where: {
        id: subjectId,
      },
      relations: ['teachers'],
    });

    return updatedSubject;
  }
}
