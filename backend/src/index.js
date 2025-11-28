import express from "express";
import dotenv from "dotenv";
import { initDB } from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";
import iproute from "./routes/ip.routes.js";
import ipsecurity from "./routes/security.routes.js";
import reportsRouter from "./routes/reports.routes.js";
import repliesRouter from "./routes/replies.routes.js";
import authMethodsRouter from "./routes/authMethods.routes.js";
import cors from 'cors';

const app = express();

// Configure CORS for both development and production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL || 'https://projet-frontend.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

dotenv.config();
const PORT = process.env.PORT;

app.use(express.json());

//test
// app.get("/",(req,res)=>{
//     res.send("Hello on server port 3000");
// })


// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/ip", iproute);
app.use("/api/security", ipsecurity);
app.use("/api/reports", reportsRouter);
app.use("/api/replies", repliesRouter);
app.use("/api/auth-methods", authMethodsRouter);



initDB().then(() => {
  app.listen(PORT, () => {
    console.log("SERVER RUNNING ON PORT:", PORT);
  });
}).catch((err) => {//for testing reasons 
  console.error("❌ Failed to init DB", err);
});
