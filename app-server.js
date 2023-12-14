const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const amqp = require('amqplib');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Declare the channel variable
let channel;

// Connect to RabbitMQ and create the channel
amqp.connect('amqp://localhost')
  .then((connection) => {
    return connection.createChannel();
  })
  .then((createdChannel) => {
    channel = createdChannel; // Assign the created channel to the variable

    const queue = 'temperature_queue';

    setInterval(() => {
      const randomTemperature = Math.floor(Math.random() * 100);
      channel.assertQueue(queue).then(() => {
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(randomTemperature)));
      });
    }, 1000);
  })
  .catch((err) => {
    console.error(err);
  });

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

io.on('connection', (socket) => {
  console.log('Client connected');
  const queue = 'temperature_queue';

  // Menerima pesan dari antrian RabbitMQ dan mengirimkannya ke klien menggunakan WebSocket
  if (channel) {
    // Pastikan queue sudah dideklarasikan
    channel.assertQueue(queue).then(() => {
      // Mengonsumsi pesan dari antrian RabbitMQ
      channel.consume(queue, (msg) => {
        const temperature = JSON.parse(msg.content.toString());
        io.emit('temperature', { value: temperature }); // Menggunakan io.emit agar dapat diakses oleh semua klien
      }, { noAck: true });
    });
  }

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
