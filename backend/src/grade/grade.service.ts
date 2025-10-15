import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {GradeEntity} from "./grade.entity";
import {Repository} from "typeorm";
import {GradeResponseDto} from "./dto/gradeResponse.dto";
import {CreateGradeDto} from "./dto/createGrade.dto";
import {UpdateGradeDto} from "./dto/updateGradeDto";

@Injectable()
export class GradeService {
    constructor(
        @InjectRepository(GradeEntity)
        private readonly gradeRepository: Repository<GradeEntity>,
    ) {}


    async getGradesByStudent(
        studentId: number,
        year: number,
        semester: number): Promise<GradeEntity[]> {
        /**
        return await this.gradeRepository.find({
            where: {
                //student: { id: studentId },
                subject: {
                    studyYear: year,
                           semester: semester
                },
            },
            //relations: ['student', 'subject', 'teacher']
            relations: ['subject']
        })
            **/

        return await this.gradeRepository
            .createQueryBuilder('grade')
            .leftJoinAndSelect('grade.subject', 'subject')
            .innerJoin('subject.students', 'student')
            .where('subject.studyYear = :year', { year })
            .andWhere('subject.semester = :semester', { semester })
            .andWhere('student.id = :studentId', { studentId })
            .getMany();
    }


    async getGradesByTeacher(
        teacherId: number,
        year: number,
        semester: number
    ): Promise<GradeEntity[]> {
        /**
        return await this.gradeRepository.find({
            where:
                {
                    //  teacher: {id: teacherId }, // TODO: add checking with teacher's id in Subject
            subject: {studyYear: year,
                     semester: semester }
            },
            relations: ['student', 'subject', 'teacher']
        })
            **/
        return await this.gradeRepository
            .createQueryBuilder('grade')
            .leftJoinAndSelect('grade.subject', 'subject')
            .innerJoin('subject.teacher', 'teacher')
            .where('subject.studyYear = :year', { year })
            .andWhere('subject.semester = :semester', { semester })
            .andWhere('teacher.id = :teacherId', { teacherId })
            .getMany();
    }


    /**
     *
     * @param createGradeDto
     */
    async setGrade(
        createGradeDto: CreateGradeDto,
    ): Promise<GradeResponseDto> {
        const newGrade = this.gradeRepository.create( {
            //student: { id: createGradeDto.studentId },
            subject: { id: createGradeDto.subjectId },
            //teacher: { id: createGradeDto.teacherId },
            value: createGradeDto.value,
        })

        const savedGrade = await this.gradeRepository.save(newGrade);
        return this.toGradeResponseDto(savedGrade);
    }

    /**
     *
     * @param gradeId
     * @param updateGradeDto
     */
    async updateGrade(
        gradeId: number,
        updateGradeDto: UpdateGradeDto,
    ): Promise<GradeEntity> {
        const grade = await this.gradeRepository.findOneBy({ id: gradeId });
        if (!grade)
            throw new NotFoundException(`Grade with id ${gradeId} not found`);

        // update the value of the found grade
        grade.value = updateGradeDto.value;
        return await this.gradeRepository.save(grade);
    }


    toGradeResponseDto(
        grade: GradeEntity
    ): GradeResponseDto {

        return {
            id: grade.id,
            /**
            student: {
                id: grade.student.id,
                firstName: grade.student.firstName,
                lastName: grade.student.lastName,
                phone: grade.student.phone,
                parentPhone: grade.student.parentPhone,
                address: grade.student.address,
                startStudyDate: grade.student.startStudyDate,
                email: grade.student.email,
                token: '',
            },
                **/

            subject: {
                id: grade.subject.id,
                name: grade.subject.name,
            },
            /**
            teacher: {
                id: grade.teacher.id,
                lastName: grade.teacher.lastName,
                phone: grade.teacher.phone,
                email: grade.teacher.email,
                token: '',
            },
                **/

            value: grade.value,
        };
    }
}