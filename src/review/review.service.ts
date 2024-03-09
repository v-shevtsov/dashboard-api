import { Injectable } from '@nestjs/common';
import { ReviewModel } from './review.model';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './review.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<ReviewModel>,
  ) {}

  async create(dto: CreateReviewDto): Promise<Review> {
    return this.reviewModel.create(dto);
  }

  async delete(id: string): Promise<Review | null> {
    return this.reviewModel.findByIdAndDelete(id).exec();
  }

  async getByProductId(productId: string): Promise<Review[]> {
    return this.reviewModel.find({ productId }).exec();
  }

  async deleteByProductId(productId: string) {
    return this.reviewModel
      .deleteMany({ productId: new Types.ObjectId(productId) })
      .exec();
  }
}
