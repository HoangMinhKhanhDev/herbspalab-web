import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import prisma from '../config/prisma.js';
import { slugify } from '../utils/slugify.js';

// @desc    Get all blogs
export const getBlogs = asyncHandler(async (req: Request, res: Response) => {
  const blogs = await prisma.blog.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(blogs);
});

// @desc    Get all blogs for admin (Drafts + Published)
export const getAdminBlogs = asyncHandler(async (req: Request, res: Response) => {
  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: 'desc' }
  });
  res.json(blogs);
});

// @desc    Get single blog by id (Admin)
export const getBlogById = asyncHandler(async (req: Request, res: Response) => {
  const blog = await prisma.blog.findUnique({
    where: { id: req.params.id as string }
  });
  if (blog) {
    res.json(blog);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy bài viết');
  }
});

// @desc    Get single blog by slug
export const getBlogBySlug = asyncHandler(async (req: Request, res: Response) => {
  const blog = await prisma.blog.findUnique({
    where: { slug: req.params.slug as string }
  });
  if (blog) {
    res.json(blog);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy bài viết');
  }
});

// @desc    Create a blog (Admin)
export const createBlog = asyncHandler(async (req: any, res: Response) => {
  const { title, content, summary, image, tags } = req.body;
  const slug = slugify(title);
  
  const blog = await prisma.blog.create({
    data: {
      title,
      slug,
      content,
      summary,
      image,
      tags: Array.isArray(tags) ? tags.join(',') : tags,
    }
  });

  res.status(201).json(blog);
});

// @desc    Update a blog (Admin)
export const updateBlog = asyncHandler(async (req: Request, res: Response) => {
  const blog = await prisma.blog.findUnique({ where: { id: req.params.id as string } });
  if (blog) {
    const { title, content, summary, image, tags, isPublished } = req.body;
    
    const data: any = {
      content,
      summary,
      image,
      isPublished,
      tags: Array.isArray(tags) ? tags.join(',') : tags,
    };
    
    if (title) {
      data.title = title;
      data.slug = slugify(title);
    }

    const updatedBlog = await prisma.blog.update({
      where: { id: req.params.id as string },
      data
    });
    res.json(updatedBlog);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy bài viết');
  }
});

// @desc    Delete a blog (Admin)
export const deleteBlog = asyncHandler(async (req: Request, res: Response) => {
  const blog = await prisma.blog.findUnique({ where: { id: req.params.id as string } });
  if (blog) {
    await prisma.blog.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Bài viết đã bị xóa' });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy bài viết');
  }
});
