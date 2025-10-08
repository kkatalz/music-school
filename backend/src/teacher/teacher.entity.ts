import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'teachers' })
export class TeacherEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
}
