import asyncHandler from 'express-async-handler';
import prisma from '../config/prisma.js';
// @desc    Get all consultations (Admin)
export const getConsultations = asyncHandler(async (req, res) => {
    const { status } = req.query;
    const where = {};
    if (status && status !== 'ALL') {
        where.status = status;
    }
    const consultations = await prisma.consultation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
    });
    res.json(consultations);
});
// @desc    Create a consultation request
export const createConsultation = asyncHandler(async (req, res) => {
    const { userName, phone, category, skinType, householdSize, frequency, note } = req.body;
    if (!userName || !phone) {
        res.status(400);
        throw new Error('Họ tên và Số điện thoại là bắt buộc');
    }
    const consultation = await prisma.consultation.create({
        data: {
            userName,
            phone,
            category,
            skinType,
            householdSize,
            frequency,
            note,
        },
    });
    res.status(201).json(consultation);
});
// @desc    Update consultation status (Admin)
export const updateConsultationStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['PENDING', 'CONTACTED', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
        res.status(400);
        throw new Error('Trạng thái không hợp lệ. Chỉ chấp nhận: PENDING, CONTACTED, COMPLETED');
    }
    const consultation = await prisma.consultation.findUnique({
        where: { id: req.params.id }
    });
    if (!consultation) {
        res.status(404);
        throw new Error('Không tìm thấy yêu cầu tư vấn');
    }
    const updated = await prisma.consultation.update({
        where: { id: req.params.id },
        data: { status }
    });
    res.json(updated);
});
// @desc    Delete consultation (Admin)
export const deleteConsultation = asyncHandler(async (req, res) => {
    const consultation = await prisma.consultation.findUnique({ where: { id: req.params.id } });
    if (consultation) {
        await prisma.consultation.delete({ where: { id: req.params.id } });
        res.json({ message: 'Yêu cầu tư vấn đã bị xóa' });
    }
    else {
        res.status(404);
        throw new Error('Không tìm thấy yêu cầu tư vấn');
    }
});
//# sourceMappingURL=consultationController.js.map