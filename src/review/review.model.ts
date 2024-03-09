import { Types } from 'mongoose';

export class ReviewModel {
  _id: Types.ObjectId;
  name: string;
  title: string;
  description: string;
  rating: number;
  createdAt: Date;
  updatedAt?: Date;
  productId: Types.ObjectId;
}
