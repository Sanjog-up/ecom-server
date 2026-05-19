import mongoose from "mongoose";

interface ICategorySchema extends Document{
    name: string;
    description?: string;
}
//! category schema
const categorySchema = new mongoose.Schema<ICategorySchema>(
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
            minLength: [24, "minimum 25 character is required"],
        }
    }, 
    //todo: image 
    {timestamps: true },
);

//! model
const Category = mongoose.model("category", categorySchema);
export default Category;

