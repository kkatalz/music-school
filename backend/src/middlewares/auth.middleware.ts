import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { Role } from 'src/auth/types/role.enum';
import { StudentEntity } from 'src/student/student.entity';
import { StudentService } from 'src/student/student.service';
import { TeacherEntity } from 'src/teacher/teacher.entity';
import { TeacherService } from 'src/teacher/teacher.service';
import { AuthRequest } from 'src/types/expressRequest.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly studentService: StudentService,
    private readonly teacherService: TeacherService,
  ) {}

  async use(req: AuthRequest, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];
    try {
      const decode = verify(token, process.env.JWT_SECRET ?? 'test') as {
        role: Role;
        id: number;
      };
      const role = decode.role;
      const id = decode.id;
      let student: StudentEntity | undefined = undefined;
      let teacher: TeacherEntity | undefined = undefined;
      let headTeacher: TeacherEntity | undefined = undefined;

      switch (role) {
        case Role.Student:
          student = await this.studentService.findStudentById(id);
          break;
        case Role.Teacher:
          teacher = await this.teacherService.findTeacherById(id);
          break;
        case Role.HeadTeacher:
          headTeacher = await this.teacherService.findTeacherById(id);
          break;
        default:
          break;
      }

      req.student = student;
      req.teacher = teacher;
      req.headTeacher = headTeacher;

      next();
    } catch (err) {
      next();
    }
  }
}
