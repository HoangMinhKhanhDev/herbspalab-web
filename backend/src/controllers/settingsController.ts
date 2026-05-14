import type { Request, Response } from 'express';
import prisma from '../config/prisma.js';
import asyncHandler from 'express-async-handler';

// @desc    Get all settings
// @route   GET /api/admin/settings
// @access  Private/Admin
export const getSettings = asyncHandler(async (req: Request, res: Response) => {
  const settings = await (prisma as any).systemSetting.findMany();
  const settingsMap = settings.reduce((acc: any, curr: any) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});
  res.json(settingsMap);
});

// @desc    Update settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
export const updateSettings = asyncHandler(async (req: Request, res: Response) => {
  const updates = req.body; // { key: value, ... }
  
  for (const [key, value] of Object.entries(updates)) {
    await (prisma as any).systemSetting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    });
  }
  
  res.json({ message: 'Settings updated successfully' });
});
