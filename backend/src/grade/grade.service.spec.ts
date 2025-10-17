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

});
