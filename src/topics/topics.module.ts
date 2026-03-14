import { forwardRef, Module } from "@nestjs/common";
import { TopicsController } from "./topics.controller";
import { TopicsService } from "./topics.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Topic } from "./topics.entity";
import { QuestionsModule } from "src/questions/questions.module";

@Module({
    imports: [TypeOrmModule.forFeature([Topic]), forwardRef(() => QuestionsModule)],
    controllers: [TopicsController],
    providers: [TopicsService],
    exports: [TopicsService]
})
export class TopicsModule{};