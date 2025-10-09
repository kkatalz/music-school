import { Controller, Param, Post } from '@nestjs/common';
import { StudentService } from 'src/student/student.service';

@Controller('students')
export class StudentContoller {
  constructor(private readonly studentService: StudentService) {}
}
