import asyncHandler from 'express-async-handler';
import prisma from '../config/prisma.js';
// @desc    Get all user addresses
export const getAddresses = asyncHandler(async (req, res) => {
    const addresses = await prisma.address.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' }
    });
    res.json(addresses);
});
// @desc    Add new address
export const addAddress = asyncHandler(async (req, res) => {
    const { fullName, phone, province, district, ward, detail, isDefault } = req.body;
    // If this is the first address, make it default
    const addressCount = await prisma.address.count({ where: { userId: req.user.id } });
    const shouldBeDefault = addressCount === 0 ? true : isDefault;
    // If isDefault is true, unset other defaults
    if (shouldBeDefault) {
        await prisma.address.updateMany({
            where: { userId: req.user.id },
            data: { isDefault: false }
        });
    }
    const address = await prisma.address.create({
        data: {
            userId: req.user.id,
            fullName,
            phone,
            province,
            district,
            ward,
            detail,
            isDefault: shouldBeDefault
        }
    });
    res.status(201).json(address);
});
// @desc    Update address
export const updateAddress = asyncHandler(async (req, res) => {
    const { fullName, phone, province, district, ward, detail, isDefault } = req.body;
    const addressId = req.params.id;
    const existingAddress = await prisma.address.findUnique({
        where: { id: addressId }
    });
    if (!existingAddress || existingAddress.userId !== req.user.id) {
        res.status(404);
        throw new Error('Không tìm thấy địa chỉ');
    }
    // If setting this as default, unset others
    if (isDefault && !existingAddress.isDefault) {
        await prisma.address.updateMany({
            where: { userId: req.user.id },
            data: { isDefault: false }
        });
    }
    const updatedAddress = await prisma.address.update({
        where: { id: addressId },
        data: {
            fullName: fullName || existingAddress.fullName,
            phone: phone || existingAddress.phone,
            province: province || existingAddress.province,
            district: district || existingAddress.district,
            ward: ward || existingAddress.ward,
            detail: detail || existingAddress.detail,
            isDefault: isDefault !== undefined ? isDefault : existingAddress.isDefault
        }
    });
    res.json(updatedAddress);
});
// @desc    Delete address
export const deleteAddress = asyncHandler(async (req, res) => {
    const addressId = req.params.id;
    const address = await prisma.address.findUnique({
        where: { id: addressId }
    });
    if (!address || address.userId !== req.user.id) {
        res.status(404);
        throw new Error('Không tìm thấy địa chỉ');
    }
    await prisma.address.delete({ where: { id: addressId } });
    // If deleted was default, make the most recent one default
    if (address.isDefault) {
        const latestAddress = await prisma.address.findFirst({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });
        if (latestAddress) {
            await prisma.address.update({
                where: { id: latestAddress.id },
                data: { isDefault: true }
            });
        }
    }
    res.json({ message: 'Đã xóa địa chỉ' });
});
// @desc    Set default address
export const setDefaultAddress = asyncHandler(async (req, res) => {
    const addressId = req.params.id;
    const address = await prisma.address.findUnique({
        where: { id: addressId }
    });
    if (!address || address.userId !== req.user.id) {
        res.status(404);
        throw new Error('Không tìm thấy địa chỉ');
    }
    await prisma.address.updateMany({
        where: { userId: req.user.id },
        data: { isDefault: false }
    });
    const updatedAddress = await prisma.address.update({
        where: { id: addressId },
        data: { isDefault: true }
    });
    res.json(updatedAddress);
});
//# sourceMappingURL=addressController.js.map