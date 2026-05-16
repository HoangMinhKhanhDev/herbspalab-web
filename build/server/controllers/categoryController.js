import asyncHandler from 'express-async-handler';
import prisma from '../config/prisma.js';
// @desc    Get all categories
export const getCategories = asyncHandler(async (req, res) => {
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
export const getCategoryBySlug = asyncHandler(async (req, res) => {
    const category = await prisma.category.findUnique({
        where: { slug: req.params.slug },
        include: {
            children: true,
            products: { include: { images: true } }
        }
    });
    if (category) {
        res.json(category);
    }
    else {
        res.status(404);
        throw new Error('Category not found');
    }
});
// @desc    Get category by ID
export const getCategoryById = asyncHandler(async (req, res) => {
    const category = await prisma.category.findUnique({
        where: { id: req.params.id },
        include: { children: true }
    });
    if (category) {
        res.json(category);
    }
    else {
        res.status(404);
        throw new Error('Category not found');
    }
});
// @desc    Create category
export const createCategory = asyncHandler(async (req, res) => {
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
export const updateCategory = asyncHandler(async (req, res) => {
    const { name, slug, description, banner, parentId, metaTitle, metaDescription } = req.body;
    const category = await prisma.category.update({
        where: { id: req.params.id },
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
export const deleteCategory = asyncHandler(async (req, res) => {
    await prisma.category.delete({
        where: { id: req.params.id }
    });
    res.json({ message: 'Category removed' });
});
//# sourceMappingURL=categoryController.js.map