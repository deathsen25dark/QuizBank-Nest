import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { TopicsService } from "./topics.service";
import { JwtAccessGuard } from "src/auth/guards/jwt-access.guard";
import { Roles } from "src/auth/guards/roles.decorator";
import { UserRole } from "src/users/enum/user-role.enum";
import { CreateTopicDto } from "./dto/create-topic.dto";
import { UpdateTopicDto } from "./dto/update-topic.dto";
import { RolesGuard } from "src/auth/guards/role.guard";
import { SuccessMessage } from "src/common/interceptors/success-message.decorator";
import { GetTopicsDto } from "./dto/get-topics.dto";
import { GetQuestionsDto } from "src/questions/dto/get-questions.dto";

@Controller('topics')
export class TopicsController {
    constructor(private topicsService: TopicsService) { };

    @Get()
    @SuccessMessage('Get all topics successfully')
    @UseGuards(JwtAccessGuard)
    async get(@Query() dto: GetTopicsDto) {
        console.log('vào get controller')
        return await this.topicsService.getTopicsByFilters(dto);
    }

    @Get(':id')
    @SuccessMessage('Get topic successfully')
    async getOne(@Param('id', ParseIntPipe) id: number) {
        return await this.topicsService.getTopicById(id);
    }

    @Get(':id/questions')
    @SuccessMessage('Get questions successfully')
    @UseGuards(JwtAccessGuard)
    async getQuestions(@Param('id', ParseIntPipe) id: number,
        @Query() dto: GetQuestionsDto) {
        console.log('id, dto:', id, dto)
        return await this.topicsService.getQuestionsByFilter(id, dto);
    }

    @Post()
    @SuccessMessage('Create topic successfully')
    @Roles(UserRole.TEACHER)
    @UseGuards(JwtAccessGuard, RolesGuard)
    async create(@Body() dto: CreateTopicDto,) {
        return await this.topicsService.create(dto);
    }

    @Patch(':id')
    @SuccessMessage('Update topic successfully')
    @Roles(UserRole.TEACHER)
    @UseGuards(JwtAccessGuard, RolesGuard)
    async update(
        @Body() dto: UpdateTopicDto,
        @Param('id', ParseIntPipe) id: number
    ) {
        return await this.topicsService.update(id, dto);
    }

    @Delete(':id')
    @SuccessMessage('Delete topic successfully')
    @Roles(UserRole.TEACHER)
    @UseGuards(JwtAccessGuard, RolesGuard)
    async delete(@Param('id', ParseIntPipe) id: number) {
        console.log('đã tới delete topics controller')
        return await this.topicsService.delete(id);
    }
}