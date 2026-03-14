import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Question } from "./questions.entity";
import { QuestionsController } from "./questions.controller";
import { QuestionsService } from "./questions.service";
import { TopicsModule } from "src/topics/topics.module";

@Module({
    imports: [TypeOrmModule.forFeature([Question]), forwardRef(() => TopicsModule)],
    controllers: [QuestionsController],
    providers: [QuestionsService],
    exports: [QuestionsService]
})
export class QuestionsModule{}