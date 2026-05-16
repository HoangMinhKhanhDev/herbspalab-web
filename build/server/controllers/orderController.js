import asyncHandler from 'express-async-handler';
import prisma from '../config/prisma.js';
import stripeUtil from '../utils/stripe.js';
import mailer from '../utils/mailer.js';
// @desc    Create new order
export const addOrderItems = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, totalPrice, } = req.body;
    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('Không có sản phẩm trong đơn hàng');
    }
    else {
        const order = await prisma.order.create({
            data: {
                userId: req.user.id,
                shippingInfo: JSON.stringify(shippingAddress),
                paymentMethod,
                totalPrice: Number(totalPrice),
                orderItems: {
                    create: orderItems.map((item) => ({
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
        }
        else {
            res.status(201).json(order);
        }
    }
});
// @desc    Update order status (Admin)
export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body; // pending, packing, delivering, delivered, cancelled
    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (order) {
        const data = { status };
        if (status === 'delivered') {
            data.isDelivered = true;
            data.deliveredAt = new Date();
        }
        const updatedOrder = await prisma.order.update({
            where: { id: req.params.id },
            data
        });
        res.json(updatedOrder);
    }
    else {
        res.status(404);
        throw new Error('Không tìm thấy đơn hàng');
    }
});
// @desc    Get order by ID
export const getOrderById = asyncHandler(async (req, res) => {
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
    }
    else {
        res.status(404);
        throw new Error('Không tìm thấy đơn hàng');
    }
});
// @desc    Update order to paid
export const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await prisma.order.findUnique({
        where: { id: req.params.id },
        include: { user: true, orderItems: true }
    });
    if (order) {
        const updatedOrder = await prisma.order.update({
            where: { id: req.params.id },
            data: {
                isPaid: true,
                paidAt: new Date(),
                status: 'processing'
            }
        });
        // Send confirmation email
        if (order && order.user) {
            await mailer.sendOrderConfirmation(order.user.email, order);
        }
        res.json(updatedOrder);
    }
    else {
        res.status(404);
        throw new Error('Không tìm thấy đơn hàng');
    }
});
// @desc    Get logged in user orders
export const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await prisma.order.findMany({
        where: { userId: req.user.id },
        include: { orderItems: true }
    });
    res.json(orders);
});
// @desc    Get all orders (Admin)
export const getOrders = asyncHandler(async (req, res) => {
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
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (order) {
        const updatedOrder = await prisma.order.update({
            where: { id: req.params.id },
            data: {
                isDelivered: true,
                deliveredAt: new Date(),
                status: 'delivered'
            }
        });
        res.json(updatedOrder);
    }
    else {
        res.status(404);
        throw new Error('Không tìm thấy đơn hàng');
    }
});
// @desc    Delete order (Admin)
export const deleteOrder = asyncHandler(async (req, res) => {
    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (order) {
        await prisma.order.delete({ where: { id: req.params.id } });
        res.json({ message: 'Đơn hàng đã bị xóa' });
    }
    else {
        res.status(404);
        throw new Error('Không tìm thấy đơn hàng');
    }
});
//# sourceMappingURL=orderController.js.map