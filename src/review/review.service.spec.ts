import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { getModelToken } from '@nestjs/mongoose';
import { Review } from './review.schema';
import { Types } from 'mongoose';

describe('ReviewService', () => {
  let service: ReviewService;

  const exec = { exec: jest.fn() };
  const reviewRepositoryMockFactory = () => ({
    find: () => exec,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        {
          useFactory: reviewRepositoryMockFactory,
          provide: getModelToken(Review.name),
        },
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getByProductId working', async () => {
    const id = new Types.ObjectId().toHexString();
    reviewRepositoryMockFactory()
      .find()
      .exec.mockReturnValueOnce([{ productId: id }]);
    const result = await service.getByProductId(id);
    expect(result[0].productId).toEqual(id);
  });
});
