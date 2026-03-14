import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { QuestionsService } from "./questions.service";
import { SuccessMessage } from "src/common/interceptors/success-message.decorator";
import { Roles } from "src/auth/guards/roles.decorator";
import { UserRole } from "src/users/enum/user-role.enum";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { JwtAccessGuard } from "src/auth/guards/jwt-access.guard";
import { UpdateQuestionDto } from "./dto/update-question.dto";
import { RolesGuard } from "src/auth/guards/role.guard";

@Controller('questions')
@UseGuards(JwtAccessGuard)
export class QuestionsController {
    constructor(private questionsService: QuestionsService) { };

    @Post()
    @SuccessMessage('Create question successfully')
    @Roles(UserRole.TEACHER)
    async create(@Body() dto: CreateQuestionDto) {
        return await this.questionsService.create(dto);
    }

    @Patch(':id')
    @SuccessMessage('Update question successfully')
    @Roles(UserRole.TEACHER)
    async update(
        @Body() dto: UpdateQuestionDto,
        @Param('id', ParseIntPipe) id: number
    ) {
        return await this.questionsService.update(dto, id);
    }

    @Delete(':id')
    @SuccessMessage('Delete question successfully')
    @Roles(UserRole.TEACHER)
    @UseGuards(RolesGuard)
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.questionsService.delete(id);
    }
}