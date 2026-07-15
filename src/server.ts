import app from "./app";
import connectDatabase from "./config/db.config";
import ENV_CONFIG from "./config/env.config";

const PORT = process.env.PORT;

connectDatabase(ENV_CONFIG.db_uri)
.then(()=> {
  //! listening on port
  app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
})
.catch((err)=> {
  console.log(`Failed to connect to databse, existing:`, err)
})
