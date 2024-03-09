import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductModel } from './product.model';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { Product } from './product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductModel>,
  ) {}

  async create(dto: CreateProductDto): Promise<ProductModel> {
    return this.productModel.create(dto);
  }

  async getById(id: string): Promise<ProductModel | null> {
    return this.productModel.findById(id).exec();
  }

  async removeById(id: string): Promise<ProductModel | null> {
    return this.productModel.findByIdAndDelete(id).exec();
  }

  async updateById(
    id: string,
    dto: CreateProductDto,
  ): Promise<ProductModel | null> {
    return this.productModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async findWithReviews(dto: FindProductDto) {
    return (await this.productModel
      .aggregate([
        {
          $match: {
            categories: dto.category,
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
        {
          $limit: dto.limit,
        },
        {
          $lookup: {
            from: 'Review',
            localField: '_id',
            foreignField: 'productId',
            as: 'reviews',
          },
        },
        {
          $addFields: {
            reviewCount: { $size: '$reviews' },
            reviewAvg: { $avg: '$reviews.rating' },
            reviews: {
              $function: {
                body: `function(reviews) {
                  reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                  return reviews;
                }`,
                args: ['$reviews'],
                lang: 'js',
              },
            },
          },
        },
      ])
      .exec()) as ProductModel & { reviewCount: number; reviewAvg: number }[];
  }
}
