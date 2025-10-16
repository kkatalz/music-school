import * as bcrypt from 'bcrypt';
import { SubjectEntity } from '../subject/subject.entity';
import { GradeEntity } from '../grade/grade.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
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

  @ManyToMany(() => SubjectEntity, (subject) => subject.students)
  subjects?: SubjectEntity[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
