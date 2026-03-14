import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Question } from "./questions.entity";
import { Repository } from "typeorm";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { TopicsService } from "src/topics/topics.service";
import { UpdateQuestionDto } from "./dto/update-question.dto";
import { GetQuestionsDto } from "./dto/get-questions.dto";

@Injectable()
export class QuestionsService {
    constructor(
        @InjectRepository(Question)
        private readonly questionsRepository: Repository<Question>,
        @Inject(forwardRef(() => TopicsService))
        private readonly topicsService: TopicsService
    ) { }

    async getByFilter(topicId: number, dto: GetQuestionsDto) {
        const { page, limit, searchByContent, sortByDate } = dto;

        const query = this.questionsRepository.createQueryBuilder('q')
            .select(['q.id', 'q.content', 'q.answersJson', 'q.correctAnswer', 'q.explanation'])
            .where('q.topic_id = :topicId', { topicId: topicId })
            .skip((page - 1) * limit)
            .take(limit);

        if (searchByContent) {
            query.andWhere('q.content LIKE :searchByContent', { searchByContent: `%${searchByContent}%` })
        }

        query.orderBy('q.created_at', sortByDate ?? 'DESC');

        const [data, total] = await query.getManyAndCount();

        console.log('data cuối', data)

        return {
            main: data,
            meta: {
                totalItems: total,
                currentPage: page,
                itemsPerPage: limit,
                totalPages: Math.ceil(total / limit),
            }
        }
    }

    async create(dto: CreateQuestionDto) {
        const topic = await this.topicsService.getTopicById(dto.topicId) // đã có check ném exception
        console.log('dto nhé:', dto)

        if (!dto.answersJson.includes(dto.correctAnswer)) {
            throw new BadRequestException('Đáp án đúng phải là một trong 4 câu trả lời')
        }

        if (dto.answersJson[0] === dto.answersJson[1] ||
            dto.answersJson[0] === dto.answersJson[2] ||
            dto.answersJson[0] === dto.answersJson[3] ||
            dto.answersJson[1] === dto.answersJson[2] ||
            dto.answersJson[1] === dto.answersJson[3] ||
            dto.answersJson[2] === dto.answersJson[3]
        ) {
            throw new BadRequestException('Các câu trả lời phải khác nhau')
        }

        const newQuestion = this.questionsRepository.create({
            content: dto.content,
            answersJson: dto.answersJson,
            correctAnswer: dto.correctAnswer,
            explanation: dto.explanation,
            topic: topic
        })

        return this.questionsRepository.save(newQuestion);
    }

    async update(dto: UpdateQuestionDto, id: number) {
        const question = await this.questionsRepository.findOne({
            where: { id },
            // relations: ['topic'],  đưa đối tượng topic thật vào question
        }); // question được lấy ra có trường topic, không phải topicId như trong dto, nếu dùng preload và ... dto sẽ lỗi

        if (!question) {
            throw new NotFoundException('Question not found for updating');
        }

        if (dto.topicId !== undefined) {
            const newTopic = await this.topicsService.getTopicById(dto.topicId);
            question.topic = newTopic;
        }

        const { topicId, ...rest } = dto;   // tách topicId ra, rest chứa tất cả thuộc tính còn lại trong dto trừ topicId

        Object.assign(question, rest);      // merge tất cả thuộc tính còn lại trong dto vào question, question lúc này đã có trường topic => question đủ trường

        return this.questionsRepository.save(question);
    }

    async delete(id: number) {
        const question = await this.questionsRepository.findOne({
            where: { id: id },
            // relations: ['topic'],
        });

        if (!question) {
            throw new NotFoundException('Question not found for deleting');
        }

        await this.questionsRepository.remove(question);

        return null;
    }
}