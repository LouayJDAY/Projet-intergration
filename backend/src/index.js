import express from "express";
import dotenv from "dotenv";
import { initDB } from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";
import cors from 'cors';
import cronAuth from "./lib/corn.js";

const app = express();
app.use(cors());

dotenv.config();
const PORT = process.env.PORT;

app.use(express.json());

//test
// app.get("/",(req,res)=>{
//     res.send("Hello on server port 3000");
// })

app.use("/api/auth",authRoutes);


initDB().then(() => {
  app.listen(PORT, () => {
    console.log("SERVER RUNNING ON PORT:", PORT);
  });

  // Start cron job (if defined)
  try {
    cronAuth.start();
    console.log("Cron job started");
  } catch (err) {
    console.warn("Could not start cron job:", err.message || err);
  }
}).catch((err) => {
  console.error("❌ Failed to init DB", err);
});
