# 🖥️ Live Users WebSocket Server

A real-time Node.js WebSocket server for tracking multiple users simultaneously. Perfect for collaborative applications, live cursor tracking, and real-time state synchronization.

## ✨ Features

- ✅ Multi-user WebSocket connections
- ✅ Real-time state tracking (mouse position, cursor data, etc.)
- ✅ Automatic state broadcasting to all connected clients
- ✅ Unique UUID assignment for each connection
- ✅ Graceful disconnect handling

## 🛠️ Technology Stack

| Technology | Purpose |
|-----------|---------|
| **Node.js** | Backend runtime |
| **ws** | WebSocket server library |
| **uuid** | Generate unique connection IDs |
| **HTTP** | Server attachment for WebSocket |

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Steps

```bash
# Clone the repository
git clone https://github.com/Abdelmaleksamim/Live-cursors-app.git
cd Live-cursors-app/server

# Install dependencies
npm install ws uuid

# Start the server
node server.js
```

The server will launch on `ws://localhost:8000` (default port 8000).

**Console output:**
```
WebSocket server is running on port 8000
```

## 🔌 How It Works

### 1. Server Initialization
- `http` module creates the base server
- `WebSocketServer` attaches to handle real-time connections
- `connections` map stores active WebSocket instances
- `users` object maintains user metadata and state

### 2. Connection Flow
```
Client connects → ws://localhost:8000?username=Alex
                ↓
Server generates unique UUID
                ↓
User stored: users[uuid] = { username, state: {} }
                ↓
Broadcast all users to all clients
```

### 3. Message Handling
```
Client sends: { x: 100, y: 200 }
                ↓
handleMessage() updates user state
                ↓
Broadcast all users to all clients
                ↓
All clients receive update instantly
```

### 4. Disconnection
```
Client disconnects
        ↓
handleClose() removes user
        ↓
Broadcast remaining users
```

## 📋 Function Reference

| Function | Purpose |
|----------|---------|
| `broadcastUsers()` | Send all connected users' data to every client |
| `handleMessage(data, uuid)` | Process incoming message and update user state |
| `handleClose(uuid)` | Handle user disconnection and cleanup |

## 💡 Client Implementation Example

### React with `react-use-websocket`

```javascript
import { useWebSocket } from 'react-use-websocket';

export function CursorComponent() {
  const { sendJsonMessage, readyState } = useWebSocket(
    'ws://127.0.0.1:8000?username=Alex'
  );

  const handleMouseMove = (e) => {
    if (readyState === 1) { // Connection open
      sendJsonMessage({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      });
    }
  };

  return (
    <div onMouseMove={handleMouseMove}>
      {/* Your app content */}
    </div>
  );
}
```

### Key Points
- ✅ Check `readyState === 1` before sending messages (connection open)
- ✅ Throttle mouse movement messages to reduce server load
- ✅ Handle connection loss gracefully

## ⚙️ Best Practices

### Performance Optimization
- **Throttle messages**: Limit mouse position updates (e.g., every 50ms)
- **Message size**: Keep state objects minimal
- **Connection pooling**: Monitor active connections

### Security
- Validate incoming data on the server
- Implement rate limiting for production
- Use WSS (WebSocket Secure) for encrypted connections

### Deployment
- Works on any Node.js-compatible platform (Heroku, AWS, DigitalOcean, etc.)
- Set environment variables for port configuration
- Use process managers like PM2 for production

## 📝 Example Environment Variables

```bash
# .env (optional)
PORT=8000
NODE_ENV=development
```

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.


---

**Built with ❤️ for real-time collaboration**
