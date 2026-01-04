require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require('path'); 
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const blogRoutes = require("./routes/blogs");
const fellowshipRoutes = require("./routes/fellowships");
const applicationRoutes = require("./routes/applications");
const opportunityRoutes = require("./routes/opportunities");


const app = express();
connectDB();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes); 
app.use("/api/profile", profileRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/fellowships", fellowshipRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/opportunities", opportunityRoutes);

app.use("/api/uploads", express.static("uploads"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
 