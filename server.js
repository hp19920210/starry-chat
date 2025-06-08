// server.js (最终版)

const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const rooms = new Map();

app.use(express.static('public'));

wss.on('connection', (ws) => {
    let currentRoomId = null;

    console.log('一个客户端已连接');

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.type === 'join' && data.roomId) {
            currentRoomId = data.roomId;

            if (!rooms.has(currentRoomId)) {
                rooms.set(currentRoomId, new Set());
            }
            rooms.get(currentRoomId).add(ws);
            console.log(`客户端已加入房间: ${currentRoomId}`);
        }
        else if (data.type === 'chat' && currentRoomId) {
            console.log(`收到来自房间 [${currentRoomId}] 的消息: ${data.text}`);
            rooms.get(currentRoomId).forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });
        }
    });

    ws.on('close', () => {
        if (currentRoomId && rooms.has(currentRoomId)) {
            rooms.get(currentRoomId).delete(ws);
            if (rooms.get(currentRoomId).size === 0) {
                rooms.delete(currentRoomId);
                console.log(`房间 [${currentRoomId}] 已空，已移除。`);
            }
        }
        console.log('一个客户端已断开');
    });
});

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`服务器正在 http://localhost:${PORT} 上运行`);
});
