import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { SortOption } from 'src/common/enum/sort-option.enum';

export class GetTopicsDto {
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page: number = 1;

    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit: number = 10;

    @IsOptional()
    @IsString()
    searchByName?: string;

    @IsOptional()
    @IsEnum(SortOption)
    sortByDate?: SortOption;
}