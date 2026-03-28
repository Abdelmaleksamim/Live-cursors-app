🖥 Live Users WebSocket Server

This is a Node.js WebSocket server that tracks multiple users in real-time. Each connected user sends their state (like mouse position), and the server broadcasts all users' states to everyone.

It can be used for real-time collaborative apps, live cursors, or similar projects.

📦 Features
Connect multiple users via WebSocket
Track each user’s state (e.g., mouse positions)
Broadcast all users’ states to everyone in real-time
Assign unique IDs to every user
Handles user disconnects gracefully
🛠 Technologies
Node.js – Backend runtime
ws – WebSocket server library
uuid – Generate unique IDs for connections
HTTP module – To attach the WebSocket server
⚙️ Installation
Clone the repo:
git clone <your-repo-url>
cd <repo-folder>
Install dependencies:
npm install ws uuid
Run the server:
node server.js

The server will run on port 8000 by default.
You should see in the console:

WebSocket server is running on port 8000
🔌 How it Works
1️⃣ Server Setup
http creates the server.
WebSocketServer attaches to HTTP for real-time communication.
connections stores raw WebSocket connections.
users stores username and state for each client.
2️⃣ Connection Flow
Client connects to ws://localhost:8000?username=Alex
Server assigns a UUID for the connection
Server saves the user:
users[uuid] = { username, state: {} }
Server broadcasts all users to all clients.
3️⃣ Sending and Receiving Data
Client sends data (e.g., mouse { x, y }) → handleMessage()
Server updates state → broadcasts all users → everyone sees the update
Client disconnects → handleClose() → user removed → broadcast again
4️⃣ Functions Breakdown
Function	Role
brodcastUsers()	Send the full users object to all clients
handleMessage(bytes, uuid)	Update a user's state and broadcast
handleClose(uuid)	Remove disconnected user and broadcast
🔗 Example Client

You can connect using a WebSocket frontend, e.g., React with react-use-websocket:

import { useWebSocket } from 'react-use-websocket'

const { sendJsonMessage, readyState } = useWebSocket(
  'ws://127.0.0.1:8000?username=Alex'
)
sendJsonMessage({ x: 100, y: 200 }) → send mouse coordinates
Server will broadcast all connected users
📌 Notes
Use readyState === 1 to check if the connection is open before sending
Throttle messages (e.g., mouse movements) to avoid server overload
Works locally and can be deployed on any Node.js server
✅ License

MIT License
