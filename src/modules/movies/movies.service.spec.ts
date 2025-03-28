import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { getModelToken } from '@nestjs/mongoose';
import { RedisService } from '../../common/database/cache.service';
import { Movie } from './schema/movie.schema';
import { Model } from 'mongoose';

describe('MoviesService', () => {
  let service: MoviesService;
  let movieModel: Model<Movie>;
  let redisService: RedisService;

  beforeEach(async () => {
    const mockMovieModel = {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
      findOneAndDelete: jest.fn(),
      countDocuments: jest.fn(),
    };

    const mockRedisService = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: getModelToken(Movie.name), useValue: mockMovieModel },
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    movieModel = module.get<Model<Movie>>(getModelToken(Movie.name));
    redisService = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a movie and store it in Redis', async () => {
      const rID = Math.floor(Math.random() * 10000); // Random number between 0 and 9999
      const movieData = {
        id: rID,
        title: 'Inception',
        year: 2010,
        genre: ['Sci-Fi', 'Thriller'],
        director: 'Christopher Nolan',
        rating: 8.8,
        cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt'],
      };

      const savedMovie = { ...movieData, toObject: () => movieData };

      // Mock the database call
      jest.spyOn(movieModel, 'create').mockResolvedValue(savedMovie as any);
      jest.spyOn(redisService, 'set').mockResolvedValue(undefined);

      const result = await service.create(movieData as any);

      console.log('result: ' + JSON.stringify(result));
    });
  });

  describe('findAll', () => {
    it('should return movies from Redis if cached', async () => {
      const cachedData = JSON.stringify({
        data: [{ id: 1, title: 'Inception' }],
        total: 1,
      });
      jest.spyOn(redisService, 'get').mockResolvedValue(cachedData);

      const result = await service.findAll();

      expect(redisService.get).toHaveBeenCalledWith('movies:page:1:size:10');
      expect(result).toEqual(JSON.parse(cachedData));
    });

    it('should fetch from MongoDB if Redis cache is empty', async () => {
      const movies = [
        {
          _id: '67e5188c35c604c6774ed11f',
          id: 51,
          title: 'Movie 51',
          year: 2003,
          genre: ['Comedy', 'Adventure'],
          director: 'Director 1',
          rating: 5.5,
          cast: ['Actor 1', 'Actor 2', 'Actor 3'],
        },
      ];
      jest.spyOn(redisService, 'get').mockResolvedValue(null);
      jest.spyOn(movieModel, 'countDocuments').mockResolvedValue(100);
      jest.spyOn(movieModel, 'find').mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(movies),
      } as any);
      jest.spyOn(redisService, 'set').mockResolvedValue(undefined);

      const result = await service.findAll();

      expect(movieModel.find).toHaveBeenCalled();
      expect(result).toEqual({ data: movies, total: 100 });
    });
  });

  describe('findById', () => {
    it('should return movie from Redis if cached', async () => {
      const cachedMovie = JSON.stringify({ id: 1, title: 'Inception' });
      jest.spyOn(redisService, 'get').mockResolvedValue(cachedMovie);

      const result = await service.findById(1);

      expect(redisService.get).toHaveBeenCalledWith('movie:1');
      expect(result).toEqual(JSON.parse(cachedMovie));
    });

    it('should fetch from MongoDB if not in Redis', async () => {
      const movie = { id: 1, title: 'Inception' };
      jest.spyOn(redisService, 'get').mockResolvedValue(null);
      jest.spyOn(movieModel, 'findOne').mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(movie),
      } as any);
      jest.spyOn(redisService, 'set').mockResolvedValue(undefined);

      const result = await service.findById(1);

      expect(movieModel.findOne).toHaveBeenCalledWith({ id: 1 });
      expect(redisService.set).toHaveBeenCalledWith(
        'movie:1',
        JSON.stringify(movie),
        3600,
      );
      expect(result).toEqual(movie);
    });
  });

  describe('update', () => {
    it('should update movie in MongoDB and Redis', async () => {
      const updatedMovie = { id: 1, title: 'Inception Updated' };
      jest.spyOn(movieModel, 'findOneAndUpdate').mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(updatedMovie),
      } as any);
      jest.spyOn(redisService, 'set').mockResolvedValue(undefined);

      const result = await service.update(1, updatedMovie);

      expect(movieModel.findOneAndUpdate).toHaveBeenCalledWith(
        { id: 1 },
        updatedMovie,
        { new: true },
      );
      expect(redisService.set).toHaveBeenCalledWith(
        'movie:1',
        JSON.stringify(updatedMovie),
        3600,
      );
      expect(result).toEqual(updatedMovie);
    });
  });

  describe('delete', () => {
    it('should remove movie from MongoDB and Redis', async () => {
      const deletedMovie = { id: 1, title: 'Inception' };
      jest.spyOn(movieModel, 'findOneAndDelete').mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(deletedMovie),
      } as any);
      jest.spyOn(redisService, 'delete').mockResolvedValue(undefined);

      const result = await service.delete(1);

      expect(movieModel.findOneAndDelete).toHaveBeenCalledWith({ id: 1 });
      expect(redisService.delete).toHaveBeenCalledWith('movie:1');
      expect(result).toEqual(deletedMovie);
    });
  });

  afterEach(async () => {
    jest.clearAllMocks(); // Clears all mock calls

    // Clear Redis cache
    await redisService.delete('movies:page:1:size:10');
    await redisService.delete('movie:1');
  });
});
