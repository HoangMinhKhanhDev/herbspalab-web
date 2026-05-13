import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import prisma from '../config/prisma.js';

// @desc    Create new review
export const createProductReview = asyncHandler(async (req: any, res: Response) => {
  const { rating, comment } = req.body;

  const product = await prisma.product.findUnique({ where: { id: req.params.id as string } });

  if (product) {
    const alreadyReviewed = await prisma.review.findFirst({
      where: {
        userId: req.user.id,
        productId: product.id,
      }
    });

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Bạn đã đánh giá sản phẩm này rồi');
    }

    await prisma.review.create({
      data: {
        name: req.user.name,
        rating: Number(rating),
        comment,
        userId: req.user.id,
        productId: product.id,
      }
    });

    // Update product rating
    const reviews = await prisma.review.findMany({ where: { productId: product.id } });
    const numReviews = reviews.length;
    const ratingAvg = reviews.reduce((acc: number, item: any) => item.rating + acc, 0) / numReviews;

    await prisma.product.update({
      where: { id: product.id },
      data: {
        numReviews,
        rating: ratingAvg,
      }
    });

    res.status(201).json({ message: 'Đã thêm đánh giá' });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy sản phẩm');
  }
});

// @desc    Get product reviews
export const getProductReviews = asyncHandler(async (req: Request, res: Response) => {
  const reviews = await prisma.review.findMany({
    where: { productId: req.params.id as string },
    include: {
      user: { select: { name: true } }
    }
  });
  res.json(reviews);
});
