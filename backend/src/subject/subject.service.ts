import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentEntity } from 'src/student/student.entity';
import { CreateSubjectDto } from 'src/subject/dto/createSubject.dto';
import { SubjectsNamesResponseDto } from 'src/subject/dto/subjectsNamesResponse.dto';
import { SubjectEntity } from 'src/subject/subject.entity';
import { TeacherEntity } from 'src/teacher/teacher.entity';
import { Repository } from 'typeorm';
import { UpdateSubjectDto } from './dto/UpdateSubject.dto';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(SubjectEntity)
    private readonly subjectRepository: Repository<SubjectEntity>,
    @InjectRepository(TeacherEntity)
    private readonly teacherRepository: Repository<TeacherEntity>,
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
  ) {}

  async getSubjectsNames(): Promise<SubjectsNamesResponseDto[]> {
    const subjects = await this.subjectRepository.find();
    return this.generateSubjectsNamesResponse(subjects);
  }

  async getSubjectsInfo(): Promise<SubjectEntity[]> {
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
        semester: createSubjectDto.semester,
        studyYear: createSubjectDto.studyYear,
      },
    });

    if (subject) {
      throw new HttpException(
        'Subject with this name already exists in the given semester and year',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newSubject = new SubjectEntity();
    Object.assign(newSubject, createSubjectDto);

    const savedSubject = await this.subjectRepository.save(newSubject);
    return savedSubject;
  }

  async deleteSubject(subjectId: number): Promise<SubjectEntity> {
    const subject = await this.findSubjectById(subjectId);
    await this.subjectRepository.delete(subjectId);
    return subject;
  }

  // multiple teachers can teachone subject
  async addTeacherToSubject(
    teacherId: number,
    subjectId: number,
  ): Promise<SubjectEntity> {
    await this.findSubjectById(subjectId);

    const teacher = await this.teacherRepository.findOne({
      where: { id: teacherId },
      relations: ['subjects'],
    });

    if (!teacher) {
      throw new HttpException('Teacher not found', HttpStatus.NOT_FOUND);
    }

    const alreadyAssigned = await this.subjectRepository
      .createQueryBuilder('subject')
      .innerJoin('subject.teachers', 'teacher', 'teacher.id = :teacherId', {
        teacherId,
      })
      .where('subject.id = :subjectId', { subjectId })
      .getExists();

    if (alreadyAssigned) {
      throw new HttpException(
        'Teacher is already assigned to this subject',
        HttpStatus.CONFLICT,
      );
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
    await this.findSubjectById(subjectId);

    const student = await this.studentRepository.findOne({
      where: { id: studentId },
      relations: ['subjects'],
    });

    if (!student) {
      throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
    }

    const alreadyEnrolled = await this.subjectRepository
      .createQueryBuilder('subject')
      .innerJoin('subject.students', 'student', 'student.id = :studentId', {
        studentId,
      })
      .where('subject.id = :subjectId', { subjectId })
      .getExists();

    if (alreadyEnrolled) {
      throw new HttpException(
        'Student is already enrolled in this subject',
        HttpStatus.CONFLICT,
      );
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

  async removeTeacherFromSubject(
    teacherId: number,
    subjectId: number,
  ): Promise<SubjectEntity> {
    const subject = await this.subjectRepository.findOne({
      where: { id: subjectId },
      relations: ['teachers'],
    });

    if (!subject) {
      throw new HttpException('Subject not found', HttpStatus.NOT_FOUND);
    }

    const teacher = await this.teacherRepository.findOneBy({ id: teacherId });
    if (!teacher) {
      throw new HttpException('Teacher not found', HttpStatus.NOT_FOUND);
    }

    await this.subjectRepository
      .createQueryBuilder()
      .relation(SubjectEntity, 'teachers')
      .of(subjectId)
      .remove(teacherId);

    return this.subjectRepository.findOneOrFail({
      where: { id: subjectId },
      relations: ['teachers'],
    });
  }

  async removeStudentFromSubject(
    studentId: number,
    subjectId: number,
  ): Promise<SubjectEntity> {
    const subject = await this.subjectRepository.findOne({
      where: { id: subjectId },
      relations: ['students'],
    });

    if (!subject) {
      throw new HttpException('Subject not found', HttpStatus.NOT_FOUND);
    }

    const student = await this.studentRepository.findOneBy({ id: studentId });
    if (!student) {
      throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
    }

    await this.subjectRepository
      .createQueryBuilder()
      .relation(SubjectEntity, 'students')
      .of(subjectId)
      .remove(studentId);

    return this.subjectRepository.findOneOrFail({
      where: { id: subjectId },
      relations: ['students'],
    });
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

  async findSubjectById(subjectId: number): Promise<SubjectEntity> {
    const subject = await this.subjectRepository.findOne({
      where: { id: subjectId },
    });

    if (!subject) {
      throw new HttpException(
        'Subject not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return subject;
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
