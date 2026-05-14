import asyncHandler from 'express-async-handler';
import type { Request, Response } from 'express';
import prisma from '../config/prisma.js';

// @desc    Get all attributes
export const getAttributes = asyncHandler(async (req: Request, res: Response) => {
  const attributes = await prisma.attribute.findMany({
    include: { values: true }
  });
  res.json(attributes);
});

// @desc    Create attribute
export const createAttribute = asyncHandler(async (req: Request, res: Response) => {
  const { name, values } = req.body;
  const attribute = await prisma.attribute.create({
    data: { 
      name,
      ...(values && Array.isArray(values) && {
        values: {
          create: values.filter((v: string) => v.trim()).map((v: string) => ({ value: v.trim() }))
        }
      })
    },
    include: { values: true }
  });
  res.status(201).json(attribute);
});

// @desc    Add value to attribute
export const addAttributeValue = asyncHandler(async (req: Request, res: Response) => {
  const { attributeId, value } = req.body;
  const attrValue = await prisma.attributeValue.create({
    data: { attributeId, value }
  });
  res.status(201).json(attrValue);
});

// @desc    Delete attribute
export const deleteAttribute = asyncHandler(async (req: Request, res: Response) => {
  await prisma.attribute.delete({ where: { id: req.params.id as string } });
  res.json({ message: 'Attribute removed' });
});

// @desc    Delete attribute value
export const deleteAttributeValue = asyncHandler(async (req: Request, res: Response) => {
  await prisma.attributeValue.delete({ where: { id: req.params.id as string } });
  res.json({ message: 'Attribute value removed' });
});
