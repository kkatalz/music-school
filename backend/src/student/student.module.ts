import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GradeEntity } from 'src/grade/grade.entity';
import { StudentContoller } from 'src/student/student.controller';
import { StudentEntity } from 'src/student/student.entity';
import { StudentService } from 'src/student/student.service';
import { SubjectEntity } from 'src/subject/subject.entity';
import { TeacherEntity } from 'src/teacher/teacher.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudentEntity,
      SubjectEntity,
      TeacherEntity,
      GradeEntity,
    ]),
  ],
  controllers: [StudentContoller],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
