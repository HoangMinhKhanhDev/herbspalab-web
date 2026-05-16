import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    sku: { type: String, unique: true },
    images: [{ type: String, required: true }], // Multiple images
    shortDescription: { type: String },
    description: { type: String, required: true },
    detailDescription: { type: String },
    category: { type: String, required: true },
    // Pricing
    price: { type: Number, required: true, default: 0 },
    salePrice: { type: Number },
    // SEO
    metaTitle: { type: String },
    metaDescription: { type: String },
    tags: [String],
    // Inventory & Status
    stock: { type: Number, required: true, default: 0 },
    isNew: { type: Boolean, default: false },
    badge: { type: String }, // e.g., "Best Seller", "Organic"
    // Metrics
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
}, { timestamps: true });
const Product = mongoose.model('Product', productSchema);
export default Product;
//# sourceMappingURL=Product.js.map