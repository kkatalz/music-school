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

@Module({
  imports: [TypeOrmModule.forFeature([TeacherEntity])],
  controllers: [TeacherController],
  providers: [TeacherService],
  exports: [TeacherService],
})
export class TeacherModule {}
