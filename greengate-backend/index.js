require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require('path'); 
const client = require('prom-client');
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const { seedAdmin } = require("./seedAdmin");

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
const register = new client.Registry();
client.collectDefaultMetrics({ register });
// Routes
app.use("/api/auth", authRoutes); 
app.use("/api/profile", profileRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/fellowships", fellowshipRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/opportunities", opportunityRoutes);

app.use("/api/uploads", express.static("uploads"));

// Health check endpoint for kubernetes pod liveness and readiness probes
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  await seedAdmin();
});
 

//just to test if jenkins works properly right here
//second test of webhooks
//testing webhooks