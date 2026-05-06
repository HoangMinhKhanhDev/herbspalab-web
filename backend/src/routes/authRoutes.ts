import { Router } from 'express';

const router = Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  // Mock login
  if (email && password) {
    res.json({
      token: 'mock-jwt-token',
      user: {
        email,
        name: 'Người dùng Thử nghiệm',
        role: 'user'
      }
    });
  } else {
    res.status(400).json({ message: 'Thiếu email hoặc mật khẩu' });
  }
});

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  // Mock register
  if (name && email && password) {
    res.json({
      message: 'Đăng ký thành công',
      user: { name, email }
    });
  } else {
    res.status(400).json({ message: 'Thiếu thông tin đăng ký' });
  }
});

export default router;
