import { StudentResponseDto} from "../../student/dto/studentResponse.dto";
import { TeacherResponseDto} from "../../teacher/dto/teacherResponse.dto";
import { SubjectsNamesResponseDto} from "../../subject/dto/subjectsNamesResponse.dto";

export class GradeResponseDto {
    id: number;
    //student: StudentResponseDto;
    subject: SubjectsNamesResponseDto;
    //teacher: TeacherResponseDto;

    value?: number;
}