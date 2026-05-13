import asyncHandler from 'express-async-handler';
import type { Response } from 'express';
import prisma from '../config/prisma.js';

// @desc    Get user cart
export const getCart = asyncHandler(async (req: any, res: Response) => {
  const cart = await prisma.cart.findUnique({
    where: { userId: req.user.id },
    include: {
      cartItems: {
        include: { product: { include: { images: true } } }
      }
    }
  });
  
  if (cart) {
    res.json(cart);
  } else {
    res.json({ cartItems: [] });
  }
});

// @desc    Update user cart
export const updateCart = asyncHandler(async (req: any, res: Response) => {
  const { cartItems } = req.body;
  
  // Find or create cart
  let cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: req.user.id }
    });
  }

  // Clear existing items and add new ones
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  const updatedCart = await prisma.cart.update({
    where: { id: cart.id },
    data: {
      cartItems: {
        create: cartItems.map((item: any) => ({
          qty: item.qty,
          productId: item.product,
        }))
      }
    },
    include: {
      cartItems: {
        include: { product: { include: { images: true } } }
      }
    }
  });

  res.json(updatedCart);
});

// @desc    Clear user cart
export const clearCart = asyncHandler(async (req: any, res: Response) => {
  const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    res.json({ message: 'Giỏ hàng đã được xóa' });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy giỏ hàng');
  }
});
