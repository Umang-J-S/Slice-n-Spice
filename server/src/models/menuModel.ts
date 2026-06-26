import mongoose, { Schema, Document } from 'mongoose';

// 1. Category Schema
export interface ICategory extends Document {
  name: string;
  displayOrder: number;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategory>('Category', categorySchema);


// 2. Item Schema
export interface IItem extends Document {
  title: string;
  description: string;
  price: number;
  photoUrl: string;
  category: mongoose.Types.ObjectId;
  dietaryAttributes: {
    isVegetarian: boolean;
    isVegan: boolean;
    isNonVeg: boolean;
  };
}

const itemSchema = new Schema<IItem>(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    photoUrl: { type: String },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    dietaryAttributes: {
      isVegetarian: { type: Boolean, default: false },
      isVegan: { type: Boolean, default: false },
      isNonVeg: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

// Add an index on category to drastically speed up the $lookup join in /menu/full
itemSchema.index({ category: 1 });

export const Item = mongoose.model<IItem>('Item', itemSchema);


// 3. Review Schema
export interface IReview extends Document {
  item: mongoose.Types.ObjectId;
  rating: number;
  reviewText: string;
  date: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewText: { type: String },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Review = mongoose.model<IReview>('Review', reviewSchema);


// 4. Today's Special Schema
export interface ISpecial extends Document {
  item: mongoose.Types.ObjectId;
  date: Date;
  isActive: boolean;
  expiresAt?: Date;
}

const specialSchema = new Schema<ISpecial>(
  {
    item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    date: { type: Date, required: true, default: Date.now },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

export const Special = mongoose.model<ISpecial>('Special', specialSchema);
