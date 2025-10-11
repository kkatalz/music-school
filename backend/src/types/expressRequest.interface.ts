import { Request } from 'express';
import { StudentEntity } from 'src/student/student.entity';
import { TeacherEntity } from 'src/teacher/teacher.entity';

export interface AuthRequest extends Request {
  student?: StudentEntity;
  teacher?: TeacherEntity;
  headTeacher?: TeacherEntity;
}
