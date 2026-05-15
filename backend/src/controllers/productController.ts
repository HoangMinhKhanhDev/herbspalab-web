import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import prisma from '../config/prisma.js';
import { slugify } from '../utils/slugify.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to delete files from disk
const deleteFile = (url: string | null | undefined) => {
  if (!url || !url.startsWith('/uploads/')) return;
  // uploads are at the root of backend
  const filePath = path.join(__dirname, '../../uploads', url.replace('/uploads/', ''));
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(`Failed to delete file: ${filePath}`, err);
    }
  }
};

// @desc    Fetch all products with advanced filtering
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const { categoryId, minPrice, maxPrice, sort, search, limit = 12, page = 1, isNew, isPreorder } = req.query;
  
  const where: any = {};

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
      { name: { contains: search as string } },
      { sku: { contains: search as string } },
      { description: { contains: search as string } },
      { tags: { contains: search as string } },
    ];
  }

  if (isNew === 'true') where.isNew = true;
  if (isPreorder === 'true') where.isPreorder = true;

  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price-asc') orderBy = { price: 'asc' };
  if (sort === 'price-desc') orderBy = { price: 'desc' };
  if (sort === 'rating') orderBy = { rating: 'desc' };

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
export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id: id as string },
        { slug: id as string }
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
  } else {
    res.status(404);
    throw new Error('Không tìm thấy sản phẩm');
  }
});

// @desc    Create a product (Admin)
export const createProduct = asyncHandler(async (req: any, res: Response) => {
  const { 
    name, price, salePrice, description, shortDescription, 
    images, categoryId, stock, sku, badge, videoUrl, 
    isPreorder, isNew, metaTitle, metaDescription, tags,
    variants, thumbnail, preparationTime 
  } = req.body;

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
      categoryId: categoryId as string,
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
      images: {
        create: (images || []).map((img: string) => ({ url: img }))
      },
      variants: variants ? {
        create: variants.map((v: any) => ({
          sku: v.sku,
          price: Number(v.price),
          stock: Number(v.stock),
          options: {
            create: v.optionIds.map((optId: string) => ({
              attributeValueId: optId
            }))
          }
        }))
      } : undefined
    } as any,
    include: {
      images: true,
      variants: true
    }
  });

  res.status(201).json(product);
});

// @desc    Update a product (Admin)
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, images, variants, tags, ...rest } = req.body;

  const product = await prisma.product.findUnique({ where: { id: id as string } });

  if (product) {
    // Strip fields that should not be updated directly via scalar data
    // Especially relations and system fields
    const { 
      id: _, 
      createdAt, 
      updatedAt, 
      category, 
      images: __, 
      variants: ___, 
      reviews,
      orderItems,
      cartItems,
      ...restCleaned 
    } = rest;
    
    const data: any = { 
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
      tags: Array.isArray(tags) ? tags.join(',') : tags
    };

    // Use relation syntax to be safe
    if (restCleaned.categoryId) {
      data.category = { connect: { id: restCleaned.categoryId } };
    } else if (restCleaned.categoryId === '' || restCleaned.categoryId === null) {
      data.category = { disconnect: true };
    }
    
    if (images) {
      // Get existing images to cleanup
      const existingProduct = await prisma.product.findUnique({ 
        where: { id: id as string },
        include: { images: true }
      }) as any;

      // Cleanup images that are no longer in the list
      existingProduct?.images.forEach((img: any) => {
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

      await prisma.productImage.deleteMany({ where: { productId: id as string } });
      data.images = {
        create: images.map((img: string) => ({ url: img }))
      };
    }

    if (variants) {
      await prisma.productVariant.deleteMany({ where: { productId: id as string } });
      data.variants = {
        create: variants.map((v: any) => ({
          sku: v.sku,
          price: Number(v.price),
          stock: Number(v.stock),
          options: {
            create: (v.optionIds || []).map((optId: string) => ({
              attributeValueId: optId
            }))
          }
        }))
      };
    }

    const updatedProduct = await prisma.product.update({
      where: { id: id as string },
      data,
      include: { images: true, variants: true }
    });

    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy sản phẩm');
  }
});

// @desc    Delete a product (Admin)
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({ 
    where: { id: id as string },
    include: { images: true }
  }) as any;

  if (product) {
    // Delete files from disk
    deleteFile(product.thumbnail);
    deleteFile(product.videoUrl);
    product.images.forEach((img: any) => deleteFile(img.url));

    await prisma.product.delete({ where: { id: id as string } });
    res.json({ message: 'Đã xóa sản phẩm và tệp tin liên quan' });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy sản phẩm');
  }
});

// Export products to CSV
export const exportProductsCSV = asyncHandler(async (req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    include: { category: true }
  });
  
  const header = 'name,sku,category,price,salePrice,stock,shortDescription,tags\n';
  const rows = products.map(p => 
    `"${p.name}","${p.sku || ''}","${p.category?.name || ''}",${p.price},${p.salePrice || ''},${p.stock},"${p.shortDescription || ''}","${p.badge || ''}"`
  ).join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=products.csv');
  res.send(header + rows);
});

// @desc    Import products from CSV
export const importProductsCSV = asyncHandler(async (req: any, res: Response) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Vui lòng tải lên file CSV');
  }

  const csvContent = fs.readFileSync(req.file.path, 'utf-8');
  const lines = csvContent.split('\n').filter(l => l.trim());
  const headerLine = lines[0] || '';
  const header = headerLine.split(',').map(h => h.trim().replace(/"/g, ''));
  
  let imported = 0;
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i] || '';
    const vals = line.match(/(".*?"|[^,]+)/g)?.map(v => v.replace(/^"|"$/g, '').trim()) || [];
    if (vals.length < 4) continue;
    
    const row: any = {};
    header.forEach((h, j) => { row[h] = vals[j] || ''; });
    
    const name = row.name || 'Unnamed';
    await prisma.product.create({
      data: {
        name,
        slug: slugify(name) + '-' + Date.now(),
        sku: row.sku || null,
        categoryId: row.categoryId || null,
        price: parseFloat(row.price) || 0,
        salePrice: row.salePrice ? parseFloat(row.salePrice) : null,
        stock: parseInt(row.stock) || 0,
        shortDescription: row.shortDescription || null,
        description: row.description || row.shortDescription || '',
      }
    });
    imported++;
  }

  fs.unlinkSync(req.file.path);
  res.json({ success: true, imported });
});

// @desc    Duplicate a product
// @route   POST /api/products/:id/duplicate
export const duplicateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id as string },
    include: { images: true, variants: { include: { options: true } } }
  });

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const { id, createdAt, updatedAt, images, variants, ...rest } = product as any;

  const newProduct = await prisma.product.create({
    data: {
      ...rest,
      name: `${rest.name} (Copy)`,
      sku: rest.sku ? `${rest.sku}-COPY` : null,
      images: {
        create: images.map((img: any) => ({ url: img.url }))
      }
    }
  });

  res.status(201).json(newProduct);
});

// @desc    Bulk update products (Quick Edit)
// @route   PATCH /api/products/bulk-update
export const bulkUpdateProducts = asyncHandler(async (req: Request, res: Response) => {
  const { updates } = req.body; // Array of { id, price, stock }

  if (!updates || !Array.isArray(updates)) {
    res.status(400);
    throw new Error('Invalid updates data');
  }

  const results = await Promise.all(updates.map(async (u: any) => {
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

