import mongoose from "mongoose";

//! wishlist schema
const wishlistSchema = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: [true, "Product ID is required"]
},
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "User ID is required"]
}
},
{timestamps:true});

//! Wishlist model
const wishList = mongoose.model("Wishlist", wishlistSchema);

export default wishList;