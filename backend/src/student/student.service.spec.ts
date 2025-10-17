import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentEntity } from './student.entity';
import { SubjectEntity } from '../subject/subject.entity';
import { TeacherEntity } from '../teacher/teacher.entity';
import { Repository } from 'typeorm';
import { Role } from '../auth/types/role.enum';

describe('StudentService', () => {
  let service: StudentService;
  let studentRepository: Repository<StudentEntity>;
  let subjectRepository: Repository<SubjectEntity>;
  let teacherRepository: Repository<TeacherEntity>;

  const mockStudent = { 
    id: 1,
    firstName: 'Maryna',
    lastName: 'Melnyk',
    email: 'marynamlnk@example.com',
    phone: '+380991234567',
    parentPhone: '+380997654321',
    address: 'Lutsk, Shevchenko St. 1',
    startStudyDate: new Date('2020-09-01'),
    subjects: [],
    password: 'hashedpassword',
    hashPassword: jest.fn(),
   } as unknown as StudentEntity;

  const mockStudentRepository = { 
    findOne: jest.fn(),
    findOneOrFail: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
   };

  const mockSubjectRepository = { 
    createQueryBuilder: jest.fn(),
   };

  const mockTeacherRepository = { 
    createQueryBuilder: jest.fn(),
   };

  beforeEach(async () => {
    process.env.JWT_SECRET = 'test-secret-key';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        { provide: getRepositoryToken(StudentEntity), useValue: mockStudentRepository },
        { provide: getRepositoryToken(SubjectEntity), useValue: mockSubjectRepository },
        { provide: getRepositoryToken(TeacherEntity), useValue: mockTeacherRepository },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
    studentRepository = module.get(getRepositoryToken(StudentEntity));
    subjectRepository = module.get(getRepositoryToken(SubjectEntity));
    teacherRepository = module.get(getRepositoryToken(TeacherEntity));

    jest.clearAllMocks();
  });

  describe('createStudent', () => {
    it('should create a new student', async () => {
      const createDto = {
        firstName: 'Maryna',
        lastName: 'Melnyk',
        email: 'marynamlnk@example.com',
        phone: '+380991111111',
        parentPhone: '+380992222222',
        address: 'Kyiv',
        startStudyDate: new Date('2023-09-01'),
        password: 'password123',
      };

      mockStudentRepository.findOne.mockResolvedValue(null);
      mockStudentRepository.save.mockResolvedValue({
        id: 2,
        ...createDto,
      });

      const result = await service.createStudent(createDto);

      expect(result).toHaveProperty('id', 2);
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('role', Role.Student);
      expect(mockStudentRepository.save).toHaveBeenCalled();
    });

    it('should throw an error if email is already taken', async () => {
      const createDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+380991234567',
        parentPhone: '+380997654321',
        address: 'Lviv',
        startStudyDate: new Date('2023-09-01'),
        password: 'password123',
      };

      mockStudentRepository.findOne.mockResolvedValue(mockStudent);

      await expect(service.createStudent(createDto)).rejects.toThrow(
        HttpException,
      );
      await expect(service.createStudent(createDto)).rejects.toThrow(
        'Email is already taken',
      );
    });
   });

   describe('updateStudent', () => {
    it('should update student data', async () => {
      const updateDto = {
        firstName: 'John',
        lastName: 'Johnson',
      };

      mockStudentRepository.findOne.mockResolvedValue(mockStudent);
      mockStudentRepository.save.mockResolvedValue({
        ...mockStudent,
        ...updateDto,
      });

      const result = await service.updateStudent(1, updateDto);

      expect(result.lastName).toBe('Johnson');
      expect(mockStudentRepository.save).toHaveBeenCalled();
    });

    it('should throw an error if student is not found', async () => {
      mockStudentRepository.findOne.mockResolvedValue(null);

      await expect(service.updateStudent(999, {})).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('deleteStudent', () => {
    it('should delete a student', async () => {
      mockStudentRepository.findOne.mockResolvedValue(mockStudent);
      mockStudentRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.deleteStudent(1);

      expect(result).toHaveProperty('id', 1);
      expect(mockStudentRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('getStudentInfo', () => {
    it('should return student information with subjects', async () => {
      mockStudentRepository.findOne.mockResolvedValue(mockStudent);
      mockStudentRepository.findOneOrFail.mockResolvedValue({
        ...mockStudent,
        subjects: [{ id: 1, name: 'Mathematics' }],
      });

      const result = await service.getStudentInfo(1);

      expect(result).toHaveProperty('subjects');
      expect(mockStudentRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['subjects'],
      });
    });
  });

});
