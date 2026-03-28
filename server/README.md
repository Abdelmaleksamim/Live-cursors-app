# 🧠 First: What is WebSocket (simple idea)

👉 WebSocket = a permanent connection between client and server

HTTP: request → response → connection closed ❌
WebSocket: connection opens → stays alive → both sides send anytime ✅

# So it’s perfect for:
chat 💬
live cursor 👆
real-time dashboard 📊

# 1️⃣ Create servers

const http = require('http')
const { WebSocketServer } = require('ws')

👉 Import tools:

http → normal server
ws → WebSocket system

# 2️⃣ Listen for connection

wsServer.on("connection", (connection, request) => {

🔥 This is the core of WebSocket

When a client connects:

connection = the socket (communication channel)
request = info about the connection (URL, headers…)


23:48