import asyncHandler from 'express-async-handler';
import type { Request, Response } from 'express';
import prisma from '../config/prisma.js';

// @desc    Get dashboard statistics (Admin)
export const getStats = asyncHandler(async (req: Request, res: Response) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    userCount, 
    newCustomerCount,
    productCount, 
    orderCount, 
    consultationCount,
    trafficCount,
    recentOrders, 
    allOrders,
    dailyTraffic
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.product.count(),
    prisma.order.count(),
    prisma.consultation.count(),
    prisma.trafficLog.count(),
    prisma.order.findMany({ 
      where: { createdAt: { gte: sevenDaysAgo } }, 
      select: { totalPrice: true, createdAt: true } 
    }),
    prisma.order.findMany({ include: { user: true, orderItems: true } }),
    prisma.trafficLog.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true }
    })
  ]);

  // Revenue Trend (7 days)
  const trendMap: any = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    trendMap[d.toLocaleDateString('vi-VN')] = 0;
  }
  
  recentOrders.forEach(o => {
    const dateKey = new Date(o.createdAt).toLocaleDateString('vi-VN');
    if (trendMap[dateKey] !== undefined) trendMap[dateKey] += o.totalPrice;
  });
  
  const revenueTrend = Object.entries(trendMap).map(([label, value]) => ({ label, value }));

  // Traffic Trend (7 days)
  const trafficMap: any = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    trafficMap[d.toLocaleDateString('vi-VN')] = 0;
  }
  dailyTraffic.forEach(t => {
    const dateKey = new Date(t.createdAt).toLocaleDateString('vi-VN');
    if (trafficMap[dateKey] !== undefined) trafficMap[dateKey] += 1;
  });
  const trafficTrend = Object.entries(trafficMap).map(([label, value]) => ({ label, value }));

  // Top Products
  const productSales: any = {};
  allOrders.forEach(o => {
    o.orderItems.forEach((item: any) => {
      if (!productSales[item.productId]) {
        productSales[item.productId] = { name: item.name, qty: 0, revenue: 0 };
      }
      productSales[item.productId].qty += item.qty;
      productSales[item.productId].revenue += (item.price * item.qty);
    });
  });
  
  const topProducts = Object.values(productSales)
    .sort((a: any, b: any) => b.qty - a.qty)
    .slice(0, 5);

  const totalRevenue = allOrders.reduce((sum, o) => sum + o.totalPrice, 0);

  res.json({ 
    userCount,
    newCustomerCount,
    productCount, 
    orderCount,
    consultationCount,
    trafficCount,
    revenue: totalRevenue, 
    revenueTrend,
    trafficTrend,
    topProducts 
  });
});
