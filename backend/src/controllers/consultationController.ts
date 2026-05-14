import asyncHandler from 'express-async-handler';
import type { Request, Response } from 'express';
import prisma from '../config/prisma.js';

// @desc    Get all consultations (Admin)
export const getConsultations = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.query;
  const where: any = {};
  if (status && status !== 'ALL') {
    where.status = status as string;
  }

  const consultations = await prisma.consultation.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
  res.json(consultations);
});

// @desc    Create a consultation request
export const createConsultation = asyncHandler(async (req: Request, res: Response) => {
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
export const updateConsultationStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;
  const validStatuses = ['PENDING', 'CONTACTED', 'COMPLETED'];
  
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Trạng thái không hợp lệ. Chỉ chấp nhận: PENDING, CONTACTED, COMPLETED');
  }

  const consultation = await prisma.consultation.findUnique({ 
    where: { id: req.params.id as string } 
  });

  if (!consultation) {
    res.status(404);
    throw new Error('Không tìm thấy yêu cầu tư vấn');
  }

  const updated = await prisma.consultation.update({
    where: { id: req.params.id as string },
    data: { status }
  });

  res.json(updated);
});

// @desc    Delete consultation (Admin)
export const deleteConsultation = asyncHandler(async (req: Request, res: Response) => {
  const consultation = await prisma.consultation.findUnique({ where: { id: req.params.id as string } });

  if (consultation) {
    await prisma.consultation.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Yêu cầu tư vấn đã bị xóa' });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy yêu cầu tư vấn');
  }
});
