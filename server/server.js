const express = require("express");
const http = require("http"); // 1. Import native HTTP module
const { Server } = require("socket.io"); // 2. Import Socket.IO
const pg = require("./models/db_learning");
const cors = require("cors");
const notificationRoutes = require("./routes/testNotification");
const authRoutes = require('./routes/userAuth');
const initSocket = require("./socket/socket"); // 3. Import your socket handler
require("dotenv").config();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Create the combined server instance
const server = http.createServer(app); // 4. Wrap app in HTTP server

// Configure Socket.IO with CORS settings mirroring your app
const io = new Server(server, {

    cors: {

        origin: "http://localhost:3000",

        methods: [
            "GET",
            "POST",
            "PATCH"
        ]

    }

});
app.set("io", io);
app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));
app.use(
    "/api",
    notificationRoutes
);

// connecting the postgres database
pg.connectDb()
  .then(() => {
    console.log("connected to the postgres database");
  })
  .catch((err) => {
    console.log(err);
  });

// REST Route to load previous chat history
app.get('/api/messages/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params;
  try {
    const queryText = `
      SELECT * FROM messages 
      WHERE (sender_id = $1 AND receiver_id = $2) 
         OR (sender_id = $2 AND receiver_id = $1) 
      ORDER BY created_at ASC
    `;
    const result = await pg.pool.query(queryText, [user1, user2]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// REST Route to load previous GroupChat history
app.get('/api/group-messages/:userId/:groupId', async (req, res) => {
  const { userId, groupId } = req.params;
  try {
    const queryText = `
      SELECT gm.*, u."userName"
      FROM group_messages gm
      LEFT JOIN users u ON gm.user_id = u.id
      WHERE gm.group_id = $1
      ORDER BY gm.created_at ASC
    `;
    const result = await pool.query(queryText, [groupId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

// 5. Initialize the socket logic
initSocket(io);

// 6. Change app.listen to server.listen so it handles both Express and Sockets
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
