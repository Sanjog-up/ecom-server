import app from "./app";
import connectDatabase from "./config/db.config"
const DB_URI = "mongoose://localhost:team_12"


const PORT = 8080;

connectDatabase(DB_URI);



//! listening on port
app.listen(PORT, ()=>{
    console.log(`server is running at http://localhost:${PORT}`);
}); 