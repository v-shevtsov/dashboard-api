import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

class ProductCharacteristic {
  @Prop()
  name: string;
  @Prop()
  value: string;
}

@Schema()
export class Product {
  @Prop()
  image: string;
  @Prop()
  title: string;
  @Prop()
  price: number;
  @Prop({ required: false })
  oldPrice?: number;
  @Prop()
  credit: number;
  @Prop()
  calculatedRating: number;
  @Prop()
  description: string;
  @Prop()
  advantages: string;
  @Prop()
  disAdvantages: string;
  @Prop()
  categories: string[];
  @Prop({ type: () => [String] })
  tags: string[];
  @Prop({ type: () => [ProductCharacteristic], _id: false })
  characteristics: ProductCharacteristic[];
  @Prop()
  createdAt?: Date;
  @Prop()
  updatedAt?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
