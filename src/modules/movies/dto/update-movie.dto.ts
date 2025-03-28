import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateMovieDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Unique identifier for the movie',
  })
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiPropertyOptional({
    example: 'Inception',
    description: 'Title of the movie',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: 2010,
    description: 'Release year of the movie',
  })
  @IsOptional()
  @IsInt()
  year?: number;

  @ApiPropertyOptional({
    example: ['Action', 'Sci-Fi'],
    description: 'Genres of the movie',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genre?: string[];

  @ApiPropertyOptional({
    example: 'Christopher Nolan',
    description: 'Director of the movie',
  })
  @IsOptional()
  @IsString()
  director?: string;

  @ApiPropertyOptional({
    example: 8.8,
    description: 'Movie rating (0 - 10)',
    minimum: 0,
    maximum: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  rating?: number;

  @ApiPropertyOptional({
    example: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt'],
    description: 'List of main actors',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cast?: string[];
}
