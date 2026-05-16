import prisma from '../config/prisma.js';
import asyncHandler from 'express-async-handler';
// @desc    Get all settings
// @route   GET /api/admin/settings
// @access  Private/Admin
export const getSettings = asyncHandler(async (req, res) => {
    const settings = await prisma.systemSetting.findMany();
    const settingsMap = settings.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {});
    res.json(settingsMap);
});
// @desc    Update settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
export const updateSettings = asyncHandler(async (req, res) => {
    const updates = req.body; // { key: value, ... }
    for (const [key, value] of Object.entries(updates)) {
        await prisma.systemSetting.upsert({
            where: { key },
            update: { value: String(value) },
            create: { key, value: String(value) },
        });
    }
    res.json({ message: 'Settings updated successfully' });
});
//# sourceMappingURL=settingsController.js.map