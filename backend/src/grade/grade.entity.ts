import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubjectEntity } from '../subject/subject.entity';
import { StudentEntity } from '../student/student.entity';
import { TeacherEntity } from '../teacher/teacher.entity';

@Entity({ name: 'grades' })
export class GradeEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'integer', nullable: true })
  value?: number;

  @ManyToOne(() => SubjectEntity)
  @JoinColumn({ name: 'subject_id' })
  subject?: SubjectEntity;

  @ManyToOne(() => StudentEntity, (student) => student.grades)
  @JoinColumn({ name: 'student_id' })
  student?: StudentEntity;

  @ManyToOne(() => TeacherEntity, (teacher) => teacher.grades)
  @JoinColumn({ name: 'teacher_id' })
  teacher?: TeacherEntity;
}
