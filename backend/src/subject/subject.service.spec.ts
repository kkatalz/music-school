import { Test, TestingModule } from '@nestjs/testing';
import { SubjectService } from './subject.service';
import { Repository } from 'typeorm';
import { SubjectEntity } from './subject.entity';
import { TeacherEntity } from 'src/teacher/teacher.entity';
import { StudentEntity } from 'src/student/student.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

describe('SubjectService', () => {
  let service: SubjectService;
  let subjectRepository: jest.Mocked<Repository<SubjectEntity>>;
  let teacherRepository: jest.Mocked<Repository<TeacherEntity>>;
  let studentRepository: jest.Mocked<Repository<StudentEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubjectService,
        {
          provide: getRepositoryToken(SubjectEntity),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              loadAllRelationIds: jest.fn().mockReturnThis(),
              getMany: jest.fn(),
              innerJoin: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              relation: jest.fn().mockReturnThis(),
              of: jest.fn().mockReturnThis(),
              add: jest.fn(),
              remove: jest.fn(),
              getExists: jest.fn(),
            })),
          },
        },
        {
          provide: getRepositoryToken(TeacherEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(StudentEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SubjectService>(SubjectService);
    subjectRepository = module.get(getRepositoryToken(SubjectEntity));
    teacherRepository = module.get(getRepositoryToken(TeacherEntity));
    studentRepository = module.get(getRepositoryToken(StudentEntity));
  });

  it('should return list of subjects names', async () => {
    const subjects = [{ id: 1, name: 'Piano' }, { id: 2, name: 'Violin' }];
    subjectRepository.find.mockResolvedValue(subjects as any);

    const result = await service.getSubjectsNames();

    expect(result).toEqual([
      { id: 1, name: 'Piano' },
      { id: 2, name: 'Violin' },
    ]);
  });

  it('should throw if subject already exists when creating new one', async () => {
    subjectRepository.findOne.mockResolvedValue({ id: 1 } as any);

    await expect(
      service.createSubject({
        name: 'Piano',
        semester: 1,
        studyYear: 2,
      } as any),
    ).rejects.toThrow(HttpException);
  });

  it('should create and return new subject', async () => {
    subjectRepository.findOne.mockResolvedValue(null);
    subjectRepository.save.mockResolvedValue({
      id: 1,
      name: 'Drums',
    } as any);

    const result = await service.createSubject({
      name: 'Drums',
      semester: 2,
      studyYear: 2,
    } as any);

    expect(result.name).toBe('Drums');
  });

  it('should throw if subject not found on delete', async () => {
    subjectRepository.findOne.mockResolvedValue(null);

    await expect(service.deleteSubject(1)).rejects.toThrow(HttpException);
  });

  it('should delete subject successfully', async () => {
    subjectRepository.findOne.mockResolvedValue({ id: 1 } as any);
    subjectRepository.delete.mockResolvedValue({} as any);

    const result = await service.deleteSubject(1);
    expect(result.id).toBe(1);
  });

  it('should throw when updating non-existing subject', async () => {
    subjectRepository.findOne.mockResolvedValue(null);

    await expect(service.updateSubject(1, { name: 'Updated' } as any)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update existing subject', async () => {
    const subject = { id: 1, name: 'Old Name' };
    subjectRepository.findOne.mockResolvedValue(subject as any);
    subjectRepository.save.mockResolvedValue({ ...subject, name: 'Updated' } as any);

    const result = await service.updateSubject(1, { name: 'Updated' } as any);
    expect(result.name).toBe('Updated');
  });
  
});
