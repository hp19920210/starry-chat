// server.js (修复版)

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const crypto = require('crypto'); // 引入加密模块来生成唯一ID

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const rooms = new Map();

app.use(express.static('public'));

wss.on('connection', (ws) => {
    // 1. 为新连接的客户端生成一个唯一ID
    const clientId = crypto.randomUUID();
    ws.id = clientId; // 将ID附加到服务器端的ws对象上

    let currentRoomId = null;
    console.log(`一个客户端已连接, ID: ${clientId}`);

    // 2. 将这个唯一ID发送给客户端，让它“认识自己”
    ws.send(JSON.stringify({ type: 'welcome', id: clientId }));

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.type === 'join' && data.roomId) {
            currentRoomId = data.roomId;

            if (!rooms.has(currentRoomId)) {
                rooms.set(currentRoomId, new Set());
            }
            rooms.get(currentRoomId).add(ws);
            console.log(`客户端 ${clientId} 已加入房间: ${currentRoomId}`);
        }
        else if (data.type === 'chat' && currentRoomId) {
            console.log(`收到来自客户端 [${clientId}] 的消息: ${data.text}`);
            rooms.get(currentRoomId).forEach((client) => {
                // 广播给房间内所有客户端
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
        console.log(`客户端 ${clientId} 已断开`);
    });
});

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`服务器正在 http://localhost:${PORT} 上运行`);
});
