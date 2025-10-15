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

    @ManyToOne(() => StudentEntity, { nullable: false })
    @JoinColumn({ name: 'student_id' })
    student: StudentEntity;

    @ManyToOne(() => SubjectEntity, { nullable: false })
    @JoinColumn({ name: 'subject_id' })
    subject: SubjectEntity;

    @ManyToOne(() => TeacherEntity, { nullable: false })
    @JoinColumn({ name: 'teacher_id' })
    teacher: TeacherEntity;

    @Column({ type: 'integer', nullable: true })
    value?: number;
}
