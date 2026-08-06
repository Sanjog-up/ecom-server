import mongoose, { Schema, Document} from "mongoose";

export interface IOrderItem {
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
    name: string;
    cover_image: {
        public_id: string;
        path: string;
    }
}

export interface IShippingAddress {
    address: string;
    city: string;
    full_name: string;
    phone: string;
}

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    items: IOrderItem[];
    shippingAddress: IShippingAddress;
    totalPrice: number;
    status: "pending" | "shipped" | "delivered" | "cancelled";
    createdAt: Date;
    updatedAt: Date;
    paymentMethod: "COD" | "Khalti";
    paymentStatus: "Pending" | "Paid" | "Failed";
    khaltiPidx?: string;

}

const OrderSchema: Schema = new Schema(
    {
        user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
        items: [
            {
                product: { type: mongoose.Types.ObjectId, ref: "product", required: true },
                name: {type: String, required: true},
                cover_image: {
                    public_id: { type: String, required: true },
                    path: { type: String, required: true}
                },
                quantity: { type: Number, required: true, min: 1 },
                price: { type: Number, required: true, min: 0 },
            },
        ],
        shippingAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            full_name: { type: String, required: true },
            phone: { type: String, required: true },
        },
        paymentMethod: { 
            type: String, 
            enum: ["COD", "Khalti"], 
            required: true 
        },
        paymentStatus: { 
            type: String, 
            enum: ["Pending", "Paid", "Failed"], 
            default: "Pending" 
        },
        khaltiPidx: { type: String },
        totalPrice: { type: Number, required: true, min: 0 },
        status: { 
            type: String, 
            enum: ["pending", "shipped", "delivered", "cancelled"], 
            default: "pending" 
        },
    },
    { timestamps: true }
);

const Order = mongoose.model<IOrder>("Order", OrderSchema);

export default Order;