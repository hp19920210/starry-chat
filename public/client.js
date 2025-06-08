// public/client.js (最终版)

document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const messagesDiv = document.getElementById('messages');
    const bookmarkButton = document.getElementById('bookmarkButton');
    
    const ws = new WebSocket(`ws://${window.location.host}`);
    
    const roomId = window.location.pathname.substring(1).split('/').pop() || 'default-room';

    bookmarkButton.addEventListener('click', () => {
        alert('请按 Ctrl+D (Windows/Linux) 或 Cmd+D (Mac) 来将这个房间保存为书签！');
    });

    function requestNotificationPermission() {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }

    function showNotification(message) {
        if (Notification.permission === 'granted' && document.hidden) {
            new Notification('新消息', { body: message, icon: 'favicon.ico' });
        }
    }
    
    ws.onopen = () => {
        console.log('已连接到服务器!');
        requestNotificationPermission();
        ws.send(JSON.stringify({ type: 'join', roomId: roomId }));
        displayMessage(`--- 你已进入房间: ${roomId} ---`, 'system');
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'chat') {
            displayMessage(data.text, 'received');
            showNotification(data.text);
        }
    };

    ws.onclose = () => {
        displayMessage('--- 你已断开连接 ---', 'system');
    };

    function sendMessage() {
        const messageText = messageInput.value;
        if (!messageText.trim()) return;

        const data = { type: 'chat', text: messageText };
        ws.send(JSON.stringify(data));
        
        displayMessage(messageText, 'sent');
        messageInput.value = '';
    }

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function displayMessage(text, type) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', type);
        messageElement.textContent = text;
        messagesDiv.appendChild(messageElement);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
});
