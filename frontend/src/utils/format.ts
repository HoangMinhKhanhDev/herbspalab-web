export const formatPrice = (price: number | undefined | null) => {
  if (price === undefined || price === null) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

export const formatDate = (dateString: string | undefined | null) => {
  if (!dateString) return 'Chưa cập nhật';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Ngày không hợp lệ';
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch (e) {
    return 'Lỗi định dạng';
  }
};
