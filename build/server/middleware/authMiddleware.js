import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
export const protect = async (req, res, next) => {
    let token;
    // Read the JWT from the cookie
    token = req.cookies.jwt;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            req.user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                select: { id: true, name: true, email: true, role: true }
            });
            if (!req.user) {
                res.status(401);
                throw new Error('Không có quyền truy cập, người dùng không tồn tại');
            }
            next();
        }
        catch (error) {
            res.status(401);
            throw new Error('Không có quyền truy cập, token lỗi');
        }
    }
    else {
        res.status(401);
        throw new Error('Không có quyền truy cập, không tìm thấy token');
    }
};
export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    }
    else {
        res.status(401).json({ message: 'Chỉ dành cho quản trị viên' });
    }
};
//# sourceMappingURL=authMiddleware.js.map