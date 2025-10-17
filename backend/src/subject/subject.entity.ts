import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GradeEntity } from '../grade/grade.entity';
import { StudentEntity } from '../student/student.entity';
import { TeacherEntity } from '../teacher/teacher.entity';

@Entity({ name: 'subjects' })
export class SubjectEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column({ name: 'study_year' })
  studyYear: number;

  @Column()
  semester: number;

  @ManyToMany(() => TeacherEntity, (teacher) => teacher.subjects)
  @JoinTable()
  teachers?: TeacherEntity[];

  @ManyToMany(() => StudentEntity, (student) => student.subjects)
  @JoinTable()
  students?: StudentEntity[];

  @OneToMany(() => GradeEntity, (grade) => grade.subject)
  grades?: GradeEntity[];
}
