import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateQuestionDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    content!: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString({ each: true })
    answersJson!: string[];

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    correctAnswer!: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    explanation!: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    topicId!: number;
}