document.addEventListener('DOMContentLoaded', () => {
    // DOM 元素
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const messagesDiv = document.getElementById('messages');
    const bookmarkButton = document.getElementById('bookmarkButton');
    
    let myId = null; // 在这里声明一个变量来存储自己的ID

    // --- WebSocket 连接 ---
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}`);
    
    const roomId = window.location.pathname.substring(1).split('/').pop() || 'default-room';

    // --- 书签和通知 ---
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
            new Notification('新消息 ✨', { body: message });
        }
    }

    // --- 流星雨创建逻辑 ---
    function createMeteor() {
        const meteor = document.createElement('div');
        meteor.classList.add('meteor');
        meteor.style.left = Math.floor(Math.random() * (window.innerWidth + 300)) + 'px';
        meteor.style.animationDelay = (Math.random() * 5).toFixed(2) + 's';
        document.body.appendChild(meteor);
        setTimeout(() => { meteor.remove(); }, 5000);
    }
    setInterval(createMeteor, 400);

    
    // --- 核心交互逻辑 ---
    ws.onopen = () => {
        console.log('成功连接到 WebSocket 服务器!');
        requestNotificationPermission();
        ws.send(JSON.stringify({ type: 'join', roomId: roomId }));
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        // 1. 接收到服务器分配的ID
        if (data.type === 'welcome') {
            myId = data.id;
            console.log(`已分配ID: ${myId}`);
            displayMessage(`--- 你已进入星空密语: ${roomId} ---`, 'system');
            return; // 处理完毕，退出函数
        }

        // 2. 接收到聊天消息
        if (data.type === 'chat') {
            // 只显示不是自己发送的消息
            if (data.senderId !== myId) {
                displayMessage(data.text, 'received');
                showNotification(data.text);
            }
        }
    };
    
    ws.onclose = () => {
        displayMessage('--- 你已断开连接 ---', 'system');
    };

    ws.onerror = (error) => {
        console.error('WebSocket 发生错误: ', error);
        displayMessage('--- 连接发生错误 ---', 'system');
    };

    function sendMessage() {
        const messageText = messageInput.value;
        if (!messageText.trim() || !myId) return; // 确保已获取到ID再发送
        
        if (ws.readyState === WebSocket.OPEN) {
            const data = {
                type: 'chat',
                text: messageText,
                senderId: myId // 3. 发送消息时带上自己的ID
            };
            ws.send(JSON.stringify(data));
            
            displayMessage(messageText, 'sent');
            messageInput.value = '';
        } else {
            displayMessage('--- 连接已断开，无法发送消息 ---', 'system');
        }
    }

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
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
