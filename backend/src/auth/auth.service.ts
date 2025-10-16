import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { LoginUserDto } from 'src/auth/dto/loginUserDto.dto';
import { Role } from 'src/auth/types/role.enum';
import { StudentResponseDto } from 'src/student/dto/studentResponse.dto';
import { StudentEntity } from 'src/student/student.entity';
import { TeacherResponseDto } from 'src/teacher/dto/teacherResponse.dto';
import { TeacherEntity } from 'src/teacher/teacher.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(TeacherEntity)
    private readonly teacherRepository: Repository<TeacherEntity>,
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
  ) {}

  async loginUser(
    loginUserDto: LoginUserDto,
  ): Promise<StudentResponseDto | TeacherResponseDto> {
    let student;
    const teacher = await this.teacherRepository.findOne({
      where: {
        email: loginUserDto.email,
      },
    });

    if (!teacher) {
      student = await this.studentRepository.findOne({
        where: {
          email: loginUserDto.email,
        },
      });
    }

    const user = teacher ? teacher : student;
    if (!user)
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);

    const matchPassword = await compare(loginUserDto.password, user.password);

    if (!matchPassword)
      throw new HttpException(
        'Wrong email or password',
        HttpStatus.UNAUTHORIZED,
      );

    return this.generateUserResponse(user);
  }

  generateToken(user: TeacherEntity | StudentEntity, role: Role): string {
    return sign(
      {
        id: user.id,
        email: user.email,
        role,
      },
      process.env.JWT_SECRET ?? 'test',
    );
  }

  generateUserResponse(
    user: TeacherEntity | StudentEntity,
  ): StudentResponseDto | TeacherResponseDto {
    if (user instanceof TeacherEntity) {
      const teacher = user as TeacherEntity;
      const role = teacher.isHeadTeacher ? Role.HeadTeacher : Role.Teacher;
      return {
        id: teacher.id,
        lastName: teacher.lastName,
        phone: teacher.phone,
        email: teacher.email,
        token: this.generateToken(teacher, Role.Teacher),
        isHeadTeacher: teacher.isHeadTeacher,
        role,
      };
    } else {
      const student = user as StudentEntity;
      return {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        phone: student.phone,
        parentPhone: student.parentPhone,
        address: student.address,
        startStudyDate: student.startStudyDate,
        email: student.email,
        token: this.generateToken(student, Role.Student),
        role: Role.Student,
      };
    }
  }
}
