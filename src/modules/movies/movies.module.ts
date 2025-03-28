import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { DatabaseModule } from '../../common/database/database.module';
import { MovieSchema, Movie } from './schema/movie.schema';
import { RedisService } from '../../common/database/cache.service';

@Module({
  imports: [
    DatabaseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
  ],
  controllers: [MoviesController],
  providers: [MoviesService, RedisService],
})
export class MoviesModule {}
