import mongoose from "mongoose";

    const connectDatabase = (DB_URI: string) => {
        return mongoose.connect(DB_URI)
        .then(()=> {
            console.log("Database connected");
        })
        .catch((error)=> {
            console.log("-------Database connection error--------");
            console.log(error);
            throw error;
        })
    };

    export default connectDatabase;