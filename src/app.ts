import express, { NextFunction, Request, Response } from "express";
import { errorHandler } from "./middlewares/errorHandler.middlewares";
import cookieParser from "cookie-parser";
import cors from 'cors';
import ENV_CONFIG from "./config/env.config";

//! importing routes
import routes from "./routes"; 
import AppError from "./utils/appError.utils";

//! creating express app instance
const app = express();
 
const origins = ENV_CONFIG.allow_origin.split(",")

//! using middlewares
//* cookie parser
app.use(cookieParser()); 


//* cors

app.use(
    cors({
        origin: (origin, callback) => {
          console.log(origin);
          if(!origin){
            callback(null, true);
          }
          if(origins.includes(origin as string)){
            callback(null, true);
            }
            callback(new AppError("Cors error", 403));
          
    }, credentials: true,
    })
)

//! body parser
app.use(express.json({ limit: "10mb"})) ;
app.use(express.urlencoded());

//! helth route
app.get("/", (req: Request, res: Response) =>
{
    res.status(200).json({
        message: "server is up and running",
        success: true,
        status: "success",
    })
}) 

//! using routes
app.use("/api/v1", routes);


//! path not found error middleware
app.use((req: Request, res: Response,next: NextFunction)=>{
    const message = `can not ${req.method} on ${req.url}`;
    throw new AppError(message, 404);
}) 

//! error handler
app.use(errorHandler);
 
export default app;