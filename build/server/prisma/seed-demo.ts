import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import process from 'node:process';

dotenv.config();

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
function slug(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// ---------------------------------------------------------------------------
// DATA
// ---------------------------------------------------------------------------
const CATEGORIES = [
  { name: 'Serum & Tinh Chất', description: 'Serum và tinh chất thảo mộc chuyên sâu' },
  { name: 'Toner & Nước Hoa Hồng', description: 'Toner dịu nhẹ từ thiên nhiên' },
  { name: 'Kem Dưỡng Ẩm', description: 'Kem dưỡng ẩm từ thảo dược quý' },
  { name: 'Sữa Rửa Mặt', description: 'Làm sạch nhẹ nhàng từ thảo mộc' },
  { name: 'Mặt Nạ', description: 'Mặt nạ thảo dược phục hồi da' },
];

const PRODUCTS = [
  {
    name: 'Serum Vitamin C+ Cam Thảo',
    category: 'Serum & Tinh Chất',
    price: 380000,
    salePrice: 299000,
    stock: 50,
    badge: 'Bán chạy',
    isNew: true,
    rating: 4.8,
    numReviews: 124,
    shortDescription: 'Serum dưỡng sáng chuyên sâu từ chiết xuất cam thảo và vitamin C tự nhiên, giúp mờ thâm và đều màu da.',
    description: `<h3>Giới thiệu sản phẩm</h3>
<p>Serum Vitamin C+ Cam Thảo của HerbSpa Lab là sự kết hợp hoàn hảo giữa vitamin C dạng ổn định và chiết xuất cam thảo nguyên chất. Công thức độc quyền giúp làm sáng da, mờ thâm nám chỉ sau 4 tuần sử dụng đều đặn.</p>
<h3>Thành phần chính</h3>
<ul><li>Vitamin C (Ascorbic Acid 15%) – chống oxy hóa, làm sáng da</li><li>Chiết xuất cam thảo (Glycyrrhiza Glabra) – ức chế melanin</li><li>Niacinamide 5% – thu nhỏ lỗ chân lông</li><li>Hyaluronic Acid – cấp ẩm tức thì</li></ul>
<h3>Hướng dẫn sử dụng</h3>
<p>Sau khi rửa mặt và dùng toner, nhỏ 3–4 giọt ra lòng bàn tay, vỗ nhẹ lên mặt và cổ. Dùng buổi sáng và tối.</p>`,
    thumbnail: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80',
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80',
    ],
    tags: 'serum,vitamin c,làm sáng,thảo mộc',
    weight: 30,
  },
  {
    name: 'Toner Tràm Trà & Nha Đam',
    category: 'Toner & Nước Hoa Hồng',
    price: 220000,
    salePrice: null,
    stock: 80,
    badge: 'Mới',
    isNew: true,
    rating: 4.6,
    numReviews: 87,
    shortDescription: 'Toner dịu nhẹ kết hợp tinh dầu tràm trà và gel nha đam, cân bằng độ ẩm và kiểm soát dầu hiệu quả.',
    description: `<h3>Giới thiệu sản phẩm</h3>
<p>Toner Tràm Trà & Nha Đam không chứa cồn, phù hợp cho mọi loại da đặc biệt là da dầu và da nhạy cảm. Giúp se khít lỗ chân lông và kháng khuẩn tự nhiên.</p>
<h3>Thành phần chính</h3>
<ul><li>Tinh dầu tràm trà (Tea Tree Oil 2%) – kháng khuẩn, ngăn mụn</li><li>Gel nha đam (Aloe Vera 95%) – làm dịu, cấp ẩm</li><li>Witch Hazel – se khít lỗ chân lông</li><li>Panthenol – phục hồi hàng rào da</li></ul>
<h3>Hướng dẫn sử dụng</h3>
<p>Thấm toner lên bông cotton và lau nhẹ toàn mặt hoặc vỗ trực tiếp bằng tay. Dùng sau bước rửa mặt, trước serum.</p>`,
    thumbnail: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&q=80',
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&q=80',
    ],
    tags: 'toner,tràm trà,nha đam,kiểm soát dầu',
    weight: 150,
  },
  {
    name: 'Kem Dưỡng Ẩm Hoa Hồng Dại',
    category: 'Kem Dưỡng Ẩm',
    price: 450000,
    salePrice: 380000,
    stock: 35,
    badge: 'Hot Deal',
    isNew: false,
    rating: 4.9,
    numReviews: 203,
    shortDescription: 'Kem dưỡng ẩm cao cấp từ chiết xuất hoa hồng dại và bơ shea, phục hồi da khô và tăng độ đàn hồi.',
    description: `<h3>Giới thiệu sản phẩm</h3>
<p>Kem Dưỡng Ẩm Hoa Hồng Dại là sản phẩm flagship của HerbSpa Lab, được chiết xuất từ hoa hồng dại vùng núi cao Đà Lạt kết hợp bơ shea hữu cơ. Texture nhẹ, thẩm thấu nhanh, không gây bít lỗ chân lông.</p>
<h3>Thành phần chính</h3>
<ul><li>Chiết xuất hoa hồng dại (Rosehip Extract 10%) – tái tạo da</li><li>Shea Butter hữu cơ – dưỡng ẩm sâu 24h</li><li>Retinol tự nhiên từ rosehip – chống lão hóa</li><li>Ceramide – tăng cường hàng rào bảo vệ da</li></ul>
<h3>Hướng dẫn sử dụng</h3>
<p>Lấy lượng kem bằng hạt đậu, massage nhẹ lên mặt và cổ theo chuyển động tròn. Dùng sáng và tối sau bước serum.</p>`,
    thumbnail: 'https://images.unsplash.com/photo-1631390285854-3cf8a4f44ef2?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1631390285854-3cf8a4f44ef2?w=600&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80',
      'https://images.unsplash.com/photo-1570194065650-d99fb4b38e8e?w=600&q=80',
    ],
    tags: 'kem dưỡng,hoa hồng,dưỡng ẩm,chống lão hóa',
    weight: 50,
  },
  {
    name: 'Sữa Rửa Mặt Bột Gạo Nhật',
    category: 'Sữa Rửa Mặt',
    price: 185000,
    salePrice: null,
    stock: 120,
    badge: null,
    isNew: false,
    rating: 4.5,
    numReviews: 56,
    shortDescription: 'Sữa rửa mặt từ bột gạo Nhật và chiết xuất lá trà xanh, làm sạch nhẹ nhàng không gây khô da.',
    description: `<h3>Giới thiệu sản phẩm</h3>
<p>Sữa Rửa Mặt Bột Gạo Nhật mang lại cảm giác sạch thoáng nhưng không mất đi độ ẩm tự nhiên của da. Công thức pH 5.5 cân bằng, phù hợp da nhạy cảm và da khô.</p>
<h3>Thành phần chính</h3>
<ul><li>Bột gạo Nhật (Rice Bran Powder) – tẩy tế bào chết nhẹ nhàng</li><li>Chiết xuất trà xanh – chống oxy hóa, kháng viêm</li><li>Amino Acid surfactants – làm sạch dịu nhẹ</li><li>Glycerin – giữ ẩm sau rửa mặt</li></ul>
<h3>Hướng dẫn sử dụng</h3>
<p>Lấy lượng bằng đồng xu, tạo bọt với nước ấm rồi massage lên mặt 60 giây. Rửa sạch với nước. Dùng sáng và tối.</p>`,
    thumbnail: 'https://images.unsplash.com/photo-1556228841-a3c527ebefe5?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1556228841-a3c527ebefe5?w=600&q=80',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80',
    ],
    tags: 'sữa rửa mặt,bột gạo,nhật bản,da nhạy cảm',
    weight: 120,
  },
  {
    name: 'Mặt Nạ Đất Sét Bạc Hà',
    category: 'Mặt Nạ',
    price: 290000,
    salePrice: 240000,
    stock: 60,
    badge: 'Giảm 17%',
    isNew: false,
    rating: 4.7,
    numReviews: 91,
    shortDescription: 'Mặt nạ đất sét kaolin kết hợp tinh dầu bạc hà, hút sạch bã nhờn và làm mát da tức thì.',
    description: `<h3>Giới thiệu sản phẩm</h3>
<p>Mặt Nạ Đất Sét Bạc Hà là giải pháp lý tưởng cho da dầu và da mụn. Đất sét kaolin hút ẩm và bã nhờn từ sâu bên trong lỗ chân lông, trong khi bạc hà mang lại cảm giác mát lạnh tức thì.</p>
<h3>Thành phần chính</h3>
<ul><li>Kaolin Clay 20% – hút bã nhờn, làm sạch lỗ chân lông</li><li>Tinh dầu bạc hà (Peppermint Oil) – làm mát, kháng khuẩn</li><li>Bentonite Clay – detox da chuyên sâu</li><li>Allantoin – làm dịu sau mặt nạ</li></ul>
<h3>Hướng dẫn sử dụng</h3>
<p>Thoa đều lên mặt (tránh vùng mắt và môi), để 15–20 phút rồi rửa sạch. Dùng 1–2 lần/tuần.</p>`,
    thumbnail: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80',
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80',
    ],
    tags: 'mặt nạ,đất sét,bạc hà,da dầu,mụn',
    weight: 80,
  },
  {
    name: 'Serum Collagen Sâm Tươi',
    category: 'Serum & Tinh Chất',
    price: 680000,
    salePrice: 580000,
    stock: 25,
    badge: 'Cao cấp',
    isNew: true,
    rating: 4.9,
    numReviews: 47,
    shortDescription: 'Serum chống lão hóa cao cấp từ chiết xuất sâm tươi Hàn Quốc và collagen thủy phân, căng mịn da rõ rệt.',
    description: `<h3>Giới thiệu sản phẩm</h3>
<p>Serum Collagen Sâm Tươi là sản phẩm đỉnh cao trong dòng anti-aging của HerbSpa Lab. Chiết xuất sâm tươi Hàn Quốc phối hợp với collagen thủy phân phân tử nhỏ giúp da căng bóng và giảm nếp nhăn chỉ sau 2 tuần.</p>
<h3>Thành phần chính</h3>
<ul><li>Panax Ginseng Extract 8% – tái sinh tế bào da</li><li>Hydrolyzed Collagen – điền đầy nếp nhăn</li><li>Retinyl Palmitate – kích thích tái tạo da</li><li>Peptide EGF – yếu tố tăng trưởng biểu bì</li></ul>
<h3>Hướng dẫn sử dụng</h3>
<p>Nhỏ 2–3 giọt ra bàn tay, vỗ nhẹ lên mặt. Dùng buổi tối sau toner, trước kem dưỡng. Tránh ánh nắng trực tiếp sau sử dụng.</p>`,
    thumbnail: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1617897903246-719242758050?w=600&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80',
    ],
    tags: 'serum,collagen,sâm,chống lão hóa,cao cấp',
    weight: 30,
  },
  {
    name: 'Toner Hoa Cúc Dịu Nhẹ',
    category: 'Toner & Nước Hoa Hồng',
    price: 195000,
    salePrice: null,
    stock: 90,
    badge: null,
    isNew: false,
    rating: 4.4,
    numReviews: 38,
    shortDescription: 'Toner chiết xuất hoa cúc La Mã, làm dịu da đỏ kích ứng và cấp ẩm nhẹ nhàng cho da nhạy cảm.',
    description: `<h3>Giới thiệu sản phẩm</h3>
<p>Toner Hoa Cúc được chiết xuất từ hoa cúc La Mã (Chamomile) hữu cơ, nổi tiếng với khả năng làm dịu và giảm kích ứng. Phù hợp đặc biệt cho da nhạy cảm, da bị đỏ hoặc sau khi tiếp xúc với tia UV.</p>
<h3>Thành phần chính</h3>
<ul><li>Chamomile Extract hữu cơ 10% – làm dịu, kháng viêm</li><li>Bisabolol – giảm đỏ và kích ứng</li><li>Beta-Glucan – tăng cường miễn dịch da</li><li>Rose Water – cấp ẩm, thơm nhẹ</li></ul>`,
    thumbnail: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80',
    ],
    tags: 'toner,hoa cúc,da nhạy cảm,làm dịu',
    weight: 150,
  },
  {
    name: 'Kem Dưỡng Ban Đêm Nhân Sâm',
    category: 'Kem Dưỡng Ẩm',
    price: 520000,
    salePrice: 420000,
    stock: 40,
    badge: null,
    isNew: false,
    rating: 4.7,
    numReviews: 76,
    shortDescription: 'Kem dưỡng phục hồi ban đêm từ nhân sâm và dầu argan, giúp da tái tạo và căng mịn khi ngủ.',
    description: `<h3>Giới thiệu sản phẩm</h3>
<p>Kem Dưỡng Ban Đêm Nhân Sâm là sản phẩm chăm sóc da toàn diện trong khi ngủ. Công thức giàu dưỡng chất giúp da phục hồi tổn thương sau ngày dài tiếp xúc với ô nhiễm và UV.</p>
<h3>Thành phần chính</h3>
<ul><li>Panax Ginseng Root Extract – chống lão hóa, căng da</li><li>Argan Oil – dưỡng ẩm, làm mềm da</li><li>Bakuchiol – retinol tự nhiên an toàn</li><li>Adenosine – giảm nếp nhăn</li></ul>`,
    thumbnail: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38e8e?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1570194065650-d99fb4b38e8e?w=600&q=80',
      'https://images.unsplash.com/photo-1631390285854-3cf8a4f44ef2?w=600&q=80',
    ],
    tags: 'kem đêm,nhân sâm,phục hồi,chống lão hóa',
    weight: 50,
  },
  {
    name: 'Mặt Nạ Ngủ Mật Ong Manuka',
    category: 'Mặt Nạ',
    price: 360000,
    salePrice: null,
    stock: 45,
    badge: 'Mới',
    isNew: true,
    rating: 4.8,
    numReviews: 29,
    shortDescription: 'Sleeping mask từ mật ong Manuka New Zealand và chiết xuất lô hội, cấp ẩm chuyên sâu suốt đêm.',
    description: `<h3>Giới thiệu sản phẩm</h3>
<p>Mặt Nạ Ngủ Mật Ong Manuka sử dụng mật ong Manuka UMF 15+ từ New Zealand, nổi tiếng với hoạt tính kháng khuẩn và dưỡng ẩm vượt trội. Kết hợp cùng aloe vera và collagen, da bạn sẽ mềm mịn ngay sáng hôm sau.</p>
<h3>Thành phần chính</h3>
<ul><li>Manuka Honey UMF 15+ – kháng khuẩn, dưỡng ẩm sâu</li><li>Aloe Vera Gel 70% – làm dịu, cấp nước</li><li>Collagen Tripeptide – căng mịn da</li><li>Centella Asiatica – phục hồi và chữa lành</li></ul>
<h3>Hướng dẫn sử dụng</h3>
<p>Thoa lớp mỏng lên mặt sau bước dưỡng da tối. Không cần rửa, để qua đêm cho da hấp thụ. Sáng rửa mặt bình thường.</p>`,
    thumbnail: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1617897903246-719242758050?w=600&q=80',
    ],
    tags: 'mặt nạ ngủ,mật ong,manuka,dưỡng ẩm',
    weight: 70,
  },
  {
    name: 'Sữa Rửa Mặt Nghệ & Mật Ong',
    category: 'Sữa Rửa Mặt',
    price: 165000,
    salePrice: 140000,
    stock: 100,
    badge: null,
    isNew: false,
    rating: 4.3,
    numReviews: 44,
    shortDescription: 'Sữa rửa mặt từ nghệ vàng và mật ong rừng, làm sạch nhẹ nhàng đồng thời làm sáng và cấp ẩm cho da.',
    description: `<h3>Giới thiệu sản phẩm</h3>
<p>Sữa Rửa Mặt Nghệ & Mật Ong là sự kết hợp truyền thống và hiện đại. Curcumin từ nghệ vàng kháng viêm và làm sáng da, mật ong rừng giữ ẩm và nuôi dưỡng da mỗi ngày.</p>
<h3>Thành phần chính</h3>
<ul><li>Curcuma Longa Extract (Nghệ) – kháng viêm, làm sáng</li><li>Honey Extract – dưỡng ẩm, kháng khuẩn</li><li>Coconut-derived surfactants – làm sạch dịu nhẹ</li><li>Vitamin E – bảo vệ da khỏi gốc tự do</li></ul>`,
    thumbnail: 'https://images.unsplash.com/photo-1556228841-a3c527ebefe5?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1556228841-a3c527ebefe5?w=600&q=80',
    ],
    tags: 'sữa rửa mặt,nghệ,mật ong,làm sáng',
    weight: 100,
  },
];

