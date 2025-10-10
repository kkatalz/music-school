import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectController } from 'src/subject/subject.controller';
import { SubjectEntity } from 'src/subject/subject.entity';
import { SubjectService } from 'src/subject/subject.service';
import { TeacherEntity } from 'src/teacher/teacher.entity';
import { StudentEntity } from 'src/student/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubjectEntity, TeacherEntity, StudentEntity])],
  controllers: [SubjectController],
  providers: [SubjectService],
  exports: [SubjectService],
})
export class SubjectModule {}
