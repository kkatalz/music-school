import { StudentResponseDto } from '../../student/dto/studentResponse.dto';
import { TeacherResponseDto } from '../../teacher/dto/teacherResponse.dto';
import { SubjectsNamesResponseDto } from '../../subject/dto/subjectsNamesResponse.dto';
import { StudentFirstLastNamesResponse } from 'src/student/dto/studentFirstLastNamesResponse.dto';
import { TeacherFirstLastNamesResponse } from 'src/teacher/dto/teacherFirstLastNamesResponse.dto';

export class GradeResponseDto {
  id: number;
  subject?: SubjectsNamesResponseDto;
  student: StudentFirstLastNamesResponse;
  teacher: TeacherFirstLastNamesResponse;

  value?: number;
}
