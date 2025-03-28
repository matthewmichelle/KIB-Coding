import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { getModelToken } from '@nestjs/mongoose';
import { Movie } from './schema/movie.schema';
import { RedisService } from '../../common/database/cache.service';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  const mockMovie = {
    id: 1,
    title: 'Inception',
    year: 2010,
    genre: ['Action', 'Sci-Fi'],
    director: 'Christopher Nolan',
    rating: 8.8,
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt'],
  };

  const mockMoviesService = {
    create: jest.fn().mockResolvedValue(mockMovie),
    findAll: jest.fn().mockResolvedValue([mockMovie]),
    findById: jest.fn().mockResolvedValue(mockMovie),
    update: jest
      .fn()
      .mockResolvedValue({ ...mockMovie, title: 'Updated Title' }),
    delete: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        { provide: MoviesService, useValue: mockMoviesService },
        { provide: RedisService, useValue: {} }, // Mock RedisService
        { provide: getModelToken(Movie.name), useValue: {} }, // Mock Mongoose Model
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should create a movie', async () => {
      const dto: CreateMovieDto = {
        id: 1000,
        title: 'Inception',
        year: 2010,
        genre: ['Action', 'Sci-Fi'],
        director: 'Christopher Nolan',
        rating: 8.8,
        cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt'],
      };

      expect(await controller.create(dto)).toEqual(mockMovie);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll()', () => {
    it('should return a list of movies', async () => {
      expect(await controller.findAll({ page: 1, pageSize: 10 })).toEqual([
        mockMovie,
      ]);
      expect(service.findAll).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('findById()', () => {
    it('should return a single movie by ID', async () => {
      expect(await controller.findById(1)).toEqual(mockMovie);
      expect(service.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('update()', () => {
    it('should update a movie', async () => {
      const dto: UpdateMovieDto = { title: 'Updated Title' };
      expect(await controller.update(1, dto)).toEqual({
        ...mockMovie,
        title: 'Updated Title',
      });
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('delete()', () => {
    it('should delete a movie', async () => {
      expect(await controller.delete(1)).toEqual({ deleted: true });
      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });
});
