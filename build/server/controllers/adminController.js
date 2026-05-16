import asyncHandler from 'express-async-handler';
import prisma from '../config/prisma.js';
// @desc    Get dashboard statistics (Admin)
export const getStats = asyncHandler(async (req, res) => {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const [userCount, newCustomerCount, prevMonthCustomerCount, productCount, orderCount, prevMonthOrderCount, consultationCount, pendingConsultationCount, trafficCount, recentOrders, prevMonthOrders, dailyTraffic, revenueAggregation, prevMonthRevenueAgg, orderItemsGroupBy, trafficSources] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
        prisma.user.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
        prisma.product.count(),
        prisma.order.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
        prisma.order.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
        prisma.consultation.count(),
        prisma.consultation.count({ where: { status: 'PENDING' } }),
        prisma.trafficLog.count(),
        prisma.order.findMany({
            where: { createdAt: { gte: sevenDaysAgo } },
            select: { totalPrice: true, createdAt: true }
        }),
        prisma.order.findMany({
            where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
            select: { totalPrice: true }
        }),
        prisma.trafficLog.findMany({
            where: { createdAt: { gte: sevenDaysAgo } },
            select: { createdAt: true }
        }),
        prisma.order.aggregate({
            where: { createdAt: { gte: thirtyDaysAgo } },
            _sum: { totalPrice: true }
        }),
        prisma.order.aggregate({
            where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
            _sum: { totalPrice: true }
        }),
        prisma.orderItem.groupBy({
            by: ['productId', 'name'],
            _sum: { qty: true, price: true },
            orderBy: { _sum: { qty: 'desc' } },
            take: 5
        }),
        prisma.trafficLog.findMany({
            where: { createdAt: { gte: thirtyDaysAgo } },
            select: { referrer: true, createdAt: true }
        })
    ]);
    // Revenue Trend (7 days)
    const trendMap = {};
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        trendMap[d.toLocaleDateString('vi-VN')] = 0;
    }
    recentOrders.forEach(o => {
        const dateKey = new Date(o.createdAt).toLocaleDateString('vi-VN');
        if (trendMap[dateKey] !== undefined)
            trendMap[dateKey] += o.totalPrice;
    });
    const revenueTrend = Object.entries(trendMap).map(([label, value]) => ({ label, value }));
    // Traffic Trend (7 days)
    const trafficMap = {};
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        trafficMap[d.toLocaleDateString('vi-VN')] = 0;
    }
    dailyTraffic.forEach(t => {
        const dateKey = new Date(t.createdAt).toLocaleDateString('vi-VN');
        if (trafficMap[dateKey] !== undefined)
            trafficMap[dateKey] += 1;
    });
    const trafficTrend = Object.entries(trafficMap).map(([label, value]) => ({ label, value }));
    // Top Products
    const topProducts = orderItemsGroupBy.map(item => ({
        name: item.name,
        qty: item._sum.qty || 0,
        revenue: (item._sum.qty || 0) * (item._sum.price || 0) / (item._sum.qty || 1)
    }));
    // Growth calculations (month over month)
    const totalRevenue = revenueAggregation._sum.totalPrice || 0;
    const prevRevenue = prevMonthRevenueAgg._sum.totalPrice || 0;
    const revenueGrowth = prevRevenue > 0 ? Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100) : (totalRevenue > 0 ? 100 : 0);
    const orderGrowth = prevMonthOrderCount > 0 ? Math.round(((orderCount - prevMonthOrderCount) / prevMonthOrderCount) * 100) : (orderCount > 0 ? 100 : 0);
    const customerGrowth = prevMonthCustomerCount > 0 ? Math.round(((newCustomerCount - prevMonthCustomerCount) / prevMonthCustomerCount) * 100) : (newCustomerCount > 0 ? 100 : 0);
    // Recent Orders (for dashboard)
    const dashboardRecentOrders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } }
    });
    // Traffic source breakdown
    const sourceMap = { 'Trực tiếp': 0, 'Google': 0, 'Facebook': 0, 'TikTok': 0, 'Zalo': 0, 'Khác': 0 };
    trafficSources.forEach(t => {
        const ref = (t.referrer || '').toLowerCase();
        if (!ref || ref === 'null' || ref === '')
            sourceMap['Trực tiếp'] = (sourceMap['Trực tiếp'] || 0) + 1;
        else if (ref.includes('google'))
            sourceMap['Google'] = (sourceMap['Google'] || 0) + 1;
        else if (ref.includes('facebook') || ref.includes('fb.'))
            sourceMap['Facebook'] = (sourceMap['Facebook'] || 0) + 1;
        else if (ref.includes('tiktok'))
            sourceMap['TikTok'] = (sourceMap['TikTok'] || 0) + 1;
        else if (ref.includes('zalo'))
            sourceMap['Zalo'] = (sourceMap['Zalo'] || 0) + 1;
        else
            sourceMap['Khác'] = (sourceMap['Khác'] || 0) + 1;
    });
    const trafficSourceBreakdown = Object.entries(sourceMap).map(([name, value]) => ({ name, value }));
    res.json({
        userCount,
        newCustomerCount,
        productCount,
        orderCount,
        consultationCount,
        pendingConsultationCount,
        trafficCount,
        revenue: totalRevenue,
        revenueGrowth,
        orderGrowth,
        customerGrowth,
        revenueTrend,
        trafficTrend,
        topProducts,
        trafficSourceBreakdown,
        recentOrders: dashboardRecentOrders,
        activities: [
            ...dashboardRecentOrders.map(o => ({ type: 'order', text: `Đơn hàng mới từ ${o.user?.name || 'Khách'}`, time: o.createdAt })),
            ...trafficSources.slice(0, 5).map(t => ({ type: 'traffic', text: `Truy cập từ ${t.referrer || 'Trực tiếp'}`, time: t.createdAt }))
        ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8)
    });
});
// @desc    Get traffic report (Admin)
export const getTrafficReport = asyncHandler(async (req, res) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const logs = await prisma.trafficLog.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { referrer: true, path: true, createdAt: true, userAgent: true }
    });
    // Source breakdown
    const sourceMap = { 'Trực tiếp': 0, 'Google': 0, 'Facebook': 0, 'TikTok': 0, 'Zalo': 0, 'Khác': 0 };
    logs.forEach(t => {
        const ref = (t.referrer || '').toLowerCase();
        if (!ref || ref === 'null')
            sourceMap['Trực tiếp'] = (sourceMap['Trực tiếp'] || 0) + 1;
        else if (ref.includes('google'))
            sourceMap['Google'] = (sourceMap['Google'] || 0) + 1;
        else if (ref.includes('facebook') || ref.includes('fb.'))
            sourceMap['Facebook'] = (sourceMap['Facebook'] || 0) + 1;
        else if (ref.includes('tiktok'))
            sourceMap['TikTok'] = (sourceMap['TikTok'] || 0) + 1;
        else if (ref.includes('zalo'))
            sourceMap['Zalo'] = (sourceMap['Zalo'] || 0) + 1;
        else
            sourceMap['Khác'] = (sourceMap['Khác'] || 0) + 1;
    });
    // Top pages
    const pageMap = {};
    logs.forEach(t => {
        const p = t.path || '/';
        pageMap[p] = (pageMap[p] || 0) + 1;
    });
    const topPages = Object.entries(pageMap)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([path, views]) => ({ path, views }));
    // Daily trend (30 days)
    const dailyMap = {};
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dailyMap[d.toLocaleDateString('vi-VN')] = 0;
    }
    logs.forEach(t => {
        const dateKey = new Date(t.createdAt).toLocaleDateString('vi-VN');
        if (dailyMap[dateKey] !== undefined)
            dailyMap[dateKey]++;
    });
    const dailyTrend = Object.entries(dailyMap).map(([label, value]) => ({ label, value }));
    // Device breakdown
    const deviceMap = { 'Desktop': 0, 'Mobile': 0, 'Tablet': 0 };
    logs.forEach(t => {
        const ua = (t.userAgent || '').toLowerCase();
        if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone'))
            deviceMap['Mobile'] = (deviceMap['Mobile'] || 0) + 1;
        else if (ua.includes('ipad') || ua.includes('tablet'))
            deviceMap['Tablet'] = (deviceMap['Tablet'] || 0) + 1;
        else
            deviceMap['Desktop'] = (deviceMap['Desktop'] || 0) + 1;
    });
    res.json({
        totalViews: logs.length,
        sources: Object.entries(sourceMap).map(([name, value]) => ({ name, value })),
        topPages,
        dailyTrend,
        devices: Object.entries(deviceMap).map(([name, value]) => ({ name, value }))
    });
});
// @desc    Get customer report (Admin)
export const getCustomerReport = asyncHandler(async (req, res) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const [totalCustomers, newCustomers, customersWithOrders] = await Promise.all([
        prisma.user.count({ where: { role: 'customer' } }),
        prisma.user.count({ where: { role: 'customer', createdAt: { gte: thirtyDaysAgo } } }),
        prisma.user.findMany({
            where: { role: 'customer' },
            select: {
                id: true,
                name: true,
                createdAt: true,
                orders: {
                    select: { id: true, totalPrice: true, createdAt: true }
                }
            }
        })
    ]);
    // Customer segments
    const segments = { 'Mới (chưa mua)': 0, '1 đơn hàng': 0, '2-5 đơn hàng': 0, 'Trung thành (>5)': 0 };
    let totalLTV = 0;
    customersWithOrders.forEach(c => {
        const count = c.orders.length;
        const ltv = c.orders.reduce((sum, o) => sum + o.totalPrice, 0);
        totalLTV += ltv;
        if (count === 0)
            segments['Mới (chưa mua)']++;
        else if (count === 1)
            segments['1 đơn hàng']++;
        else if (count <= 5)
            segments['2-5 đơn hàng']++;
        else
            segments['Trung thành (>5)']++;
    });
    // Monthly new customer trend (6 months)
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
        const start = new Date();
        start.setMonth(start.getMonth() - i);
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setMonth(end.getMonth() + 1);
        const count = customersWithOrders.filter(c => new Date(c.createdAt) >= start && new Date(c.createdAt) < end).length;
        monthlyTrend.push({
            label: start.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' }),
            value: count
        });
    }
    // Top customers by revenue
    const topCustomers = customersWithOrders
        .map(c => ({
        name: c.name,
        orderCount: c.orders.length,
        totalSpent: c.orders.reduce((sum, o) => sum + o.totalPrice, 0)
    }))
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 10);
    res.json({
        totalCustomers,
        newCustomers,
        avgLTV: totalCustomers > 0 ? Math.round(totalLTV / totalCustomers) : 0,
        segments: Object.entries(segments).map(([name, value]) => ({ name, value })),
        monthlyTrend,
        topCustomers
    });
});
//# sourceMappingURL=adminController.js.map