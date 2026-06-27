import * as yup from 'yup';

export const categorySchema = yup.object().shape({
  name: yup.string().required('Category name is required').min(2, 'Name must be at least 2 characters'),
  displayOrder: yup.number().required('Display order is required').min(0, 'Order must be 0 or greater'),
});

export const itemSchema = yup.object().shape({
  title: yup.string().required('Title is required').min(2, 'Title must be at least 2 characters'),
  description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
  price: yup.number().required('Price is required').positive('Price must be positive'),
  photoUrl: yup.string().optional(),
  isVegetarian: yup.boolean().default(false),
  isVegan: yup.boolean().default(false),
  isNonVeg: yup.boolean().default(false),
  category: yup.string().required('Category is required'),
});

export const chefSchema = yup.object().shape({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  role: yup.string().required('Role is required'),
  bio: yup.string().required('Bio is required').min(10, 'Bio must be at least 10 characters'),
  photoUrl: yup.string().optional(),
  experienceYears: yup.number().integer().min(0, 'Experience must be 0 or greater').nullable(),
  specialties: yup.string(), // We will split this string into an array before submitting
});

export const specialSchema = yup.object().shape({
  item: yup.string().required('Item ID is required'),
  date: yup.date().required('Date is required'),
  expiresAt: yup.date().nullable(),
});
