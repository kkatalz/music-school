import { Test, TestingModule } from '@nestjs/testing';
import { TeacherService } from './teacher.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TeacherEntity } from './teacher.entity';
import { StudentEntity } from '../student/student.entity';
import { SubjectEntity } from '../subject/subject.entity';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('TeacherService', () => {
  let service: TeacherService;
  let teacherRepo: Repository<TeacherEntity>;
  let studentRepo: any;
  let subjectRepo: any;

  const mockTeacher: TeacherEntity = {
    id: 1,
    firstName: 'Olena',
    lastName: 'Pyechkurova',
    phone: '0123456789',
    education: 'NaUKMA',
    startWorkDate: new Date('2020-01-01'),
    email: 'olena.p@example.com',
    password: 'hashedpass',
    isHeadTeacher: false,
  } as TeacherEntity;

  const mockTeacherRepo = {
    find: jest.fn().mockResolvedValue([mockTeacher]),
    findOne: jest.fn(),
    save: jest.fn().mockResolvedValue(mockTeacher),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  const mockQueryBuilder = {
    innerJoin: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    distinct: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockStudentRepo = {
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  const mockSubjectRepo = {
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeacherService,
        { provide: getRepositoryToken(TeacherEntity), useValue: mockTeacherRepo },
        { provide: getRepositoryToken(StudentEntity), useValue: mockStudentRepo },
        { provide: getRepositoryToken(SubjectEntity), useValue: mockSubjectRepo },
      ],
    }).compile();

    service = module.get<TeacherService>(TeacherService);
    teacherRepo = module.get(getRepositoryToken(TeacherEntity));
    studentRepo = module.get(getRepositoryToken(StudentEntity));
    subjectRepo = module.get(getRepositoryToken(SubjectEntity));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns all teachers', async () => {
    const result = await service.getAllTeachers();
    expect(result).toHaveLength(1);
    expect(teacherRepo.find).toHaveBeenCalled();
  });

});
