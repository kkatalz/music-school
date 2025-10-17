import { Test, TestingModule } from '@nestjs/testing';
import { GradeService } from './grade.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GradeEntity } from './grade.entity';
import { SubjectEntity } from 'src/subject/subject.entity';
import { StudentEntity } from 'src/student/student.entity';
import { TeacherEntity } from 'src/teacher/teacher.entity';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

describe('GradeService', () => {
  let gradeService: GradeService;
  let gradeRepository: Repository<GradeEntity>;
  let subjectRepository: Repository<SubjectEntity>;
  let studentRepository: Repository<StudentEntity>;
  let teacherRepository: Repository<TeacherEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GradeService,
        {
          provide: getRepositoryToken(GradeEntity),
          useValue: {
            save: jest.fn(),
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

    await expect(gradeService.setGrade(dto)).rejects.toThrow(
    new HttpException('Subject does not exist', HttpStatus.NOT_FOUND),
    );
  });

  it('should throw if student not found', async () => {
    jest.spyOn(subjectRepository, 'findOne').mockResolvedValueOnce({ id: 1 } as SubjectEntity);
    jest.spyOn(studentRepository, 'findOne').mockResolvedValueOnce(null);

    await expect(gradeService.setGrade(dto)).rejects.toThrow(
    new HttpException('Student does not exist', HttpStatus.NOT_FOUND),
    );
  });

  it('should throw if teacher not found', async () => {
    jest.spyOn(subjectRepository, 'findOne').mockResolvedValueOnce({ id: 1 } as SubjectEntity);
    jest.spyOn(studentRepository, 'findOne').mockResolvedValueOnce({ id: 2 } as StudentEntity);
    jest.spyOn(teacherRepository, 'findOne').mockResolvedValueOnce(null);

    await expect(gradeService.setGrade(dto)).rejects.toThrow(
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
    await expect(gradeService.setGrade(dto)).rejects.toThrow(HttpException);
  });

});
