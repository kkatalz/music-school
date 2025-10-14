import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GradeEntity } from './grade.entity';
import { GradeService } from './grade.service';
import { GradeController } from './grade.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([GradeEntity])],
    controllers: [GradeController],
    providers: [GradeService],
    exports: [GradeService],
})
export class GradeModule {}