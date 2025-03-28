import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MoviesService } from './movies.service';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ApiQueryPagination } from '../../common/decorators/pagination-header.decorator';
import { Paginate } from '../../common/decorators/pagination.decorator';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly movieService: MoviesService) {}

  @Post()
  async create(@Body() createMovieDto: CreateMovieDto) {
    return this.movieService.create(createMovieDto);
  }

  @Get()
  @ApiQueryPagination('page', 'Page number', 1)
  @ApiQueryPagination('pageSize', 'Number of items per page', 10)
  async findAll(@Paginate() pagination: { page: number; pageSize: number }) {
    const { page, pageSize } = pagination;
    return this.movieService.findAll(page, pageSize);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.movieService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.movieService.update(id, updateMovieDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.movieService.delete(id);
  }
}
