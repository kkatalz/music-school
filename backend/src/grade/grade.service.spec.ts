import { Test, TestingModule } from '@nestjs/testing';
import { GradeService } from './grade.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GradeEntity } from './grade.entity';
import { SubjectEntity } from 'src/subject/subject.entity';
import { StudentEntity } from 'src/student/student.entity';
import { TeacherEntity } from 'src/teacher/teacher.entity';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { MailService } from '../mail/mail.service';

describe('GradeService', () => {
  let gradeService: GradeService;
  let gradeRepository: Repository<GradeEntity>;
  let subjectRepository: Repository<SubjectEntity>;
  let studentRepository: Repository<StudentEntity>;
  let teacherRepository: Repository<TeacherEntity>;

  const mockMailService = {
    sendGradeNotification: jest.fn(),
    sendGradeUpdateNotification: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GradeService,
        {
          provide: getRepositoryToken(GradeEntity),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            findOneOrFail: jest.fn(),
            findOneBy: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(SubjectEntity),
          useValue: {
            findOne: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(StudentEntity),
          useValue: { findOne: jest.fn() },
        },
        {
          provide: getRepositoryToken(TeacherEntity),
          useValue: { findOne: jest.fn() },
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    gradeService = module.get<GradeService>(GradeService);
    gradeRepository = module.get(getRepositoryToken(GradeEntity));
    subjectRepository = module.get(getRepositoryToken(SubjectEntity));
    studentRepository = module.get(getRepositoryToken(StudentEntity));
    teacherRepository = module.get(getRepositoryToken(TeacherEntity));
  });

  it('should be defined', () => {
    expect(gradeService).toBeDefined();
  });

  const dto = { subjectId: 1, studentId: 2, teacherId: 3, value: 95 };

  it('should throw if subject not found', async () => {
    jest.spyOn(subjectRepository, 'findOne').mockResolvedValueOnce(null);

    await expect(gradeService.setGrade(dto, 3)).rejects.toThrow(
    new HttpException('Subject does not exist', HttpStatus.NOT_FOUND),
    );
  });

  it('should throw if student not found', async () => {
    jest.spyOn(subjectRepository, 'findOne').mockResolvedValueOnce({ id: 1 } as SubjectEntity);
    jest.spyOn(studentRepository, 'findOne').mockResolvedValueOnce(null);

    await expect(gradeService.setGrade(dto, 3)).rejects.toThrow(
    new HttpException('Student does not exist', HttpStatus.NOT_FOUND),
    );
  });

  it('should throw if teacher not found', async () => {
    jest.spyOn(subjectRepository, 'findOne').mockResolvedValueOnce({ id: 1 } as SubjectEntity);
    jest.spyOn(studentRepository, 'findOne').mockResolvedValueOnce({ id: 2 } as StudentEntity);
    jest.spyOn(teacherRepository, 'findOne').mockResolvedValueOnce(null);

    await expect(gradeService.setGrade(dto, 3)).rejects.toThrow(
      new HttpException('Teacher does not exist', HttpStatus.NOT_FOUND),
    );
  });

  it('should throw if student not enrolled in subject', async () => {
    jest.spyOn(subjectRepository, 'findOne').mockResolvedValue({ id: 1 } as SubjectEntity);
    jest.spyOn(studentRepository, 'findOne').mockResolvedValue({ id: 2 } as StudentEntity);
    jest.spyOn(teacherRepository, 'findOne').mockResolvedValue({ id: 3 } as TeacherEntity);

    const qbMock = {
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(null),
    };

    jest.spyOn(subjectRepository, 'createQueryBuilder').mockReturnValue(qbMock as any);
    await expect(gradeService.setGrade(dto, 3)).rejects.toThrow(HttpException);
  });

  it('should save grade successfully', async () => {
    const subject = { id: 1, name: 'Piano' } as SubjectEntity;
    const student = { id: 2 } as StudentEntity;
    const teacher = { id: 3, isHeadTeacher: true } as TeacherEntity;

    jest.spyOn(subjectRepository, 'findOne').mockResolvedValue(subject);
    jest.spyOn(studentRepository, 'findOne').mockResolvedValue(student);
    jest.spyOn(teacherRepository, 'findOne').mockResolvedValue(teacher);

    const qbMockStudentEnrollment = {
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(subject),
    };

    const qbMockTeacherAssignment = {
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(subject),
    };

    jest.spyOn(subjectRepository, 'createQueryBuilder')
      .mockReturnValueOnce(qbMockStudentEnrollment as any)
      .mockReturnValueOnce(qbMockTeacherAssignment as any);

    const savedGrade = { id: 10 } as GradeEntity;
    const finalGrade = {
      id: 10,
      value: 12,
      subject,
      student,
      teacher,
    } as GradeEntity;

    jest.spyOn(gradeRepository, 'save').mockResolvedValue(savedGrade);
    jest.spyOn(gradeRepository, 'findOneOrFail').mockResolvedValue(finalGrade);

    const result = await gradeService.setGrade(dto, 3);
    expect(result).toHaveProperty('id', 10);
    expect(result).toHaveProperty('value', 12);
  });

  describe('updateGrade', () => {
    it('should throw if grade not found', async () => {
      jest.spyOn(gradeRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        gradeService.updateGrade(1, { value: 10 }, 3),
      ).rejects.toThrow(new NotFoundException('Grade with id 1 not found'));
    });

    it('should update grade successfully', async () => {
      const teacher = { id: 3, isHeadTeacher: false } as TeacherEntity;
      const grade = { 
        id: 1, 
        value: 11,
        teacher: teacher,
        student: { id: 2 } as StudentEntity,
        subject: { id: 1 } as SubjectEntity,
      } as GradeEntity;
      
      jest.spyOn(gradeRepository, 'findOne').mockResolvedValueOnce(grade);
      jest.spyOn(teacherRepository, 'findOne').mockResolvedValue(teacher);
      jest.spyOn(gradeRepository, 'save').mockResolvedValueOnce({ ...grade, value: 80 });

      const result = await gradeService.updateGrade(1, { value: 11 }, 3);
      expect(result.value).toBe(80);
    });
  });

  describe('gradeResponseDto', () => {
    it('should format grade properly', () => {
      const grade = {
        id: 1,
        value: 9,
        subject: { id: 5, name: 'Bandura' },
        student: { id: 2, firstName: 'John', lastName: 'Doe' },
        teacher: { id: 3, firstName: 'Teacher', lastName: 'Name' },
      } as GradeEntity;

      const result = gradeService.gradeResponseDto(grade);
      expect(result).toEqual({
        id: 1,
        subject: { id: 5, name: 'Bandura' },
        student: { id: 2, firstName: 'John', lastName: 'Doe' },
        teacher: { id: 3, firstName: 'Teacher', lastName: 'Name' },
        value: 9,
      });
    });
  });

});
