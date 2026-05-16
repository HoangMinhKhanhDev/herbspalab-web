import mongoose from 'mongoose';
declare const Product: mongoose.Model<{
    isNew: boolean;
    tags: string[];
    description: string;
    name: string;
    rating: number;
    slug: string;
    price: number;
    stock: number;
    numReviews: number;
    category: string;
    images: string[];
    sku?: string | null;
    shortDescription?: string | null;
    salePrice?: number | null;
    badge?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    detailDescription?: string | null;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    isNew: boolean;
    tags: string[];
    description: string;
    name: string;
    rating: number;
    slug: string;
    price: number;
    stock: number;
    numReviews: number;
    category: string;
    images: string[];
    sku?: string | null;
    shortDescription?: string | null;
    salePrice?: number | null;
    badge?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    detailDescription?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    isNew: boolean;
    tags: string[];
    description: string;
    name: string;
    rating: number;
    slug: string;
    price: number;
    stock: number;
    numReviews: number;
    category: string;
    images: string[];
    sku?: string | null;
    shortDescription?: string | null;
    salePrice?: number | null;
    badge?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    detailDescription?: string | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    isNew: boolean;
    tags: string[];
    description: string;
    name: string;
    rating: number;
    slug: string;
    price: number;
    stock: number;
    numReviews: number;
    category: string;
    images: string[];
    sku?: string | null;
    shortDescription?: string | null;
    salePrice?: number | null;
    badge?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    detailDescription?: string | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    isNew: boolean;
    tags: string[];
    description: string;
    name: string;
    rating: number;
    slug: string;
    price: number;
    stock: number;
    numReviews: number;
    category: string;
    images: string[];
    sku?: string | null;
    shortDescription?: string | null;
    salePrice?: number | null;
    badge?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    detailDescription?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    isNew: boolean;
    tags: string[];
    description: string;
    name: string;
    rating: number;
    slug: string;
    price: number;
    stock: number;
    numReviews: number;
    category: string;
    images: string[];
    sku?: string | null;
    shortDescription?: string | null;
    salePrice?: number | null;
    badge?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    detailDescription?: string | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    isNew: boolean;
    tags: string[];
    description: string;
    name: string;
    rating: number;
    slug: string;
    price: number;
    stock: number;
    numReviews: number;
    category: string;
    images: string[];
    sku?: string | null;
    shortDescription?: string | null;
    salePrice?: number | null;
    badge?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    detailDescription?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    isNew: boolean;
    tags: string[];
    description: string;
    name: string;
    rating: number;
    slug: string;
    price: number;
    stock: number;
    numReviews: number;
    category: string;
    images: string[];
    sku?: string | null;
    shortDescription?: string | null;
    salePrice?: number | null;
    badge?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    detailDescription?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default Product;
//# sourceMappingURL=Product.d.ts.map