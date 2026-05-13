import asyncHandler from 'express-async-handler';
import type { Request, Response } from 'express';
import prisma from '../config/prisma.js';

// @desc    Get all consultations (Admin)
export const getConsultations = asyncHandler(async (req: Request, res: Response) => {
  const consultations = await prisma.consultation.findMany({
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
