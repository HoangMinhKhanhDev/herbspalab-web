import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import prisma from '../config/prisma.js';
import generateToken from '../utils/generateToken.js';
import { hashPassword, comparePassword } from '../utils/password.js';

// @desc    Auth user & get token
export const authUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (user && (await comparePassword(password, user.password))) {
    generateToken(res, user.id);

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(401);
    throw new Error('Email hoặc mật khẩu không đúng');
  }
});

// @desc    Register a new user
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const userExists = await prisma.user.findUnique({
    where: { email }
  });

  if (userExists) {
    res.status(400);
    throw new Error('Người dùng đã tồn tại');
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    }
  });

  if (user) {
    generateToken(res, user.id);

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error('Dữ liệu không hợp lệ');
  }
});

// @desc    Logout user & clear cookie
export const logoutUser = (req: Request, res: Response) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Đăng xuất thành công' });
};

// @desc    Get user profile
export const getUserProfile = asyncHandler(async (req: any, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    }
  });

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy người dùng');
  }
});

// @desc    Get all users (Admin)
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  });
  res.json(users);
});

// @desc    Delete user (Admin)
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id as string } });

  if (user) {
    if (user.role === 'admin') {
      res.status(400);
      throw new Error('Không thể xóa tài khoản Admin');
    }
    await prisma.user.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Người dùng đã bị xóa' });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy người dùng');
  }
});

// @desc    Update user role (Admin)
export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const { role } = req.body;
  const user = await prisma.user.findUnique({ where: { id: req.params.id as string } });

  if (user) {
    const updatedUser = await prisma.user.update({
      where: { id: req.params.id as string },
      data: { role },
      select: { id: true, name: true, email: true, role: true }
    });
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy người dùng');
  }
});
