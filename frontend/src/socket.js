import { io } from "socket.io-client";

// Local socket service defaults to the repository's socket server.
// Set REACT_APP_SOCKET_URL in the frontend environment for the deployed socket host.
const socketEndpoint =
  process.env.REACT_APP_SOCKET_URL || "http://localhost:4000";

const socket = io(socketEndpoint, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1500,
});

export default socket;
