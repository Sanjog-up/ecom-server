import mongoose from "mongoose";

interface IBrandSchema extends Document{
    name: string;
    description?: true;
    image: {
        path: string,
        public_id: string,
    }
}

//! brand schema
const brandSchema = new mongoose.Schema<IBrandSchema>({
    name: {
        type: String,
        required: [true, "name is required"],
        minLength: [3, "Brand name must be 3 char long"],
        trim: true,
    },

    description: {
        type: String,
        trim: String,
        minlength: [24, "min 25 char is required"],
    },

    // todo: image
    image: {
        type:{
            path:{
                type: String,
                required: true,
            },
            public_id:{
                type: String,
                required: true,
            }
        },
        required:[true, "image is required"]
    }
},
{
    timestamps: true
},
)

//! model
const Brand = mongoose.model("brand", brandSchema);
export default Brand; 