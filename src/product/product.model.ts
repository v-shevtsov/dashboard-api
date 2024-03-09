class ProductCharacteristic {
  name: string;
  value: string;
}

export class ProductModel {
  image: string;
  title: string;
  price: number;
  oldPrice?: number;
  credit: number;
  description: string;
  advantages: string;
  disAdvantages: string;
  categories: string[];
  tags: string[];
  characteristics: ProductCharacteristic[];
  createdAt?: Date;
  updatedAt?: Date;
}
