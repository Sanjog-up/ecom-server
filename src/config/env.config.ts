import "dotenv/config";
const ENV_CONFIG = {
    port : process.env.PORT!!,
    node_env: process.env.NODE_ENV,
    //! database 
    db_uri: process.env.DB_URI,
    //! jwt 

    jwt_secret: process.env.JWT_SECRET ,
    jwt_express_in: process.env.JWT_SECRET_IN ,

    //! bcrypt 
}