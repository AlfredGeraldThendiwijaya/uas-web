const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const amqp = require('amqplib');
const cors = require('cors'); // Import modul cors

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Tambahkan middleware cors sebelum menangani rute
app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/view/index.html');
});

// Menerima nilai suhu dari instances server suhu dan mengirimkannya ke klien menggunakan WebSocket
io.on('connection', (socket) => {
  console.log('Client connected');

  const instances = ['http://localhost:3000']; // Sesuaikan dengan URL server.js
  instances.forEach((instance) => {
    const instanceSocket = require('socket.io-client')(instance);

    // Tambahkan event 'error' untuk menangkap kesalahan pada setiap instanceSocket
    instanceSocket.on('error', (error) => {
      console.error('Error in socket connection:', error);
    });

    instanceSocket.on('temperature', (data) => {
      socket.emit('temperature', data);
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.argv[2] || 3002;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
