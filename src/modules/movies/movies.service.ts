import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from './schema/movie.schema';
import { RedisService } from '../../common/database/cache.service';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    private readonly redisService: RedisService, // Inject RedisService
  ) {}

  private getRedisKey(id: number): string {
    return `movie:${id}`;
  }

  async create(movie: Movie): Promise<Movie> {
    const createdMovie = await this.movieModel.create(movie);

    if (!createdMovie.id) {
      console.warn(`⚠️ Created movie has no ID field!`);
      return createdMovie;
    }

    // Cache the created movie in Redis
    await this.redisService.set(
      this.getRedisKey(createdMovie.id),
      JSON.stringify(createdMovie.toObject()), // Convert to plain object
      3600,
    );

    console.log(`🟢 Movie ${createdMovie.id} stored in cache`);
    return createdMovie;
  }

  async findAll(
    page = 1,
    pageSize = 10,
    search?: string,
    filters?: Record<string, any>,
  ): Promise<any> {
    const cacheKey = `movies:page:${page}:size:${pageSize}:search:${
      search || 'none'
    }:filters:${JSON.stringify(filters)}`;

    // Check Redis cache first
    const cachedMovies = await this.redisService.get(cacheKey);
    if (cachedMovies) {
      console.log(
        `⚡ Fetching movies from cache: Page ${page}, Size ${pageSize}, Search: ${search}, Filters: ${JSON.stringify(
          filters,
        )}`,
      );
      return JSON.parse(cachedMovies);
    }

    console.log(
      `🟡 Fetching movies from database: Page ${page}, Size ${pageSize}, Search: ${search}, Filters: ${JSON.stringify(
        filters,
      )}`,
    );

    // Construct MongoDB query
    const query: any = {};

    // Apply search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } }, // Case-insensitive title search
        { description: { $regex: search, $options: 'i' } }, // Case-insensitive description search
      ];
    }

    // Apply additional filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query[key] = value;
      });
    }

    // Get total count before applying pagination
    const total = await this.movieModel.countDocuments(query);

    // Apply pagination
    const movies = await this.movieModel
      .find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const result = { data: movies, total };

    // Store in Redis
    await this.redisService.set(cacheKey, JSON.stringify(result), 3600);
    console.log(
      `🟢 Movies stored in cache: Page ${page}, Size ${pageSize}, Search: ${search}, Filters: ${JSON.stringify(
        filters,
      )}`,
    );

    return result;
  }

  async findById(id: number): Promise<Movie | null> {
    const redisKey = this.getRedisKey(id);

    // Check Redis cache first
    const cachedMovie = await this.redisService.get(redisKey);
    if (cachedMovie) {
      console.log(`⚡ Movie ${id} retrieved from cache`);
      return JSON.parse(cachedMovie);
    }

    console.log(`🟡 Movie ${id} not found in cache, fetching from database`);
    const movie = await this.movieModel.findOne({ id }).lean().exec();
    if (!movie) return null;

    // Store in Redis
    await this.redisService.set(redisKey, JSON.stringify(movie), 3600);
    console.log(`🟢 Movie ${id} stored in cache`);

    return movie;
  }

  async update(id: number, updateData: Partial<Movie>): Promise<Movie | null> {
    const updatedMovie = await this.movieModel
      .findOneAndUpdate({ id }, updateData, { new: true })
      .lean()
      .exec();

    if (updatedMovie) {
      await this.redisService.set(
        this.getRedisKey(id),
        JSON.stringify(updatedMovie),
        3600,
      );
      console.log(`🔄 Movie ${id} updated in cache`);
    }

    return updatedMovie;
  }

  async delete(id: number): Promise<Movie | null> {
    const deletedMovie = await this.movieModel
      .findOneAndDelete({ id })
      .lean()
      .exec();

    if (deletedMovie) {
      await this.redisService.delete(this.getRedisKey(id));
      console.log(`🗑️ Movie ${id} removed from cache`);
    }

    return deletedMovie;
  }
}
