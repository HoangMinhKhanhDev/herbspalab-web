import asyncHandler from 'express-async-handler';
import prisma from '../config/prisma.js';
import { slugify } from '../utils/slugify.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Helper to delete files from disk
const deleteFile = (url) => {
    if (!url || !url.startsWith('/uploads/'))
        return;
    // uploads are at the root of backend
    const filePath = path.join(__dirname, '../../uploads', url.replace('/uploads/', ''));
    if (fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
        }
        catch (err) {
            console.error(`Failed to delete file: ${filePath}`, err);
        }
    }
};
// @desc    Fetch all products with advanced filtering
export const getProducts = asyncHandler(async (req, res) => {
    const { categoryId, minPrice, maxPrice, sort, search, limit = 12, page = 1, isNew, isPreorder } = req.query;
    const where = {};
    if (categoryId) {
        where.categoryId = categoryId;
    }
    if (minPrice || maxPrice) {
        where.price = {
            ...(minPrice ? { gte: Number(minPrice) } : {}),
            ...(maxPrice ? { lte: Number(maxPrice) } : {}),
        };
    }
    if (search) {
        where.OR = [
            { name: { contains: search } },
            { sku: { contains: search } },
            { description: { contains: search } },
            { tags: { contains: search } },
        ];
    }
    if (isNew === 'true')
        where.isNew = true;
    if (isPreorder === 'true')
        where.isPreorder = true;
    let orderBy = { createdAt: 'desc' };
    if (sort === 'price-asc')
        orderBy = { price: 'asc' };
    if (sort === 'price-desc')
        orderBy = { price: 'desc' };
    if (sort === 'rating')
        orderBy = { rating: 'desc' };
    const count = await prisma.product.count({ where });
    const products = await prisma.product.findMany({
        where,
        orderBy,
        take: Number(limit),
        skip: Number(limit) * (Number(page) - 1),
        include: {
            images: true,
            category: true,
            variants: {
                include: {
                    options: {
                        include: {
                            attributeValue: {
                                include: { attribute: true }
                            }
                        }
                    }
                }
            }
        }
    });
    res.json({
        data: products,
        page: Number(page),
        pages: Math.ceil(count / Number(limit)),
        total: count
    });
});
// @desc    Fetch single product by ID or Slug
export const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.findFirst({
        where: {
            OR: [
                { id: id },
                { slug: id }
            ]
        },
        include: {
            images: true,
            category: true,
            variants: {
                include: {
                    options: {
                        include: {
                            attributeValue: {
                                include: { attribute: true }
                            }
                        }
                    }
                }
            },
            reviews: {
                include: {
                    user: {
                        select: { name: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }
        }
    });
    if (product) {
        res.json(product);
    }
    else {
        res.status(404);
        throw new Error('Không tìm thấy sản phẩm');
    }
});
// @desc    Create a product (Admin)
export const createProduct = asyncHandler(async (req, res) => {
    const { name, price, salePrice, description, shortDescription, images, categoryId, stock, sku, badge, videoUrl, isPreorder, isNew, metaTitle, metaDescription, tags, variants, thumbnail, preparationTime, brand, material, condition, weight, length, width, height, sizeGuideUrl } = req.body;
    const slug = slugify(name);
    // Clean tags - ensure it's a string
    const processedTags = Array.isArray(tags) ? tags.join(',') : tags;
    const product = await prisma.product.create({
        data: {
            name,
            slug,
            sku,
            price: Number(price),
            salePrice: salePrice ? Number(salePrice) : null,
            description,
            shortDescription,
            categoryId: categoryId,
            stock: Number(stock),
            badge,
            videoUrl,
            isPreorder: isPreorder === true || isPreorder === 'true',
            isNew: isNew === true || isNew === 'true',
            preparationTime,
            thumbnail,
            metaTitle,
            metaDescription,
            tags: processedTags,
            brand, material, condition, sizeGuideUrl,
            weight: weight ? Number(weight) : null,
            length: length ? Number(length) : null,
            width: width ? Number(width) : null,
            height: height ? Number(height) : null,
            images: {
                create: (images || []).map((img) => ({ url: img }))
            },
            variants: variants ? {
                create: variants.map((v) => ({
                    sku: v.sku,
                    price: Number(v.price),
                    stock: Number(v.stock),
                    options: {
                        create: v.optionIds.map((optId) => ({
                            attributeValueId: optId
                        }))
                    }
                }))
            } : undefined
        },
        include: {
            images: true,
            variants: true
        }
    });
    res.status(201).json(product);
});
// @desc    Update a product (Admin)
export const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, images, variants, tags, ...rest } = req.body;
    const product = await prisma.product.findUnique({ where: { id: id } });
    if (product) {
        // Strip fields that should not be updated directly via scalar data
        // Especially relations and system fields
        const { id: _, createdAt, updatedAt, category, images: __, variants: ___, reviews, orderItems, cartItems, ...restCleaned } = rest;
        const data = {
            name: name || restCleaned.name,
            slug: name ? slugify(name) : restCleaned.slug,
            sku: restCleaned.sku,
            description: restCleaned.description,
            shortDescription: restCleaned.shortDescription,
            price: restCleaned.price !== undefined ? Number(restCleaned.price) : undefined,
            salePrice: restCleaned.salePrice === '' || restCleaned.salePrice === null ? null : (restCleaned.salePrice !== undefined ? Number(restCleaned.salePrice) : undefined),
            stock: restCleaned.stock !== undefined ? Number(restCleaned.stock) : undefined,
            badge: restCleaned.badge,
            videoUrl: restCleaned.videoUrl,
            isNew: restCleaned.isNew !== undefined ? Boolean(restCleaned.isNew) : undefined,
            isPreorder: restCleaned.isPreorder !== undefined ? Boolean(restCleaned.isPreorder) : undefined,
            preparationTime: restCleaned.preparationTime,
            thumbnail: restCleaned.thumbnail,
            metaTitle: restCleaned.metaTitle,
            metaDescription: restCleaned.metaDescription,
            tags: Array.isArray(tags) ? tags.join(',') : tags,
            brand: restCleaned.brand,
            material: restCleaned.material,
            condition: restCleaned.condition,
            sizeGuideUrl: restCleaned.sizeGuideUrl,
            weight: restCleaned.weight !== undefined && restCleaned.weight !== '' && restCleaned.weight !== null ? Number(restCleaned.weight) : null,
            length: restCleaned.length !== undefined && restCleaned.length !== '' && restCleaned.length !== null ? Number(restCleaned.length) : null,
            width: restCleaned.width !== undefined && restCleaned.width !== '' && restCleaned.width !== null ? Number(restCleaned.width) : null,
            height: restCleaned.height !== undefined && restCleaned.height !== '' && restCleaned.height !== null ? Number(restCleaned.height) : null,
        };
        // Use relation syntax to be safe
        if (restCleaned.categoryId) {
            data.category = { connect: { id: restCleaned.categoryId } };
        }
        else if (restCleaned.categoryId === '' || restCleaned.categoryId === null) {
            data.category = { disconnect: true };
        }
        if (images) {
            // Get existing images to cleanup
            const existingProduct = await prisma.product.findUnique({
                where: { id: id },
                include: { images: true }
            });
            // Cleanup images that are no longer in the list
            existingProduct?.images.forEach((img) => {
                if (!images.includes(img.url)) {
                    deleteFile(img.url);
                }
            });
            // Cleanup old thumbnail if changed
            if (restCleaned.thumbnail !== undefined && existingProduct?.thumbnail && existingProduct.thumbnail !== restCleaned.thumbnail) {
                deleteFile(existingProduct.thumbnail);
            }
            // Cleanup old video if changed
            if (restCleaned.videoUrl !== undefined && existingProduct?.videoUrl && existingProduct.videoUrl !== restCleaned.videoUrl) {
                deleteFile(existingProduct.videoUrl);
            }
            await prisma.productImage.deleteMany({ where: { productId: id } });
            data.images = {
                create: images.map((img) => ({ url: img }))
            };
        }
        if (variants) {
            await prisma.productVariant.deleteMany({ where: { productId: id } });
            data.variants = {
                create: variants.map((v) => ({
                    sku: v.sku,
                    price: Number(v.price),
                    stock: Number(v.stock),
                    options: {
                        create: (v.optionIds || []).map((optId) => ({
                            attributeValueId: optId
                        }))
                    }
                }))
            };
        }
        const updatedProduct = await prisma.product.update({
            where: { id: id },
            data,
            include: { images: true, variants: true }
        });
        res.json(updatedProduct);
    }
    else {
        res.status(404);
        throw new Error('Không tìm thấy sản phẩm');
    }
});
// @desc    Delete a product (Admin)
export const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
        where: { id: id },
        include: { images: true }
    });
    if (product) {
        // Delete files from disk
        deleteFile(product.thumbnail);
        deleteFile(product.videoUrl);
        product.images.forEach((img) => deleteFile(img.url));
        await prisma.product.delete({ where: { id: id } });
        res.json({ message: 'Đã xóa sản phẩm và tệp tin liên quan' });
    }
    else {
        res.status(404);
        throw new Error('Không tìm thấy sản phẩm');
    }
});
// Export products to CSV
export const exportProductsCSV = asyncHandler(async (req, res) => {
    const products = await prisma.product.findMany({
        include: { category: true }
    });
    const header = 'name,sku,category,price,salePrice,stock,shortDescription,tags\n';
    const rows = products.map(p => `"${p.name}","${p.sku || ''}","${p.category?.name || ''}",${p.price},${p.salePrice || ''},${p.stock},"${p.shortDescription || ''}","${p.badge || ''}"`).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=products.csv');
    res.send(header + rows);
});
// @desc    Import products from CSV
export const importProductsCSV = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('Vui lòng tải lên file CSV');
    }
    try {
        const csvContent = fs.readFileSync(req.file.path, 'utf-8');
        const lines = csvContent.split(/\r?\n/).filter(l => l.trim());
        if (lines.length < 2) {
            throw new Error('File CSV trống hoặc không đúng định dạng');
        }
        const headerLine = lines[0] || '';
        // Better CSV split that handles quotes and commas
        const splitCSV = (str) => {
            const result = [];
            let start = 0;
            let inQuotes = false;
            for (let i = 0; i < str.length; i++) {
                if (str[i] === '"')
                    inQuotes = !inQuotes;
                if (str[i] === ',' && !inQuotes) {
                    result.push(str.substring(start, i).replace(/^"|"$/g, '').trim());
                    start = i + 1;
                }
            }
            result.push(str.substring(start).replace(/^"|"$/g, '').trim());
            return result;
        };
        const header = splitCSV(headerLine);
        const categories = await prisma.category.findMany();
        const categoryMap = new Map(categories.map(c => [c.name.toLowerCase(), c.id]));
        let imported = 0;
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i] || '';
            const vals = splitCSV(line);
            if (vals.length < 2)
                continue;
            const row = {};
            header.forEach((h, j) => { row[h] = vals[j] || ''; });
            const name = row.name || row.Name || 'Unnamed Product';
            const sku = row.sku || row.SKU || null;
            // Map category name to ID
            let categoryId = row.categoryId || row.CategoryId || null;
            const catName = row.category || row.Category;
            if (!categoryId && catName) {
                categoryId = categoryMap.get(catName.toLowerCase()) || null;
            }
            const productData = {
                name,
                slug: (row.slug || slugify(name)) + '-' + Math.random().toString(36).substring(2, 7),
                sku: sku,
                categoryId: categoryId,
                price: parseFloat(row.price || row.Price) || 0,
                salePrice: (row.salePrice || row.SalePrice) ? parseFloat(row.salePrice || row.SalePrice) : null,
                stock: parseInt(row.stock || row.Stock) || 0,
                shortDescription: row.shortDescription || row.ShortDescription || null,
                description: row.description || row.Description || row.shortDescription || '',
                badge: row.tags || row.Tags || row.badge || null,
            };
            if (sku) {
                // Upsert by SKU if exists, otherwise create
                const existing = await prisma.product.findUnique({ where: { sku } });
                if (existing) {
                    const { slug, ...updateData } = productData; // Don't change slug on update
                    await prisma.product.update({ where: { sku }, data: updateData });
                }
                else {
                    await prisma.product.create({ data: productData });
                }
            }
            else {
                await prisma.product.create({ data: productData });
            }
            imported++;
        }
        fs.unlinkSync(req.file.path);
        res.json({ success: true, imported });
    }
    catch (error) {
        if (req.file)
            fs.unlinkSync(req.file.path);
        res.status(500);
        throw new Error(error.message || 'Lỗi xử lý file CSV');
    }
});
// @desc    Duplicate a product
// @route   POST /api/products/:id/duplicate
export const duplicateProduct = asyncHandler(async (req, res) => {
    const product = await prisma.product.findUnique({
        where: { id: req.params.id },
        include: { images: true, variants: { include: { options: true } } }
    });
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }
    const { id, createdAt, updatedAt, images, variants, ...rest } = product;
    const newProduct = await prisma.product.create({
        data: {
            ...rest,
            name: `${rest.name} (Copy)`,
            sku: rest.sku ? `${rest.sku}-COPY` : null,
            images: {
                create: images.map((img) => ({ url: img.url }))
            }
        }
    });
    res.status(201).json(newProduct);
});
// @desc    Bulk update products (Quick Edit)
// @route   PATCH /api/products/bulk-update
export const bulkUpdateProducts = asyncHandler(async (req, res) => {
    const { updates } = req.body; // Array of { id, price, stock }
    if (!updates || !Array.isArray(updates)) {
        res.status(400);
        throw new Error('Invalid updates data');
    }
    const results = await Promise.all(updates.map(async (u) => {
        return prisma.product.update({
            where: { id: u.id },
            data: {
                ...(u.price !== undefined && { price: parseFloat(u.price) }),
                ...(u.stock !== undefined && { stock: parseInt(u.stock) })
            }
        });
    }));
    res.json({ success: true, count: results.length });
});
//# sourceMappingURL=productController.js.map