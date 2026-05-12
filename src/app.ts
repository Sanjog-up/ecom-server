import express from "express";



//! creating express app instance
const app = express();


//! body parser
app.use(express.json({ limit: "10mb"})) 

//! using middlewares

//! using routes

//! error handler
 

export default app;