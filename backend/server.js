const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

//  Use CORS — replace with your actual Vercel frontend URL
app.use(cors({
  origin: [
    "http://localhost:5173",  
    "https://smartbuy-advisor-venkata-praneeth-s-projects.vercel.app",  //  deployed frontend
  ],
  credentials: true,
}));

app.use(express.json());

//  Basic route
app.get("/", (req, res) => {
  res.send("SmartBuy Server is up!");
});

//  Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const recommendationRoutes = require('./routes/recommendationRoutes');
const historyRoutes = require('./routes/historyRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

//  Use routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/recommend", recommendationRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/feedback", feedbackRoutes);

//  MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("✅ Connected to MongoDB");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
