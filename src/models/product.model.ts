import mongoose from "mongoose";


const productSchema = new mongoose.Schema(
    {
    name: {
        type: String,
        required: [true, "name is required"],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        minLength: [25, "atleast 25 char required"],

    },
    price: {
        type: Number,
        required: [true, "price is required"],
    },
    stock: {
        type: Number,
        required: [ true, "stock is required"],
    },
    cover_image:{
        type: {
            path: {
                type: String,
                required: true,
            },
            public_id: {
                type: String,
                required: true,
            },
        },required: [true, "cover_image is required"],
    },
    images: [
        {
        type:{
            path: {
                type: String,
                required: true,
            },
            public_id:{
                type: String,
                required: true,
            }
        },
        required:[true, "image is required"],
    },
    ],
    //! category :ud392820 / {}
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "category is required"],
        ref: "category",
    },
        brand: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "brand is required"],
        ref: "brand",
    },
    new_arrival: {
        type: Boolean,
        default: false,
    },
    soldCount:{
        type:Number,
        default: 0,
    },
    },
    { timestamps: true },
);
const Product = mongoose.model("product", productSchema);
export default Product;