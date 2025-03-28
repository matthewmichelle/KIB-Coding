import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema({ timestamps: true })
export class Movie {
  @Prop({ required: true, unique: true })
  id: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  year: number;

  @Prop({ type: [String], required: true })
  genre: string[];

  @Prop({ required: true })
  director: string;

  @Prop({ required: true, min: 0, max: 10, default: 0 })
  rating: number;

  @Prop({ type: [String], required: true })
  cast: string[];
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
