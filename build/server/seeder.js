import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Product from './models/Product.js';
dotenv.config();
connectDB();
import Order from './models/Order.js';
import Blog from './models/Blog.js';
import { slugify } from './utils/slugify.js';
dotenv.config();
connectDB();
const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Blog.deleteMany();
        const createdUsers = await User.insertMany([
            { name: 'Admin User', email: 'admin@herbspalab.com', password: 'admin123', role: 'admin' },
            { name: 'Test Customer', email: 'test@gmail.com', password: 'customer123', role: 'customer' },
        ]);
        const sampleProducts = [
            {
                name: 'Serum Thảo mộc Phục hồi',
                slug: slugify('Serum Thảo mộc Phục hồi'),
                sku: 'HSP-SR-001',
                images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'],
                shortDescription: 'Serum cao cấp chiết xuất từ 12 loại thảo mộc quý hiếm.',
                description: 'Serum cao cấp chiết xuất từ 12 loại thảo mộc quý hiếm, giúp phục hồi và tái tạo làn da tức thì. Công thức độc quyền từ HerbSpaLab giúp da hấp thụ dưỡng chất nhanh chóng mà không gây nhờn rít.',
                category: 'Serum',
                price: 1250000,
                salePrice: 990000,
                stock: 50,
                isNew: true,
                badge: 'Bán chạy',
                tags: ['organic', 'recovery', 'serum'],
            },
            {
                name: 'Kem dưỡng Ngọc Lan Tây',
                slug: slugify('Kem dưỡng Ngọc Lan Tây'),
                sku: 'HSP-CR-002',
                images: ['https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80'],
                shortDescription: 'Kem dưỡng ẩm sâu với hương thơm dịu nhẹ.',
                description: 'Kem dưỡng ẩm sâu với hương thơm dịu nhẹ từ hoa Ngọc Lan Tây, giúp da luôn mềm mịn. Sản phẩm chứa Vitamin E và các loại dầu thực vật tinh khiết.',
                category: 'Kem dưỡng',
                price: 850000,
                stock: 100,
                tags: ['moisturizer', 'ylang-ylang', 'natural'],
            },
            {
                name: 'Sữa rửa mặt Trà Xanh',
                slug: slugify('Sữa rửa mặt Trà Xanh'),
                sku: 'HSP-CL-003',
                images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'],
                shortDescription: 'Làm sạch sâu lỗ chân lông, kháng khuẩn.',
                description: 'Làm sạch sâu lỗ chân lông, kháng khuẩn và ngừa mụn hiệu quả với chiết xuất trà xanh hữu cơ. Cân bằng độ pH cho da sau khi rửa.',
                category: 'Làm sạch',
                price: 350000,
                stock: 200,
                tags: ['cleanser', 'green-tea', 'organic'],
            },
            {
                name: 'Mặt nạ Ngũ cốc Dưỡng sáng',
                slug: slugify('Mặt nạ Ngũ cốc Dưỡng sáng'),
                sku: 'HSP-MK-004',
                images: ['https://images.unsplash.com/photo-1596462502278-27bfad450526?auto=format&fit=crop&w=800&q=80'],
                shortDescription: 'Tẩy tế bào chết nhẹ nhàng và làm sáng da.',
                description: 'Mặt nạ ngũ cốc thiên nhiên giúp tẩy tế bào chết nhẹ nhàng và làm sáng da tự nhiên. Phù hợp cho mọi loại da, đặc biệt là da xỉn màu.',
                category: 'Mặt nạ',
                price: 450000,
                stock: 150,
                tags: ['mask', 'brightening', 'natural'],
            }
        ];
        await Product.insertMany(sampleProducts);
        const sampleBlogs = [
            {
                title: 'Bí quyết dưỡng da từ thảo mộc thiên nhiên',
                slug: slugify('Bí quyết dưỡng da từ thảo mộc thiên nhiên'),
                summary: 'Khám phá những loại thảo mộc quý giúp làn da trẻ trung và rạng rỡ.',
                content: '<p>Thảo mộc thiên nhiên từ lâu đã được sử dụng như một liệu pháp làm đẹp hiệu quả...</p>',
                image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecee?auto=format&fit=crop&w=800&q=80',
                tags: ['dưỡng da', 'thảo mộc'],
            }
        ];
        await Blog.insertMany(sampleBlogs);
        console.log('Data Imported!');
        process.exit();
    }
    catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};
const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Blog.deleteMany();
        console.log('Data Destroyed!');
        process.exit();
    }
    catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};
if (process.argv[2] === '-d') {
    destroyData();
}
else {
    importData();
}
//# sourceMappingURL=seeder.js.map