import mongoose from "mongoose";

//! category schema
const categorySchema = new mongoose.Schema(
{
    // name: require, description
    name: {
        type: String,
        required: [true, "name is required"],
        minLength: [3, "Category name must be 3 characters long"],
        trim: true,
    },
    
        description: {
            type: String,
            trim: true,
        }
    }, 
    {timestamps: true },
);

//! model
const Category = mongoose.model("category", categorySchema);

export default Category;

