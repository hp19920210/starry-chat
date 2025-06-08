Starry Chat ✨ - 我的星空密语聊天室
嗨，你好！欢迎来到我的个人项目——Starry Chat。

我一直想亲手创建一个轻量、漂亮、可以和朋友实时交流的网页应用。我尤其偏爱浪漫的星空主题，所以，我决定将一个动态的、流光溢彩的星空作为这个聊天室的背景。它不仅仅是一个工具，更是一个我想象中的、可以和朋友在星空下安静交谈的“秘密基地”。

这个项目很简单，没有复杂的框架，回归到了最纯粹的 Web 技术。

效果预览
![image](https://github.com/user-attachments/assets/3bfcda8a-6e5f-428b-ad25-9c9c0a12b060)


核心功能
实时通讯：基于 WebSocket，消息可以被实时、低延迟地发送和接收。
动态星空背景：使用纯 CSS 实现的多层、带有视差效果的动态星空，轻量且流畅。
房间机制：通过访问不同的 URL 路径 (/your-room-name)，就可以创建或加入一个独立的聊天房间。
桌面通知：当聊天窗口未处于激活状态时，会弹出浏览器桌面通知提醒有新消息。
响应式设计：在桌面和移动设备上都有不错的视觉效果。
极致简单：没有使用任何前端框架，只依赖于原生 JavaScript，这让整个项目非常容易理解和修改。
技术栈
我选择了一套非常经典且高效的技术组合来构建这个应用：

前端:
HTML5
CSS3 (包括 Flexbox, Animations, 和毛玻璃效果)
JavaScript (原生 ES6+)
后端:
Node.js
Express.js (用于提供静态文件服务)
实时通信:
ws (一个轻量、高效的 Node.js WebSocket 库)
如何在本地运行
想在你的电脑上亲自体验和修改它吗？非常简单！

克隆我的仓库

Bash

git clone https://github.com/your-username/starry-chat.git
进入项目目录

Bash

cd starry-chat
安装依赖
(这会根据 package.json 文件自动安装 Express 和 ws 库)

Bash

npm install
启动项目

Bash

npm start
大功告成！现在，在你的浏览器里打开 http://localhost:3000/any-room-you-like 就可以开始聊天了。你可以多开几个窗口来模拟多人聊天。

关于部署
我选择将它部署在了 Render.com 上，因为它的免费层级非常适合这样的小项目。部署过程也非常顺畅：

将这个仓库连接到 Render。
创建一个新的 Web Service。
使用以下配置：
Build Command (构建命令): npm install
Start Command (启动命令): npm start
Render 会自动完成剩下的所有工作。

未来构想
虽然现在的版本已经实现了我的核心想法，但我还有一些想在未来添加的功能：

[ ] 支持设置和显示用户昵称。
[ ] 增加“对方正在输入...”的提示。
[ ] 引入一个轻量级数据库（如 Redis 或 Postgres）来保存聊天记录。
[ ] 增加端到端加密的选项，让密语真正成为秘密。
感谢你的访问！如果你对这个项目有任何想法或建议，欢迎随时和我交流。
