import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GradeController } from './grade.controller';
import { GradeEntity } from './grade.entity';
import { GradeService } from './grade.service';
import { SubjectEntity } from 'src/subject/subject.entity';
import { StudentEntity } from 'src/student/student.entity';
import { TeacherEntity } from 'src/teacher/teacher.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GradeEntity,
      SubjectEntity,
      StudentEntity,
      TeacherEntity,
    ]),
  ],
  controllers: [GradeController],
  providers: [GradeService],
  exports: [GradeService],
})
export class GradeModule {}
