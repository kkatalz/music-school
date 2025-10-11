import * as bcrypt from 'bcrypt';

import { SubjectEntity } from '../subject/subject.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'teachers' })
export class TeacherEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  phone: string;

  @Column()
  education?: string;

  @Column({
    name: 'start_work_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  startWorkDate: Date;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ name: 'is_head_teacher', default: false })
  isHeadTeacher: boolean;

  @ManyToMany(() => SubjectEntity, (subject) => subject.teachers)
  subjects?: SubjectEntity[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
