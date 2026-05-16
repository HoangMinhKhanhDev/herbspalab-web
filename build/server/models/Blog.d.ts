import mongoose from 'mongoose';
declare const Blog: mongoose.Model<{
    tags: string[];
    slug: string;
    title: string;
    content: string;
    isPublished: boolean;
    author: string;
    image?: string | null;
    summary?: string | null;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    tags: string[];
    slug: string;
    title: string;
    content: string;
    isPublished: boolean;
    author: string;
    image?: string | null;
    summary?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    tags: string[];
    slug: string;
    title: string;
    content: string;
    isPublished: boolean;
    author: string;
    image?: string | null;
    summary?: string | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    tags: string[];
    slug: string;
    title: string;
    content: string;
    isPublished: boolean;
    author: string;
    image?: string | null;
    summary?: string | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    tags: string[];
    slug: string;
    title: string;
    content: string;
    isPublished: boolean;
    author: string;
    image?: string | null;
    summary?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    tags: string[];
    slug: string;
    title: string;
    content: string;
    isPublished: boolean;
    author: string;
    image?: string | null;
    summary?: string | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    tags: string[];
    slug: string;
    title: string;
    content: string;
    isPublished: boolean;
    author: string;
    image?: string | null;
    summary?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    tags: string[];
    slug: string;
    title: string;
    content: string;
    isPublished: boolean;
    author: string;
    image?: string | null;
    summary?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default Blog;
//# sourceMappingURL=Blog.d.ts.map