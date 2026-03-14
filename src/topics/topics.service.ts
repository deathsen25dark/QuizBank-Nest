import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Topic } from "./topics.entity";
import { CreateTopicDto } from "./dto/create-topic.dto";
import { UpdateTopicDto } from "./dto/update-topic.dto";
import { GetTopicsDto } from "./dto/get-topics.dto";
import { GetQuestionsDto } from "src/questions/dto/get-questions.dto";
import { QuestionsService } from "src/questions/questions.service";

@Injectable()
export class TopicsService {
    constructor(
        @InjectRepository(Topic)
        private readonly topicsRepository: Repository<Topic>,
        @Inject(forwardRef(() => QuestionsService))
        private questionsService: QuestionsService
    ) { }

    async getTopicsByFilters(dto: GetTopicsDto) {
        const { page, limit, searchByName, sortByDate} = dto;

        const query = this.topicsRepository
                        .createQueryBuilder('t')
                        .select(['t.id', 't.name', 't.description'])
                        .skip((page - 1) * limit)
                        .take(limit);

        if (searchByName) {
            query.andWhere('t.name LIKE :searchByName', { searchByName: `%${searchByName}%`})
        }

        query.orderBy('t.created_at', sortByDate ?? 'DESC')

        const [data, total] = await query.getManyAndCount();

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

    async getTopicById(id: number) {
        const topic = await this.topicsRepository.findOne({
            where: { id: id }
        })

        if (!topic){
            throw new NotFoundException(`Topic not found`)
        }

        return topic;
    }

    async create(dto: CreateTopicDto) {
        const existedNameTopic = await this.topicsRepository.findOne({
            where: { name: dto.name}
        })
        
        if (existedNameTopic) {
            throw new ConflictException('Topic name has been used')
        }

        const newTopic = this.topicsRepository.create({
            name: dto.name,
            description: dto.description
        })

        return this.topicsRepository.save(newTopic);
    }

    async update(id: number, dto: UpdateTopicDto) {
        const existedNameTopic = await this.topicsRepository.findOne({
            where: { name: dto.name}
        })
        
        if (existedNameTopic) {
            throw new ConflictException('Topic name has been used')
        }

        const newTopic = await this.topicsRepository.preload({
            id: id,
            ...dto
        })

        if (!newTopic) {
            throw new NotFoundException('Topic not found for updating');
        }

        return this.topicsRepository.save(newTopic);
    }

    async delete(id: number) {
        console.log('đã tới delete topics service ')
        const topic = await this.topicsRepository.findOneBy({ id });

        if (!topic) {
            throw new NotFoundException("Topic not found for deleting");
        }

        await this.topicsRepository.remove(topic);

        return null;
    }

    async getQuestionsByFilter(topicId: number, dto: GetQuestionsDto){
        return await this.questionsService.getByFilter(topicId, dto);
    }

    // async update(id: number, dto: UpdateTopicDto) {
    //     const result = await this.topicsRepository.update(id, dto);

    //     if (result.affected === 0) {
    //         throw new NotFoundException('Topic not found');
    //     }

    //     return this.topicsRepository.findOneBy({ id });
    // }

    // async delete(id: number) {
    //     const result = await this.topicsRepository.delete(id);

    //     if (result.affected === 0) {
    //         throw new NotFoundException('Topic not found');
    //     }

    //     return {
    //         message: 'Topic deleted successfully',
    //     };
    // }
}