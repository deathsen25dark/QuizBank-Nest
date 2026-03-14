import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateQuestionDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(80)
    content!: string;

    @IsNotEmpty()
    @IsString({ each: true }) // quy định mỗi phần tử trong mảng phải là string nhưng chưa bắt buộc phải là mảng
    @IsArray()
    @ArrayMinSize(4)
    @ArrayMaxSize(4)
    answersJson!: string[];

    @IsNotEmpty()
    @IsString()
    correctAnswer!: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(80)
    explanation!: string;

    @Type(() => Number)
    @IsNumber()
    topicId!: number;
}