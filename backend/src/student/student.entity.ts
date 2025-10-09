import { SubjectEntity } from '../subject/subject.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'students' })
export class StudentEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  phone: string;

  @Column({ name: 'parent_phone' })
  parentPhone: string;

  @Column()
  address: string;

  @Column({
    name: 'start_study_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  startStudyDate: Date;

  @Column()
  email: string;

  @Column()
  password: string;

  @ManyToMany(() => SubjectEntity)
  @JoinTable()
  subjects: SubjectEntity[];
}
