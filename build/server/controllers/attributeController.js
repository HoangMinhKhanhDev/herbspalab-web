import asyncHandler from 'express-async-handler';
import prisma from '../config/prisma.js';
// @desc    Get all attributes
export const getAttributes = asyncHandler(async (req, res) => {
    const attributes = await prisma.attribute.findMany({
        include: { values: true }
    });
    res.json(attributes);
});
// @desc    Create attribute
export const createAttribute = asyncHandler(async (req, res) => {
    const { name, values } = req.body;
    const attribute = await prisma.attribute.create({
        data: {
            name,
            ...(values && Array.isArray(values) && {
                values: {
                    create: values.filter((v) => v.trim()).map((v) => ({ value: v.trim() }))
                }
            })
        },
        include: { values: true }
    });
    res.status(201).json(attribute);
});
// @desc    Add value to attribute
export const addAttributeValue = asyncHandler(async (req, res) => {
    const { attributeId, value } = req.body;
    const attrValue = await prisma.attributeValue.create({
        data: { attributeId, value }
    });
    res.status(201).json(attrValue);
});
// @desc    Delete attribute
export const deleteAttribute = asyncHandler(async (req, res) => {
    await prisma.attribute.delete({ where: { id: req.params.id } });
    res.json({ message: 'Attribute removed' });
});
// @desc    Delete attribute value
export const deleteAttributeValue = asyncHandler(async (req, res) => {
    await prisma.attributeValue.delete({ where: { id: req.params.id } });
    res.json({ message: 'Attribute value removed' });
});
//# sourceMappingURL=attributeController.js.map