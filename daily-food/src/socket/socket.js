// src/socket.js
import { io } from "socket.io-client";

// Kết nối tới server Socket.IO (thay URL nếu cần)
const socket = io("http://localhost:3000");

export default socket;
