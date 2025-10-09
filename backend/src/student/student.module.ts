import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentContoller } from 'src/student/student.controller';
import { StudentEntity } from 'src/student/student.entity';
import { StudentService } from 'src/student/student.service';

@Module({
  imports: [TypeOrmModule.forFeature([StudentEntity])],
  controllers: [StudentContoller],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
