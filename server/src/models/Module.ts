import { Schema, model } from 'mongoose';

const reviewSchema = new Schema({
  name: { type: String, required: true },
  avatar: { type: String, required: true },
  stars: { type: Number, required: true },
  text: { type: String, required: true },
  date: { type: String, required: true }
});

const keySpecSchema = new Schema({
  label: { type: String, required: true },
  value: { type: String, required: true }
});

const moduleSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  gradient: { type: String, required: true },
  iconName: { type: String, required: true },
  iconColor: { type: String, required: true },
  iconBg: { type: String, required: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  detailedDesc: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: String, required: true },
  priceValue: { type: Number, required: true },
  dateAdded: { type: String, required: true },
  location: { type: String, required: true },
  timeEstimate: { type: String, required: true },
  rating: { type: Number, required: true },
  reviews: { type: Number, required: true },
  href: { type: String, required: true },
  keySpecs: [keySpecSchema],
  reviewsList: [reviewSchema],
  images: [String],
  isCustom: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Module = model('Module', moduleSchema);
