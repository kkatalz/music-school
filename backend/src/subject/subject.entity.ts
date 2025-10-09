import { StudentEntity } from '../student/student.entity';
import { TeacherEntity } from '../teacher/teacher.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'subjects' })
export class SubjectEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => TeacherEntity, (teacher) => teacher.subjects)
  @JoinTable()
  teachers?: TeacherEntity[];

  @ManyToMany(() => StudentEntity, (student) => student.subjects)
  @JoinTable()
  students?: StudentEntity[];
}
