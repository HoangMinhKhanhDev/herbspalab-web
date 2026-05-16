import mongoose from 'mongoose';
declare const Cart: mongoose.Model<{
    cartItems: mongoose.Types.DocumentArray<{
        product: mongoose.Types.ObjectId;
        qty: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        product: mongoose.Types.ObjectId;
        qty: number;
    }, {}, {}> & {
        product: mongoose.Types.ObjectId;
        qty: number;
    }>;
    user: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    cartItems: mongoose.Types.DocumentArray<{
        product: mongoose.Types.ObjectId;
        qty: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        product: mongoose.Types.ObjectId;
        qty: number;
    }, {}, {}> & {
        product: mongoose.Types.ObjectId;
        qty: number;
    }>;
    user: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    cartItems: mongoose.Types.DocumentArray<{
        product: mongoose.Types.ObjectId;
        qty: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        product: mongoose.Types.ObjectId;
        qty: number;
    }, {}, {}> & {
        product: mongoose.Types.ObjectId;
        qty: number;
    }>;
    user: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    cartItems: mongoose.Types.DocumentArray<{
        product: mongoose.Types.ObjectId;
        qty: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        product: mongoose.Types.ObjectId;
        qty: number;
    }, {}, {}> & {
        product: mongoose.Types.ObjectId;
        qty: number;
    }>;
    user: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    cartItems: mongoose.Types.DocumentArray<{
        product: mongoose.Types.ObjectId;
        qty: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        product: mongoose.Types.ObjectId;
        qty: number;
    }, {}, {}> & {
        product: mongoose.Types.ObjectId;
        qty: number;
    }>;
    user: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    cartItems: mongoose.Types.DocumentArray<{
        product: mongoose.Types.ObjectId;
        qty: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        product: mongoose.Types.ObjectId;
        qty: number;
    }, {}, {}> & {
        product: mongoose.Types.ObjectId;
        qty: number;
    }>;
    user: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    cartItems: mongoose.Types.DocumentArray<{
        product: mongoose.Types.ObjectId;
        qty: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        product: mongoose.Types.ObjectId;
        qty: number;
    }, {}, {}> & {
        product: mongoose.Types.ObjectId;
        qty: number;
    }>;
    user: mongoose.Types.ObjectId;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    cartItems: mongoose.Types.DocumentArray<{
        product: mongoose.Types.ObjectId;
        qty: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        product: mongoose.Types.ObjectId;
        qty: number;
    }, {}, {}> & {
        product: mongoose.Types.ObjectId;
        qty: number;
    }>;
    user: mongoose.Types.ObjectId;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default Cart;
//# sourceMappingURL=Cart.d.ts.map