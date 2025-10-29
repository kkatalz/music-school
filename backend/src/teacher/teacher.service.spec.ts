import { Test, TestingModule } from '@nestjs/testing';
import { TeacherService } from './teacher.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TeacherEntity } from './teacher.entity';
import { StudentEntity } from '../student/student.entity';
import { SubjectEntity } from '../subject/subject.entity';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { DataSource } from 'typeorm';

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
    leftJoinAndSelect: jest.fn().mockReturnThis(),
  };

  const mockStudentRepo = {
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
    find: jest.fn().mockResolvedValue([]),
  };

  const mockSubjectRepo = {
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue({
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      save: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({
        delete: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({ affected: 1 }),
      }),
    },
    }),
    transaction: jest.fn().mockImplementation(async (callback) => {
      const mockManager = {
        createQueryBuilder: jest.fn().mockReturnValue({
          innerJoin: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          getRawMany: jest.fn().mockResolvedValue([]),
          delete: jest.fn().mockReturnThis(),
          from: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          execute: jest.fn().mockResolvedValue({ affected: 1 }),
        }),
        delete: jest.fn().mockResolvedValue({ affected: 1 }),
      };
      return await callback(mockManager);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeacherService,
        { provide: getRepositoryToken(TeacherEntity), useValue: mockTeacherRepo },
        { provide: getRepositoryToken(StudentEntity), useValue: mockStudentRepo },
        { provide: getRepositoryToken(SubjectEntity), useValue: mockSubjectRepo },
        { provide: DataSource, useValue: mockDataSource },
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

  it('creates a new teacher when email is unique', async () => {
    jest.spyOn(service, 'findTeacherByEmail').mockResolvedValue(undefined);
  mockStudentRepo.find.mockResolvedValue([]);
    const dto = { ...mockTeacher, email: 'new@example.com' };
    const result = await service.createTeacher(dto);
    expect(result.email).toBe(mockTeacher.email);
    expect(teacherRepo.save).toHaveBeenCalled();
  });

  it('throws an error when email already exists', async () => {
    jest
      .spyOn(service, 'findTeacherByEmail')
      .mockRejectedValue(new HttpException('Email is already taken', HttpStatus.UNPROCESSABLE_ENTITY));

    await expect(service.createTeacher(mockTeacher)).rejects.toThrow(HttpException);
  });

  it('deletes a teacher (not self)', async () => {
    jest.spyOn(service, 'findTeacherById').mockResolvedValue(mockTeacher);
  
    const result = await service.deleteTeacher(1, 2);
    
    expect(result.email).toBe(mockTeacher.email);
    expect(mockDataSource.transaction).toHaveBeenCalled();
  });

  it('throws an error when trying to delete self', async () => {
    jest.spyOn(service, 'findTeacherById').mockResolvedValue(mockTeacher);
    await expect(service.deleteTeacher(1, 1)).rejects.toThrow(HttpException);
  });

  it('calculates teacher experience in months', async () => {
    jest.spyOn(service, 'findTeacherById').mockResolvedValue(mockTeacher);
    const months = await service.calculateExperience(1);
    expect(typeof months).toBe('number');
    expect(months).toBeGreaterThan(0);
  });

  it('throws an error if teacher with given email already exists', async () => {
    (teacherRepo.findOne as jest.Mock).mockResolvedValue(mockTeacher);
    await expect(service.findTeacherByEmail('teacher@example.com')).rejects.toThrow(HttpException);
  });

  it('returns teacher if found by id', async () => {
    (teacherRepo.findOne as jest.Mock).mockResolvedValue(mockTeacher);
    const result = await service.findTeacherById(1);
    expect(result).toBe(mockTeacher);
  });

  it('throws an error if teacher not found by id', async () => {
    (teacherRepo.findOne as jest.Mock).mockResolvedValue(null);
    await expect(service.findTeacherById(999)).rejects.toThrow(HttpException);
  });

  it('returns students for a given teacher', async () => {
    mockQueryBuilder.getMany.mockResolvedValue([{ id: 1, firstName: 'Student' }]);
    const result = await service.getMyStudents(1, 2023, 1);
    expect(result).toHaveLength(1);
    expect(studentRepo.createQueryBuilder).toHaveBeenCalledWith('student');
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(2);
  });

  it('returns subjects for a given teacher', async () => {
    mockQueryBuilder.getMany.mockResolvedValue([{ id: 5, name: 'Piano' }]);
    const result = await service.getMySubjects(1, 2023, 2);
    expect(result).toHaveLength(1);
    expect(subjectRepo.createQueryBuilder).toHaveBeenCalledWith('subject');
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(2);
  });

});
