import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateTopicDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    description!: string;
}