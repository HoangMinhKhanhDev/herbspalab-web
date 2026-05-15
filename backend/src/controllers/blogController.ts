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
    where: { slug: req.params.slug as string },
    include: {
      comments: {
        where: { status: 'APPROVED' },
        orderBy: { createdAt: 'desc' }
      }
    }
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
  const { title, content, summary, image, tags, isPublished } = req.body;
  const slug = slugify(title);
  
  const blog = await prisma.blog.create({
    data: {
      title,
      slug,
      content,
      summary,
      image,
      tags: Array.isArray(tags) ? tags.join(',') : tags,
      isPublished: isPublished !== undefined ? isPublished : true,
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

// @desc    Add a comment to a blog
export const addComment = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, content } = req.body;
  const blog = await prisma.blog.findUnique({ where: { id: req.params.id as string } });
  if (blog) {
    const comment = await prisma.comment.create({
      data: {
        name,
        email,
        content,
        blogId: blog.id,
        status: 'PENDING'
      }
    });
    res.status(201).json({ message: 'Bình luận của bạn đã được gửi và đang chờ duyệt', comment });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy bài viết');
  }
});

// @desc    Get all comments (Admin)
export const getAdminComments = asyncHandler(async (req: Request, res: Response) => {
  const comments = await prisma.comment.findMany({
    include: {
      blog: {
        select: { title: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json(comments);
});

// @desc    Update comment status (Admin)
export const updateCommentStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;
  const comment = await prisma.comment.findUnique({ where: { id: req.params.id as string } });
  
  if (comment) {
    const updatedComment = await prisma.comment.update({
      where: { id: req.params.id as string },
      data: { status }
    });
    res.json(updatedComment);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy bình luận');
  }
});

// @desc    Delete comment (Admin)
export const deleteComment = asyncHandler(async (req: Request, res: Response) => {
  const comment = await prisma.comment.findUnique({ where: { id: req.params.id as string } });
  if (comment) {
    await prisma.comment.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Bình luận đã bị xóa' });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy bình luận');
  }
});

