const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // For development
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Socket.io connection logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Middleware to inject io into routes if needed
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Basic route
app.get('/', (req, res) => {
  res.send('Smart Alert System API is running...');
});

// Routes will be imported here
const authRoutes = require('./routes/auth');
const opportunityRoutes = require('./routes/opportunities');
// const adminRoutes = require('./routes/admin');
const aiRoutes = require('./routes/ai');

app.use('/api/auth', authRoutes);
app.use('/api/opportunities', opportunityRoutes);
// app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
