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
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
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
    
   });
});
