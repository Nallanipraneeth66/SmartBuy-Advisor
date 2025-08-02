const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",               // local dev
    "https://your-frontend-url.onrender.com",  // deployed frontend (replace with actual)
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SmartBuy Server is up!");
});

//  Routes — NO `.default`
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const recommendationRoutes = require('./routes/recommendationRoutes');
const historyRoutes = require('./routes/historyRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

//  Using routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/recommend", recommendationRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/feedback", feedbackRoutes);

//  MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