const BLOGS = [
  {
    title: '5 Bước Skincare Tối Giản Cho Người Mới Bắt Đầu',
    summary: 'Xây dựng quy trình chăm sóc da từ đầu không hề khó. Hãy bắt đầu với 5 bước cơ bản này để có làn da khỏe mạnh.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80',
    tags: 'skincare,người mới,chăm sóc da',
    content: `<h2>Tại sao cần có quy trình skincare?</h2>
<p>Chăm sóc da không phải là xa xỉ – đó là đầu tư cho sức khỏe dài hạn. Làn da khỏe mạnh giúp bạn tự tin hơn và bảo vệ cơ thể khỏi các tác nhân môi trường.</p>

<h2>Bước 1: Rửa Mặt (Cleansing)</h2>
<p>Đây là bước quan trọng nhất. Hãy chọn sữa rửa mặt có pH 5–5.5 phù hợp loại da. Rửa mặt 2 lần/ngày – buổi sáng và tối. Massage nhẹ trong 60 giây để làm sạch hiệu quả.</p>
<blockquote><em>"Một làn da sạch là nền tảng của mọi bước dưỡng tiếp theo."</em></blockquote>

<h2>Bước 2: Toner (Cân Bằng Da)</h2>
<p>Toner giúp cân bằng pH da sau rửa mặt và chuẩn bị cho da hấp thụ dưỡng chất tốt hơn. Chọn toner không cồn cho da nhạy cảm.</p>

<h2>Bước 3: Serum (Điều Trị Chuyên Sâu)</h2>
<p>Serum chứa nồng độ hoạt chất cao giải quyết vấn đề cụ thể: mụn, thâm, lão hóa... Chỉ cần 2–3 giọt là đủ cho toàn mặt.</p>

<h2>Bước 4: Dưỡng Ẩm (Moisturizer)</h2>
<p>Khóa ẩm và các dưỡng chất từ bước trước. Đây là bước không thể bỏ qua dù là da dầu hay da khô.</p>

<h2>Bước 5: Chống Nắng (SPF) – Buổi Sáng</h2>
<p>SPF là bước anti-aging hiệu quả nhất. Dùng SPF 30+ hàng ngày, kể cả ngày mưa hay ở trong nhà.</p>

<h2>Lời Khuyên Từ Chuyên Gia HerbSpa Lab</h2>
<p>Đừng thay đổi quá nhiều sản phẩm cùng lúc. Hãy bắt đầu từ những sản phẩm cơ bản, dùng ít nhất 4–8 tuần trước khi đánh giá hiệu quả.</p>`,
  },
  {
    title: 'Chiết Xuất Thảo Mộc Nào Tốt Nhất Cho Da Nhạy Cảm?',
    summary: 'Da nhạy cảm cần được chăm sóc đặc biệt. Khám phá top 6 chiết xuất thảo mộc được chuyên gia da liễu khuyên dùng.',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200&q=80',
    tags: 'thảo mộc,da nhạy cảm,thành phần',
    content: `<h2>Da Nhạy Cảm Là Gì?</h2>
<p>Da nhạy cảm là loại da dễ bị đỏ, ngứa, bỏng rát hoặc kích ứng khi tiếp xúc với các tác nhân bên ngoài như thời tiết, mỹ phẩm hoặc stress. Khoảng 60% dân số Á Đông có làn da thuộc loại này.</p>

<h2>1. Hoa Cúc La Mã (Chamomile)</h2>
<p>Chamomile chứa Bisabolol và Chamazulene – hai hoạt chất kháng viêm và làm dịu da mạnh nhất trong tự nhiên. Nghiên cứu lâm sàng cho thấy chamomile giảm đỏ da hiệu quả đến 70% sau 4 tuần.</p>

<h2>2. Rau Má (Centella Asiatica)</h2>
<p>Madecassoside và Asiaticoside trong rau má giúp tái tạo hàng rào bảo vệ da và thúc đẩy tổng hợp collagen. Đây là "siêu nguyên liệu" được dùng rộng rãi trong y học Ayurveda hàng nghìn năm.</p>

<h2>3. Lô Hội (Aloe Vera)</h2>
<p>Gel lô hội chứa hơn 200 hoạt chất sinh học. Acemannan trong aloe vera tạo màng bảo vệ da và kháng khuẩn tự nhiên. Phù hợp cho cả da dầu và da khô nhạy cảm.</p>

<h2>4. Trà Xanh (Green Tea)</h2>
<p>EGCG (Epigallocatechin gallate) – chất chống oxy hóa mạnh nhất trong trà xanh – bảo vệ da khỏi tia UV và làm chậm quá trình lão hóa.</p>

<h2>5. Nghệ (Turmeric/Curcumin)</h2>
<p>Curcumin ức chế NFkB – yếu tố chính gây viêm da. Ngoài ra, nghệ còn làm đều màu da và mờ vết thâm sau mụn.</p>

<h2>6. Cam Thảo (Licorice Root)</h2>
<p>Glabridin trong cam thảo ức chế enzyme tyrosinase, giảm sản xuất melanin và làm sáng đều màu da mà không gây kích ứng như hydroquinone.</p>`,
  },
  {
    title: 'Vitamin C Trong Skincare: Sự Thật Và Hiểu Lầm',
    summary: 'Vitamin C là hoạt chất được tìm kiếm nhiều nhất trong skincare. Nhưng bạn có đang dùng đúng cách không?',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1200&q=80',
    tags: 'vitamin c,serum,hoạt chất,làm sáng da',
    content: `<h2>Vitamin C Hoạt Động Như Thế Nào?</h2>
<p>Vitamin C (Ascorbic Acid) là chất chống oxy hóa mạnh, hoạt động theo 3 cơ chế chính: trung hòa gốc tự do, ức chế tổng hợp melanin và kích thích sản xuất collagen.</p>

<h2>Các Dạng Vitamin C Phổ Biến</h2>
<ul>
<li><strong>L-Ascorbic Acid</strong> – dạng thuần, hiệu quả nhất nhưng dễ oxy hóa, pH thấp (3–3.5) có thể gây kích ứng</li>
<li><strong>Ascorbyl Glucoside</strong> – ổn định hơn, ít kích ứng, hiệu quả thấp hơn đôi chút</li>
<li><strong>Sodium Ascorbyl Phosphate</strong> – dạng muối ổn định, tốt cho da dầu mụn</li>
<li><strong>Ethyl Ascorbic Acid</strong> – cân bằng tốt giữa hiệu quả và độ ổn định</li>
</ul>

<h2>Hiểu Lầm 1: Vitamin C Không Thể Dùng Ban Ngày</h2>
<p><strong>Sai!</strong> Vitamin C hoạt động như lớp giáp chống oxy hóa, bảo vệ da khỏi UV khi kết hợp với kem chống nắng. Thực tế, ban ngày là thời điểm lý tưởng để dùng.</p>

<h2>Hiểu Lầm 2: Vitamin C Không Thể Dùng Cùng Retinol</h2>
<p>Hoàn toàn có thể, nhưng hãy dùng vào buổi sáng (Vitamin C) và buổi tối (Retinol) để tối ưu hiệu quả và tránh tương tác.</p>

<h2>Cách Bảo Quản Vitamin C Đúng Cách</h2>
<p>Bảo quản nơi tối, mát (dưới 25°C). Sản phẩm đổi màu vàng đậm hoặc cam là dấu hiệu đã oxy hóa – không nên dùng vì có thể gây thêm thâm.</p>`,
  },
  {
    title: 'Routine Chăm Sóc Da Mùa Hè: Giữ Da Sáng Mịn Dưới Nắng',
    summary: 'Mùa hè nắng nóng là thử thách lớn cho làn da. Cùng HerbSpa Lab xây dựng routine hoàn hảo chống nắng và giữ ẩm.',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200&q=80',
    tags: 'mùa hè,chống nắng,routine,da dầu',
    content: `<h2>Tại Sao Da Cần Được Chăm Sóc Khác Biệt Vào Mùa Hè?</h2>
<p>Nhiệt độ cao và độ ẩm tăng khiến tuyến bã nhờn hoạt động mạnh hơn, lỗ chân lông bít tắc dễ hơn và UV ở mức cao nhất trong năm. Routine mùa hè cần nhẹ hơn nhưng tập trung vào bảo vệ và kiểm soát.</p>

<h2>Buổi Sáng: Routine 4 Bước</h2>
<ol>
<li><strong>Rửa mặt nhẹ nhàng</strong> – Dùng gel hoặc foam rửa mặt, tránh dạng cream nặng</li>
<li><strong>Toner kiểm soát dầu</strong> – Tràm trà, witch hazel hoặc niacinamide</li>
<li><strong>Serum Vitamin C mỏng</strong> – Bảo vệ chống oxy hóa từ UV</li>
<li><strong>Kem chống nắng SPF 50+</strong> – Không thể bỏ qua, thoa lại sau 2 tiếng</li>
</ol>

<h2>Buổi Tối: Tập Trung Phục Hồi</h2>
<ol>
<li><strong>Tẩy trang</strong> – Loại bỏ kem chống nắng và bụi bẩn tích tụ</li>
<li><strong>Rửa mặt double cleanse</strong></li>
<li><strong>Toner cấp ẩm</strong> – Hoa cúc hoặc nha đam</li>
<li><strong>Serum dưỡng ẩm</strong> – Hyaluronic Acid, B5</li>
<li><strong>Kem dưỡng ẩm nhẹ</strong> – Gel cream thay vì cream đặc</li>
</ol>

<h2>Tips Đặc Biệt Cho Mùa Hè</h2>
<ul>
<li>Tẩy tế bào chết 1 lần/tuần để lỗ chân lông thông thoáng</li>
<li>Dùng mặt nạ đất sét 1 lần/tuần cho da dầu</li>
<li>Uống đủ 2–3 lít nước/ngày</li>
<li>Đội mũ rộng vành và dùng ô khi ra ngoài</li>
</ul>`,
  },
  {
    title: 'Retinol & Bakuchiol: Đâu Là Lựa Chọn Phù Hợp Cho Bạn?',
    summary: 'Retinol nổi tiếng là "vàng" chống lão hóa nhưng gây kích ứng. Bakuchiol tự nhiên có thể thay thế không? Giải đáp đầy đủ ngay đây.',
    image: 'https://images.unsplash.com/photo-1631390285854-3cf8a4f44ef2?w=1200&q=80',
    tags: 'retinol,bakuchiol,chống lão hóa,thành phần',
    content: `<h2>Retinol Là Gì?</h2>
<p>Retinol là dạng vitamin A được chứng minh lâm sàng có hiệu quả chống lão hóa, mờ nếp nhăn và làm đều màu da. Tuy nhiên, retinol có thể gây bong tróc, đỏ và nhạy cảm với ánh sáng – đặc biệt ở giai đoạn đầu sử dụng ("retinol uglies").</p>

<h2>Bakuchiol Là Gì?</h2>
<p>Bakuchiol là chiết xuất từ hạt cây Babchi (Psoralea corylifolia), đã được sử dụng trong y học Ayurveda hàng nghìn năm. Nghiên cứu năm 2018 trên British Journal of Dermatology chỉ ra Bakuchiol có hiệu quả tương đương retinol 0.5% trong việc giảm nếp nhăn nhưng ít gây kích ứng hơn đáng kể.</p>

<h2>So Sánh Chi Tiết</h2>
<table>
<tr><th>Tiêu chí</th><th>Retinol</th><th>Bakuchiol</th></tr>
<tr><td>Hiệu quả</td><td>★★★★★</td><td>★★★★</td></tr>
<tr><td>Kích ứng</td><td>Cao</td><td>Thấp</td></tr>
<tr><td>Phù hợp da nhạy cảm</td><td>Không khuyến khích</td><td>Phù hợp</td></tr>
<tr><td>Dùng ban ngày</td><td>Không (nhạy sáng)</td><td>Có thể</td></tr>
<tr><td>Dùng khi mang thai</td><td>Không</td><td>Cần tham khảo BS</td></tr>
</table>

<h2>Khi Nào Nên Chọn Retinol?</h2>
<p>Nếu bạn trên 35 tuổi, da dày, không nhạy cảm và đã quen với các hoạt chất mạnh – retinol sẽ mang lại kết quả rõ ràng hơn. Bắt đầu với nồng độ thấp (0.025–0.05%) và tăng dần.</p>

<h2>Khi Nào Nên Chọn Bakuchiol?</h2>
<p>Da nhạy cảm, da bầu, da dễ đỏ, hoặc bạn mới bắt đầu với anti-aging – Bakuchiol là lựa chọn an toàn và hiệu quả. HerbSpa Lab sử dụng Bakuchiol trong dòng sản phẩm dưỡng ban đêm chính xác vì lý do này.</p>`,
  },
];

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------
async function main() {
  console.log('🌱 Starting demo seed...\n');

  // 1. Categories
  console.log('📂 Creating categories...');
  const categoryMap = new Map<string, string>();
  for (const cat of CATEGORIES) {
    const existing = await prisma.category.findFirst({ where: { slug: slug(cat.name) } });
    if (existing) {
      categoryMap.set(cat.name, existing.id);
      console.log(`   ⏩ Skipped (exists): ${cat.name}`);
    } else {
      const created = await prisma.category.create({
        data: { name: cat.name, slug: slug(cat.name), description: cat.description },
      });
      categoryMap.set(cat.name, created.id);
      console.log(`   ✅ Created: ${cat.name}`);
    }
  }

  // 2. Products
  console.log('\n📦 Creating products...');
  for (const p of PRODUCTS) {
    const productSlug = slug(p.name);
    const existing = await prisma.product.findFirst({ where: { slug: productSlug } });
    if (existing) {
      console.log(`   ⏩ Skipped (exists): ${p.name}`);
      continue;
    }

    const categoryId = categoryMap.get(p.category) ?? null;
    const product = await prisma.product.create({
      data: {
        name: p.name,
        slug: productSlug,
        description: p.description,
        shortDescription: p.shortDescription,
        price: p.price,
        salePrice: p.salePrice,
        stock: p.stock,
        badge: p.badge,
        isNew: p.isNew,
        rating: p.rating,
        numReviews: p.numReviews,
        thumbnail: p.thumbnail,
        tags: p.tags,
        weight: p.weight,
        brand: 'HerbSpa Lab',
        condition: 'Mới',
        categoryId,
        images: {
          create: p.images.map(url => ({ url })),
        },
      },
    });
    console.log(`   ✅ Created: ${product.name}`);
  }

  // 3. Blogs
  console.log('\n📰 Creating blog posts...');
  for (const b of BLOGS) {
    const blogSlug = slug(b.title);
    const existing = await prisma.blog.findFirst({ where: { slug: blogSlug } });
    if (existing) {
      console.log(`   ⏩ Skipped (exists): ${b.title}`);
      continue;
    }

    const blog = await prisma.blog.create({
      data: {
        title: b.title,
        slug: blogSlug,
        content: b.content,
        summary: b.summary,
        image: b.image,
        tags: b.tags,
        isPublished: true,
      },
    });
    console.log(`   ✅ Created: ${blog.title}`);
  }

  console.log('\n✨ Demo seed completed!');
  console.log(`   ${CATEGORIES.length} categories`);
  console.log(`   ${PRODUCTS.length} products`);
  console.log(`   ${BLOGS.length} blog posts`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
