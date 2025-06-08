document.addEventListener('DOMContentLoaded', () => {
    // DOM 元素
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const messagesDiv = document.getElementById('messages');
    const bookmarkButton = document.getElementById('bookmarkButton');
    
    // --- WebSocket 连接 ---
    // 自动判断使用 ws 还是 wss
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}`);
    
    // 从 URL 获取房间 ID
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
        
        // 随机化流星的起始位置和动画延迟
        meteor.style.left = Math.floor(Math.random() * (window.innerWidth + 300)) + 'px';
        meteor.style.animationDelay = (Math.random() * 5).toFixed(2) + 's';
        
        document.body.appendChild(meteor);

        // 动画结束后移除元素，防止页面元素过多
        setTimeout(() => {
            meteor.remove();
        }, 5000); // 动画时长3s + 延迟最多5s，这里设一个安全值
    }
    // 每隔一段时间创建一颗流星
    setInterval(createMeteor, 400);

    
    // --- 核心交互逻辑 ---
    ws.onopen = () => {
        console.log('成功连接到 WebSocket 服务器!');
        requestNotificationPermission();
        ws.send(JSON.stringify({ type: 'join', roomId: roomId }));
        displayMessage(`--- 你已进入星空密语: ${roomId} ---`, 'system');
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // 判断收到的消息是否是自己发送的
        if (data.type === 'chat' && data.senderId !== ws.id) {
            displayMessage(data.text, 'received');
            showNotification(data.text);
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
        if (!messageText.trim()) return;
        
        // 检查 WebSocket 是否处于连接状态
        if (ws.readyState === WebSocket.OPEN) {
            const data = {
                type: 'chat',
                text: messageText,
                senderId: ws.id // 添加一个唯一的发送者ID，用于区分消息来源
            };
            ws.send(JSON.stringify(data));
            
            // 在自己的屏幕上显示自己发出的消息
            displayMessage(messageText, 'sent');
            messageInput.value = '';
        } else {
            displayMessage('--- 连接已断开，无法发送消息 ---', 'system');
        }
    }

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // 防止回车换行
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
