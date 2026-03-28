// ==========================
// 🔹 PARTE 1: Imports & setup
// ==========================

// Node.js built-in HTTP module to create a server
const http = require('http')

// WebSocket server class from 'ws' library
const { WebSocketServer } = require('ws')

// Node.js URL module to parse query strings from connection URLs
const url = require('url')

// UUID generator to give each connection a unique ID
const uuidv4 = require("uuid").v4

// Create an HTTP server (needed to attach WebSocket server)
const server = http.createServer()

// Create the WebSocket server and attach it to the HTTP server
const wsServer = new WebSocketServer({ server })

// Define the port number for the server
const port = 8000

// Store all active WebSocket connections (key = uuid)
const connections = {}

// Store all connected users and their states (key = uuid)
const users = {}


// ==========================
// 🔹 PARTE 2: Broadcast function
// ==========================

// Send the current list of all users + their states to every connected client
const brodcastUsers = () => {
    Object.keys(connections).forEach(uuid => {
        const connection = connections[uuid]

        // Convert the users object to JSON string
        const message = JSON.stringify(users)

        // Send JSON to client
        connection.send(message)
    })
}


// ==========================
// 🔹 PARTE 3: Handle incoming messages
// ==========================

// Called whenever a client sends data to the server
const handleMessage = (bytes, uuid) => {

    // Convert raw message to JSON
    // Example message: { "x": 100, "y": 200 }
    const message = JSON.parse(bytes.toString())

    // Update the user's state
    const user = users[uuid]
    user.state = message

    // Broadcast updated users to all clients
    brodcastUsers()

    // Debugging: log the user's new state
    console.log(`${user.username} updated their state: ${JSON.stringify(user.state)}`)
}


// ==========================
// 🔹 PARTE 4: Handle client disconnect
// ==========================

// Called when a client closes the connection
const handleClose = (uuid) => {

    // Debug: log disconnected user
    console.log(`${users[uuid].username} disconnected`)

    // Remove the user from memory
    delete connections[uuid]
    delete users[uuid]

    // Broadcast updated users list to remaining clients
    brodcastUsers()
}


// ==========================
// 🔹 PARTE 5: Handle new connections
// ==========================

// Listen for new WebSocket connections
wsServer.on("connection", (connection, request) => {

    // Extract username from URL query parameters
    // Example connection URL: ws://localhost:8000?username=Alex
    const { username } = url.parse(request.url, true).query

    // Generate a unique ID for this connection
    const uuid = uuidv4()

    // Debug logs
    console.log("New connection username:", username)
    console.log("Assigned UUID:", uuid)

    // Store the connection and user info
    connections[uuid] = connection
    users[uuid] = {
        username,
        state: {} // initial empty state
    }

    // Broadcast the updated users to all clients
    brodcastUsers()

    // Set up message handler
    connection.on("message", message => handleMessage(message, uuid))

    // Set up close handler
    connection.on("close", () => handleClose(uuid))

    // Debug log
    console.log("Connection established:", username)
})


// ==========================
// 🔹 PARTE 6: Start the server
// ==========================

// Start HTTP server (and therefore WebSocket server) on the chosen port
server.listen(port, () => {
    console.log(`WebSocket server is running on port ${port}`)
})