import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { StudentEntity } from '../student/student.entity';
import { TeacherEntity } from '../teacher/teacher.entity';
import { SubjectEntity } from '../subject/subject.entity';

@Entity({ name: 'grades' })
export class GradeEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;


    @ManyToOne(() => SubjectEntity, { nullable: false })
    @JoinColumn({ name: 'subject_id' })
    subject: SubjectEntity;


    @Column({ type: 'integer', nullable: true })
    value?: number;
}
