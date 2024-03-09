import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum TopLevelCategory {
  Courses,
  Services,
  Books,
  Products,
}

export class HHData {
  @Prop()
  count: number;
  @Prop()
  juniorSalary: number;
  @Prop()
  middleSalary: number;
  @Prop()
  seniorSalary: number;
}

export class TopPageAdvantage {
  @Prop()
  title: string;
  @Prop()
  description: string;
}

@Schema()
export class TopPage {
  @Prop()
  _id: string;
  @Prop({ enum: TopLevelCategory })
  firstCategory: TopLevelCategory;
  @Prop()
  secondCategory: string;
  @Prop({ unique: true })
  alias: string;
  @Prop()
  title: string;
  @Prop()
  category: string;
  @Prop({ type: () => [HHData] })
  hh?: HHData;
  @Prop({ type: () => [TopPageAdvantage] })
  advantages: TopPageAdvantage[];
  @Prop()
  seoText: string;
  @Prop()
  tagsTitle: string;
  @Prop({ type: () => [String] })
  tags: string[];
  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
}

export const TopPageSchema = SchemaFactory.createForClass(TopPage);
