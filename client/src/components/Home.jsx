// 🔹 React core + hooks
import React, { useEffect, useRef } from 'react'

// 🔹 WebSocket hook (used to connect to backend in real-time)
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket'

// 🔹 Utility to limit how often a function runs (performance optimization)
import throttle from 'lodash.throttle'
import { Cursor } from './Cursor'

const renderCursors = (users) => {
  return Object.keys(users).map(uuid => {
    const user = users[uuid]
    return (
      <Cursor key={uuid} point={[user.state.x, user.state.y]} />
    )
  })
}


// 🔹 Home component receives username from parent (App.jsx)
const Home = ({ username }) => {

  // =========================
  // 🟢 PARTE 1: WebSocket URL
  // =========================
  // This is the address of our backend WebSocket server
  const WS_URL = 'ws://127.0.0.1:8000'


  // =========================
  // 🟢 PARTE 2: WebSocket Connection
  // =========================
  // Connect to the WebSocket server and get useful tools:
  // - sendJsonMessage: send data to backend
  // - readyState: connection status (0=connecting, 1=open, etc.)
  const { sendJsonMessage, readyState, lastJsonMessage } = useWebSocket(WS_URL, {
    
    // Send username as query param → backend receives it
    queryParams: { username },

    // Connection lifecycle logs (for debugging)
    onOpen: () => console.log("✅ Connected"),
    onClose: () => console.log("❌ Disconnected"),
    onError: (err) => console.log("🚨 Error:", err),
  })


  // =========================
  // 🟢 PARTE 3: Throttling messages
  // =========================
  const THROTTLE = 50
  // We limit how often we send mouse data (every 50ms)
  // This avoids sending too many requests (performance optimization)
  const sendJsonMessageThrottled = useRef(
    throttle(sendJsonMessage, THROTTLE)
  )


  // =========================
  // 🟢 PARTE 4: Mouse tracking
  // =========================
  // Listen to mouse movement and send position to backend
  useEffect(() => {
    sendJsonMessage({
      x: 0,
      y: 0
    })

    const moveHandler = (e) => {

      // Only send data if WebSocket is connected (readyState === 1)
      if (readyState === 1) {
        sendJsonMessageThrottled.current({
          x: e.clientX, // horizontal position
          y: e.clientY  // vertical position
        })
      }
    }

    // Start listening to mouse movement
    window.addEventListener("mousemove", moveHandler)

    // Cleanup: remove event when component unmounts
    return () => window.removeEventListener("mousemove", moveHandler)

  }, [readyState, sendJsonMessage])


  // =========================
  // 🟢 UI Rendering
  // =========================
  // Display username on screen
  if(lastJsonMessage){
    return <>
      {renderCursors(lastJsonMessage)}
    </>
  }
  return <h1>Hello {username}</h1>
}

export default Home