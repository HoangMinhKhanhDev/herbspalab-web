import asyncHandler from 'express-async-handler';
import type { Request, Response } from 'express';
import prisma from '../config/prisma.js';
import stripeUtil from '../utils/stripe.js';
import mailer from '../utils/mailer.js';

// @desc    Create new order
export const addOrderItems = asyncHandler(async (req: any, res: Response) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('Không có sản phẩm trong đơn hàng');
  } else {
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        shippingInfo: JSON.stringify(shippingAddress),
        paymentMethod,
        totalPrice: Number(totalPrice),
        orderItems: {
          create: orderItems.map((item: any) => ({
            name: item.name,
            qty: Number(item.qty),
            image: item.image,
            price: Number(item.price),
            productId: item.product,
            variantId: item.variantId || null,
            variantLabel: item.variantLabel || null,
          }))
        }
      },
      include: {
        orderItems: true
      }
    });

    if (paymentMethod === 'Stripe') {
      const session = await stripeUtil.createCheckoutSession(order);
      res.status(201).json({ ...order, stripeUrl: session.url });
    } else {
      res.status(201).json(order);
    }
  }
});

// @desc    Update order status (Admin)
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body; // pending, packing, delivering, delivered, cancelled
  const order = await prisma.order.findUnique({ where: { id: req.params.id as string } });

  if (order) {
    const data: any = { status };
    
    if (status === 'delivered') {
      data.isDelivered = true;
      data.deliveredAt = new Date();
    }

    const updatedOrder = await prisma.order.update({
      where: { id: req.params.id as string },
      data
    });
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy đơn hàng');
  }
});

// @desc    Get order by ID
export const getOrderById = asyncHandler(async (req: any, res: Response) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: {
      user: { select: { name: true, email: true } },
      orderItems: true
    }
  });

  if (order) {
    // Parse shippingInfo back to object
    const result = {
      ...order,
      shippingAddress: JSON.parse(order.shippingInfo)
    };
    res.json(result);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy đơn hàng');
  }
});

// @desc    Update order to paid
export const updateOrderToPaid = asyncHandler(async (req: Request, res: Response) => {
  const order = await prisma.order.findUnique({ 
    where: { id: req.params.id as string },
    include: { user: true, orderItems: true }
  });

  if (order) {
    const updatedOrder = await prisma.order.update({
      where: { id: req.params.id as string },
      data: {
        isPaid: true,
        paidAt: new Date(),
        status: 'processing'
      }
    });

    // Send confirmation email
    if (order && (order as any).user) {
      await mailer.sendOrderConfirmation((order as any).user.email, order);
    }

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy đơn hàng');
  }
});

// @desc    Get logged in user orders
export const getMyOrders = asyncHandler(async (req: any, res: Response) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    include: { orderItems: true }
  });
  res.json(orders);
});

// @desc    Get all orders (Admin)
export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { id: true, name: true } },
      orderItems: true
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json(orders);
});

// @desc    Update order to delivered (Admin)
export const updateOrderToDelivered = asyncHandler(async (req: Request, res: Response) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.id as string } });

  if (order) {
    const updatedOrder = await prisma.order.update({
      where: { id: req.params.id as string },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
        status: 'delivered'
      }
    });
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy đơn hàng');
  }
});
