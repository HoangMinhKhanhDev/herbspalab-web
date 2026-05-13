import nodemailer from 'nodemailer';
import { logger } from './logger.js';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.MAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const mailer = {
  async sendOrderConfirmation(to: string, order: any) {
    try {
      const shippingAddress = typeof order.shippingInfo === 'string' 
        ? JSON.parse(order.shippingInfo) 
        : order.shippingInfo;

      const info = await transporter.sendMail({
        from: `"HerbSpaLab" <${process.env.MAIL_USER}>`,
        to,
        subject: `Xác nhận đơn hàng #${order.id} – HerbSpaLab`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #15803d; text-align: center;">Cảm ơn bạn đã tin chọn HerbSpaLab!</h2>
            <p>Xin chào,</p>
            <p>Chúng tôi đã nhận được đơn hàng <b>#${order.id}</b> của bạn và đang chuẩn bị những sản phẩm tinh khiết nhất để gửi đi.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <h3>Chi tiết đơn hàng:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              ${order.orderItems.map((item: any) => `
                <tr>
                  <td style="padding: 10px 0;">${item.name} x ${item.qty}</td>
                  <td style="text-align: right;">${item.price.toLocaleString()}₫</td>
                </tr>
              `).join('')}
              <tr style="font-weight: bold;">
                <td style="padding: 20px 0; border-top: 1px solid #eee;">Tổng cộng:</td>
                <td style="text-align: right; border-top: 1px solid #eee;">${order.totalPrice.toLocaleString()}₫</td>
              </tr>
            </table>
            <p style="margin-top: 30px;"><b>Địa chỉ giao hàng:</b><br>${shippingAddress.address}, ${shippingAddress.city}</p>
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-top: 30px; text-align: center;">
              <p style="margin: 0; font-size: 13px; color: #6b7280;">Nếu có bất kỳ thắc mắc nào, đừng ngần ngại liên hệ với chúng tôi qua Zalo hoặc Hotline nhé!</p>
            </div>
          </div>
        `,
      });
      logger.info(`Order confirmation email sent to ${to}: ${info.messageId}`);
    } catch (error) {
      logger.error('Email sending failed:', error);
    }
  },

  async sendPasswordReset(to: string, token: string) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    try {
      await transporter.sendMail({
        from: `"HerbSpaLab" <${process.env.MAIL_USER}>`,
        to,
        subject: 'Đặt lại mật khẩu của bạn – HerbSpaLab',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
            <h2>Yêu cầu đặt lại mật khẩu</h2>
            <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
            <p>Vui lòng nhấn vào nút bên dưới để tiến hành:</p>
            <a href="${resetUrl}" style="display: inline-block; background: #15803d; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Đặt lại mật khẩu</a>
            <p>Link này sẽ hết hạn sau 1 giờ. Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này nhé.</p>
          </div>
        `,
      });
    } catch (error) {
      logger.error('Reset password email failed:', error);
    }
  }
};

export default mailer;
