import asyncHandler from 'express-async-handler';
import type { Request, Response } from 'express';
import prisma from '../config/prisma.js';

// @desc    Get all categories
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    include: {
      children: true,
      parent: true,
      _count: {
        select: { products: true }
      }
    }
  });
  res.json(categories);
});

// @desc    Get category by Slug
export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
  const category = await prisma.category.findUnique({
    where: { slug: req.params.slug as string },
    include: { 
      children: true,
      products: { include: { images: true } }
    }
  });

  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// @desc    Get category by ID
export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const category = await prisma.category.findUnique({
    where: { id: req.params.id as string },
    include: { children: true }
  });

  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// @desc    Create category
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, slug, description, banner, parentId, metaTitle, metaDescription } = req.body;

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      description,
      banner,
      parentId,
      metaTitle,
      metaDescription
    }
  });

  res.status(201).json(category);
});

// @desc    Update category
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, slug, description, banner, parentId, metaTitle, metaDescription } = req.body;

  const category = await prisma.category.update({
    where: { id: req.params.id as string },
    data: {
      name,
      slug,
      description,
      banner,
      parentId,
      metaTitle,
      metaDescription
    }
  });

  res.json(category);
});

// @desc    Delete category
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  await prisma.category.delete({
    where: { id: req.params.id as string }
  });
  res.json({ message: 'Category removed' });
});
