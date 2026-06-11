const express = require("express");
const pg = require("./models/db_learning");  
const cors = require("cors");
const authRoutes = require('./routes/userAuth'); 
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);

// connecting the postgres database
pg.connectDb()
  .then(() => {
    console.log("connected to the postgres database");
  })
  .catch((err) => {
    console.log(err);
  });

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
