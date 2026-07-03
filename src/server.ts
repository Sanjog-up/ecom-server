import app from "./app";
import connectDatabase from "./config/db.config";
const DB_URI = "mongodb://localhost/team_12";

const PORT = process.env.PORT;

connectDatabase(DB_URI);

//! listening on port
app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
