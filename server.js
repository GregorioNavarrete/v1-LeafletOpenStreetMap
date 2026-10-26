const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Almacenamiento de locales (en memoria para este ejemplo)
const stores = {
    1: { lat: 40.7128, lng: -74.0060 },  // Nueva York
    2: { lat: 34.0522, lng: -118.2437 }, // Los Ángeles
    3: { lat: 41.8781, lng: -87.6298 }   // Chicago
};

io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado');

    socket.on('addMarker', (data) => {
        if (data.storeId) {
            stores[data.storeId] = { lat: data.lat, lng: data.lng };
        }
        socket.broadcast.emit('newMarker', data);
    });

    socket.on('getStores', () => {
        socket.emit('storeList', stores);
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
// casa -27.80580,-64.25597
//centro -27.78792, -64.25984

