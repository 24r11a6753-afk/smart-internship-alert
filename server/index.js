const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ CORS (FRONTEND → BACKEND)
const allowedOrigin = "https://smart-internship-alert-swrb.vercel.app";

app.use(cors({
  origin: allowedOrigin,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ IMPORTANT (BODY PARSER)
app.use(express.json());

// ✅ SOCKET.IO WITH CORS FIX
const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST"]
  },
});

// ✅ MONGODB CONNECTION
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ SOCKET EVENTS
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  socket.on('join_room', (userId) => {
    socket.join(userId);
    console.log(`👤 User ${userId} joined room`);
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected');
  });
});

// ✅ PASS SOCKET TO ROUTES
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ✅ ROOT ROUTE
app.get('/', (req, res) => {
  res.send('Smart Alert System API is running...');
});

// ✅ ROUTES
const authRoutes = require('./routes/auth');
const opportunityRoutes = require('./routes/opportunities');
const aiRoutes = require('./routes/ai');

app.use('/api/auth', authRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/ai', aiRoutes);

// ✅ START SERVER
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});