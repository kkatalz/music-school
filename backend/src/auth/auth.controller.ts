import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoginUserDto } from 'src/auth/dto/loginUserDto.dto';
import { StudentResponseDto } from 'src/student/dto/studentResponse.dto';
import { TeacherResponseDto } from 'src/teacher/dto/teacherResponse.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async loginUser(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<StudentResponseDto | TeacherResponseDto> {
    return await this.authService.loginUser(loginUserDto);
  }
}
