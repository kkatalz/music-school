import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSubjectDto } from 'src/subject/dto/createSubject.dto';
import { SubjectsNamesResponseDto } from 'src/subject/dto/subjectsNamesResponse.dto';
import { SubjectEntity } from 'src/subject/subject.entity';
import { CreateTeacherDto } from 'src/teacher/dto/createTeacher.dto';
import { TeacherResponseDto } from 'src/teacher/dto/teacherResponse.dto';
import { UpdateTeacherDto } from 'src/teacher/dto/updateTeacherDto';
import { TeacherEntity } from 'src/teacher/teacher.entity';
import { StudentEntity } from 'src/student/student.entity';
import { Repository } from 'typeorm';
import { UpdateSubjectDto } from './dto/UpdateSubject.dto';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(SubjectEntity)
    private readonly subjectRepository: Repository<SubjectEntity>,
    @InjectRepository(TeacherEntity)
    private readonly teacherRepository: Repository<TeacherEntity>,
    @InjectRepository(TeacherEntity)
    private readonly studentRepository: Repository<StudentEntity>,
  ) {}

  async getSubjectsNames() {
    const subjects = await this.subjectRepository.find();
    return this.generateSubjectsNamesResponse(subjects);
  }

  async getSubjectsInfo() {
    return await this.subjectRepository
      .createQueryBuilder('subject')
      .loadAllRelationIds({ relations: ['teachers', 'students'] })
      .getMany();
  }

  // if isHeadTeacher
  async createSubject(
    createSubjectDto: CreateSubjectDto,
  ): Promise<SubjectEntity> {
    const subject = await this.subjectRepository.findOne({
      where: {
        name: createSubjectDto.name,
      },
    });

    if (subject) {
      throw new HttpException(
        'Subject with given name already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

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

  async addStudentToSubject(
    studentId: number,
    subjectId: number,
  ): Promise<SubjectEntity> {
    console.log(studentId);
    const subject = await this.subjectRepository.findOne({
      where: {
        id: subjectId,
      },
    });

    if (!subject) {
      throw new HttpException('Subject not found', HttpStatus.NOT_FOUND);
    }

    const student = await this.studentRepository.findOne({
      where: { id: studentId },
      relations: ['subjects'],
    });
    console.log(student);

    if (!student) {
      throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
    }

    await this.subjectRepository
      .createQueryBuilder()
      .relation(SubjectEntity, 'students')
      .of(subjectId)
      .add(studentId);

    const updatedSubject = await this.subjectRepository.findOneOrFail({
      where: {
        id: subjectId,
      },
      relations: ['students'],
    });

    return updatedSubject;
  }

  async updateSubject(
    subjectId: number,
    updateSubjectDto: UpdateSubjectDto,
  ): Promise<SubjectEntity> {
    const subject = await this.subjectRepository.findOneBy({ id: subjectId });

    if (!subject) {
      throw new NotFoundException(`Subject with ID ${subjectId} not found`);
    }

    Object.assign(subject, updateSubjectDto);
    return this.subjectRepository.save(subject);
  }

  generateSubjectsNamesResponse(
    subjects: SubjectEntity[],
  ): SubjectsNamesResponseDto[] {
    return subjects.map((subject) => ({
      id: subject.id,
      name: subject.name,
    }));
  }
}
