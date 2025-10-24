import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGradeDto } from './dto/createGrade.dto';
import { GradeResponseDto } from './dto/gradeResponse.dto';
import { UpdateGradeDto } from './dto/updateGradeDto';
import { GradeEntity } from './grade.entity';
import { SubjectEntity } from 'src/subject/subject.entity';
import { StudentEntity } from 'src/student/student.entity';
import { TeacherEntity } from 'src/teacher/teacher.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class GradeService {
  constructor(
    @InjectRepository(GradeEntity)
    private readonly gradeRepository: Repository<GradeEntity>,
    @InjectRepository(SubjectEntity)
    private readonly subjectRepository: Repository<SubjectEntity>,
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
    @InjectRepository(TeacherEntity)
    private readonly teacherRepository: Repository<TeacherEntity>,
    private readonly mailService: MailService,
  ) {}

  async setGrade(
    createGradeDto: CreateGradeDto,
    authenticatedTeacherId: number,
  ): Promise<GradeResponseDto> {
    const { subjectId, studentId, teacherId, value } = createGradeDto;

    const subject = await this.subjectRepository.findOne({
      where: {
        id: subjectId,
      },
    });

    if (!subject) {
      throw new HttpException('Subject does not exist', HttpStatus.NOT_FOUND);
    }

    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new HttpException('Student does not exist', HttpStatus.NOT_FOUND);
    }

    const teacher = await this.teacherRepository.findOne({
      where: { id: teacherId },
    });

    if (!teacher) {
      throw new HttpException('Teacher does not exist', HttpStatus.NOT_FOUND);
    }

    const authenticatedTeacher = await this.teacherRepository.findOne({
      where: { id: authenticatedTeacherId },
    });

    if (!authenticatedTeacher) {
      throw new HttpException(
        'Authenticated teacher not found',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isAssignedTeacher = teacherId === authenticatedTeacherId;
    const isHeadTeacher = authenticatedTeacher.isHeadTeacher;

    if (!isAssignedTeacher && !isHeadTeacher) {
      throw new HttpException(
        'You are not authorized to set grades for this subject. Only the assigned teacher or a head teacher can set grades.',
        HttpStatus.FORBIDDEN,
      );
    }

    const enrolled = await this.subjectRepository
      .createQueryBuilder('subject')
      .innerJoin('subject.students', 'student', 'student.id = :studentId', {
        studentId,
      })
      .where('subject.id = :subjectId', { subjectId })
      .getOne();

    if (!enrolled) {
      throw new HttpException(
        `Student ${studentId} is not enrolled in subject ${subjectId}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const teacherAssigned = await this.subjectRepository
      .createQueryBuilder('subject')
      .innerJoin('subject.teachers', 'teacher', 'teacher.id = :teacherId', {
        teacherId,
      })
      .where('subject.id = :subjectId', { subjectId })
      .getOne();

    if (!teacherAssigned) {
      throw new HttpException(
        `Teacher ${teacherId} is not assigned to subject ${subjectId}`,
        HttpStatus.FORBIDDEN,
      );
    }

    const newGrade = new GradeEntity();

    newGrade.value = value;
    newGrade.subject = subject;
    newGrade.student = student;
    newGrade.teacher = teacher;

    const savedGrade = await this.gradeRepository.save(newGrade);
    const updatedGrade = await this.gradeRepository.findOneOrFail({
      where: {
        id: savedGrade.id,
      },
      relations: ['subject', 'student', 'teacher'],
    });

    // Відправка листа учню
    if (updatedGrade.student && updatedGrade.student.email) {
      await this.mailService.sendGradeNotification(
        updatedGrade.student.email,
        updatedGrade.subject?.name ?? 'Unknown subject',
        updatedGrade.value!,
      );
    }

    return this.gradeResponseDto(updatedGrade);
  }

  async updateGrade(
    gradeId: number,
    updateGradeDto: UpdateGradeDto,
    authenticatedTeacherId: number,
  ): Promise<GradeEntity> {
    const grade = await this.gradeRepository.findOneBy({ id: gradeId });
    if (!grade)
      throw new NotFoundException(`Grade with id ${gradeId} not found`);

    const authenticatedTeacher = await this.teacherRepository.findOne({
      where: { id: authenticatedTeacherId },
    });

    if (!authenticatedTeacher) {
      throw new HttpException(
        'Authenticated teacher not found',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isGradeOwner = grade.teacher?.id === authenticatedTeacherId;
    const isHeadTeacher = authenticatedTeacher.isHeadTeacher;

    if (!isGradeOwner && !isHeadTeacher) {
      throw new HttpException(
        'You are not authorized to update this grade. Only the teacher who created it or a head teacher can update grades.',
        HttpStatus.FORBIDDEN,
      );
    }

    grade.value = updateGradeDto.value;
    return await this.gradeRepository.save(grade);
  }

  async getStudentsGrades(
    studentId: number,
    subjectName?: string,
    year?: number,
    semester?: number,
  ): Promise<GradeEntity[]> {
    const qb = this.gradeRepository
      .createQueryBuilder('grade')
      .innerJoinAndSelect('grade.subject', 'subject')
      .where('grade.student.id = :studentId', { studentId });

    if (subjectName !== undefined) {
      qb.andWhere('subject.name = :subjectName', { subjectName });
    }
    if (year !== undefined) {
      qb.andWhere('subject.studyYear = :year', { year });
    }
    if (semester !== undefined) {
      qb.andWhere('subject.semester = :semester', { semester });
    }

    return qb.getMany();
  }

  async getGradesByTeacher(
    teacherId: number,
    subjectName?: string,
    year?: number,
    semester?: number,
  ): Promise<GradeEntity[]> {
    const qb = this.gradeRepository
      .createQueryBuilder('grade')
      .innerJoinAndSelect('grade.subject', 'subject')
      .where('grade.teacher.id = :teacherId', { teacherId });

    if (subjectName !== undefined) {
      qb.andWhere('subject.name = :subjectName', { subjectName });
    }

    if (year !== undefined) {
      qb.andWhere('subject.studyYear = :year', { year });
    }
    if (semester !== undefined) {
      qb.andWhere('subject.semester = :semester', { semester });
    }

    return qb.getMany();
  }

  gradeResponseDto(grade: GradeEntity): GradeResponseDto {
    return {
      id: grade.id,
      /**
            student: {
                id: grade.student.id,
                firstName: grade.student.firstName,
                lastName: grade.student.lastName,
                phone: grade.student.phone,
                parentPhone: grade.student.parentPhone,
                address: grade.student.address,
                startStudyDate: grade.student.startStudyDate,
                email: grade.student.email,
                token: '',
            },
                **/

      subject: {
        id: grade.subject?.id,
        name: grade.subject?.name,
      },
      /**
            teacher: {
                id: grade.teacher.id,
                lastName: grade.teacher.lastName,
                phone: grade.teacher.phone,
                email: grade.teacher.email,
                token: '',
            },
                **/

      value: grade.value,
    };
  }
}
