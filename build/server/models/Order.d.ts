import mongoose from 'mongoose';
declare const Order: mongoose.Model<{
    orderItems: mongoose.Types.DocumentArray<{
        name: string;
        product: mongoose.Types.ObjectId;
        price: number;
        qty: number;
        image: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        name: string;
        product: mongoose.Types.ObjectId;
        price: number;
        qty: number;
        image: string;
    }, {}, {}> & {
        name: string;
        product: mongoose.Types.ObjectId;
        price: number;
        qty: number;
        image: string;
    }>;
    user: mongoose.Types.ObjectId;
    paymentMethod: string;
    totalPrice: number;
    status: string;
    isPaid: boolean;
    isDelivered: boolean;
    shippingAddress?: {
        phone: string;
        address: string;
        city: string;
    } | null;
    paymentId?: string | null;
    paidAt?: NativeDate | null;
    deliveredAt?: NativeDate | null;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    orderItems: mongoose.Types.DocumentArray<{
        name: string;
        product: mongoose.Types.ObjectId;
        price: number;
        qty: number;
        image: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        name: string;
        product: mongoose.Types.ObjectId;
        price: number;
        qty: number;
        image: string;
    }, {}, {}> & {
        name: string;
        product: mongoose.Types.ObjectId;
        price: number;
        qty: number;
        image: string;
    }>;
    user: mongoose.Types.ObjectId;
    paymentMethod: string;
    totalPrice: number;
    status: string;
    isPaid: boolean;
    isDelivered: boolean;
    shippingAddress?: {
        phone: string;
        address: string;
        city: string;
    } | null;
    paymentId?: string | null;
    paidAt?: NativeDate | null;
    deliveredAt?: NativeDate | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    orderItems: mongoose.Types.DocumentArray<{
        name: string;
        product: mongoose.Types.ObjectId;
        price: number;
        qty: number;
        image: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        name: string;
        product: mongoose.Types.ObjectId;
        price: number;
        qty: number;
        image: string;
    }, {}, {}> & {
        name: string;
        product: mongoose.Types.ObjectId;
        price: number;
        qty: number;
        image: string;
    }>;
    user: mongoose.Types.ObjectId;
    paymentMethod: string;
    totalPrice: number;
    status: string;
    isPaid: boolean;
    isDelivered: boolean;
    shippingAddress?: {
        phone: string;
        address: string;
        city: string;
    } | null;
    paymentId?: string | null;
    paidAt?: NativeDate | null;
    deliveredAt?: NativeDate | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    orderItems: mongoose.Types.DocumentArray<{
        name: string;
        product: mongoose.Types.ObjectId;
        price: number;
        qty: number;
        image: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        name: string;
        product: mongoose.Types.ObjectId;
        price: number;
        qty: number;
        image: string;
    }, {}, {}> & {
        name: string;
        product: mongoose.Types.ObjectId;
        price: number;
        qty: number;
        image: string;
    }>;
    user: mongoose.Types.ObjectId;
    paymentMethod: string;
    totalPrice: number;
    status: string;
    isPaid: boolean;
    isDelivered: boolean;
    shippingAddress?: {
        phone: string;
        address: string;
        city: string;
    } | null;
    paymentId?: string | null;
    paidAt?: NativeDate | null;
    deliveredAt?: NativeDate | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    orderItems: mongoose.Types.DocumentArray<{
        name: string;
        product: mongoose.Types.ObjectId;
        price: number;
        qty: number;
        image: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        name: string;
        product: mongoose.Types.ObjectId;
        price: number;
        qty: number;
        image: string;
    }, {}, {}> & {
        name: string;
        product: mongoose.Types.ObjectId;
        price: number;
        qty: number;
        image: string;
    }>;
    user: mongoose.Types.ObjectId;
    paymentMethod: string;
    totalPrice: number;
    status: string;
    isPaid: boolean;
    isDelivered: boolean;
    shippingAddress?: {
        phone: string;
        address: string;
        city: string;
    } | null;
    paymentId?: string | null;
    paidAt?: NativeDate | null;
    deliveredAt?: NativeDate | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    orderItems: mongoose.Types.DocumentArray<{
        name: string;
        product: mongoose.Types.ObjectId;
        price: number;
        qty: number;
        image: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        name: string;
        product: mongoose.Types.ObjectId;
        price: number;
        qty: number;
        image: string;
    }, {}, {}> & {
        name: string;
        product: mongoose.Types.ObjectId;
        price: number;
        qty: number;
        image: string;
    }>;
    user: mongoose.Types.ObjectId;
    paymentMethod: string;
    totalPrice: number;
    status: string;
    isPaid: boolean;
    isDelivered: boolean;
    shippingAddress?: {
        phone: string;
        address: string;
        city: string;
    } | null;
    paymentId?: string | null;
    paidAt?: NativeDate | null;
    deliveredAt?: NativeDate | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    orderItems: mongoose.Types.DocumentArray<{
        name: string;
        product: mongoose.Types.ObjectId;
        price: number;
        qty: number;
        image: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        name: string;
        product: mongoose.Types.ObjectId;
        price: number;
        qty: number;
        image: string;
    }, {}, {}> & {
        name: string;
        product: mongoose.Types.ObjectId;
        price: number;
        qty: number;
        image: string;
    }>;
    user: mongoose.Types.ObjectId;
    paymentMethod: string;
    totalPrice: number;
    status: string;
    isPaid: boolean;
    isDelivered: boolean;
    shippingAddress?: {
        phone: string;
        address: string;
        city: string;
    } | null;
    paymentId?: string | null;
    paidAt?: NativeDate | null;
    deliveredAt?: NativeDate | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    orderItems: mongoose.Types.DocumentArray<{
        name: string;
        product: mongoose.Types.ObjectId;
        price: number;
        qty: number;
        image: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        name: string;
        product: mongoose.Types.ObjectId;
        price: number;
        qty: number;
        image: string;
    }, {}, {}> & {
        name: string;
        product: mongoose.Types.ObjectId;
        price: number;
        qty: number;
        image: string;
    }>;
    user: mongoose.Types.ObjectId;
    paymentMethod: string;
    totalPrice: number;
    status: string;
    isPaid: boolean;
    isDelivered: boolean;
    shippingAddress?: {
        phone: string;
        address: string;
        city: string;
    } | null;
    paymentId?: string | null;
    paidAt?: NativeDate | null;
    deliveredAt?: NativeDate | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default Order;
//# sourceMappingURL=Order.d.ts.map