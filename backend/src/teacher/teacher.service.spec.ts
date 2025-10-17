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

  it('creates a new teacher when email is unique', async () => {
    jest.spyOn(service, 'findTeacherByEmail').mockResolvedValue(undefined);
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
    expect(teacherRepo.delete).toHaveBeenCalledWith(1);
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
});
