import express, { Request, Response } from "express";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middlewares/errorHandler.middlewares";



//! creating express app instance
const app = express();


//! body parser
app.use(express.json({ limit: "10mb"})) ;

//! using middlewares

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
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth/register", authRoutes);
//! error handler
 app.use(errorHandler);

export default app;