import { Link, useSearchParams } from 'react-router-dom';

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');

  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1.5rem',
      padding: '4rem 2rem',
      textAlign: 'center',
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: '#dcfce7', color: '#15803d',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '2.5rem',
      }}>✓</div>
      <h1 style={{ fontFamily: 'serif', color: '#1a3a2a', fontSize: '2rem', margin: 0 }}>
        Cảm ơn bạn! Đơn hàng đã được ghi nhận.
      </h1>
      <p style={{ maxWidth: 520, color: '#4b5563', lineHeight: 1.6 }}>
        Chúng tôi đã nhận được thanh toán và sẽ liên hệ xác nhận trong thời gian sớm nhất.
        Vui lòng kiểm tra email để xem chi tiết đơn hàng.
      </p>
      {sessionId && (
        <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
          Mã giao dịch: <code>{sessionId}</code>
        </p>
      )}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <Link to="/" style={{
          padding: '0.75rem 1.5rem', background: '#1a3a2a', color: '#fff',
          borderRadius: 8, textDecoration: 'none', fontWeight: 600,
        }}>Về trang chủ</Link>
        <Link to="/profile" style={{
          padding: '0.75rem 1.5rem', background: '#fff', color: '#1a3a2a',
          border: '1px solid #1a3a2a', borderRadius: 8, textDecoration: 'none', fontWeight: 600,
        }}>Xem đơn hàng</Link>
      </div>
    </div>
  );
}
