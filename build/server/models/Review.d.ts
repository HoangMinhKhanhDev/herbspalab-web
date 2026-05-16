import mongoose from 'mongoose';
declare const Review: mongoose.Model<{
    name: string;
    rating: number;
    product: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    comment: string;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    name: string;
    rating: number;
    product: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    comment: string;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    name: string;
    rating: number;
    product: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    comment: string;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    rating: number;
    product: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    comment: string;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    name: string;
    rating: number;
    product: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    comment: string;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    name: string;
    rating: number;
    product: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    comment: string;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    name: string;
    rating: number;
    product: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    comment: string;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    name: string;
    rating: number;
    product: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    comment: string;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default Review;
//# sourceMappingURL=Review.d.ts.map