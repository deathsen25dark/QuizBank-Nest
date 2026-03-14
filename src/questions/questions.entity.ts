import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  RelationId,
} from 'typeorm';
import { Topic } from '../topics/topics.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  content!: string;

  @Column({ type: 'json', name: 'answers_json' })
  answersJson!: string[];

  @Column({ name: 'correct_answer' })
  correctAnswer!: string;

  @Column({ type: 'varchar', length: 255 })
  explanation!: string;

  @ManyToOne(() => Topic, (topic) => topic.questions, { // thông báo mapping với class topic
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'topic_id' }) // cột foreign key ở bảng này, tên cột sẽ là topic_id, kiểu dữ liệu là Primary key của bảng Topic (tức là int)
  topic!: Topic;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}