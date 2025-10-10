import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherEntity } from 'src/teacher/teacher.entity';
import { TeacherController } from './teacher.controller';
import { TeacherService } from 'src/teacher/teacher.service';
import { StudentEntity } from 'src/student/student.entity';
import { SubjectEntity } from 'src/subject/subject.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeacherEntity, StudentEntity, SubjectEntity]),
  ],
  controllers: [TeacherController],
  providers: [TeacherService],
  exports: [TeacherService],
})
export class TeacherModule {}
