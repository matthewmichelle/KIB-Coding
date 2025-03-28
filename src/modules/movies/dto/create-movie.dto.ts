import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the movie' })
  @IsInt()
  id: number;

  @ApiProperty({ example: 'Inception', description: 'Title of the movie' })
  @IsString()
  title: string;

  @ApiProperty({ example: 2010, description: 'Release year of the movie' })
  @IsInt()
  year: number;

  @ApiProperty({
    example: ['Action', 'Sci-Fi'],
    description: 'Genres of the movie',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  genre: string[];

  @ApiProperty({
    example: 'Christopher Nolan',
    description: 'Director of the movie',
  })
  @IsString()
  director: string;

  @ApiProperty({
    example: 8.8,
    description: 'Movie rating (0 - 10)',
    minimum: 0,
    maximum: 10,
  })
  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;

  @ApiProperty({
    example: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt'],
    description: 'List of main actors',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  cast: string[];
}
