import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const WebSocketContext = createContext();

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io("http://localhost:8081", {
            transports: ["websocket"], // Đảm bảo sử dụng WebSocket protocol
        });

        setSocket(newSocket);

        // Lắng nghe sự kiện kết nối thành công
        newSocket.on("connect", () => {
            console.log("Connected to WebSocket server");
        });

        // Lắng nghe sự kiện mất kết nối
        newSocket.on("disconnect", () => {
            console.log("Disconnected from WebSocket server");
        });

        return () => {
            newSocket.disconnect(); // Đảm bảo ngắt kết nối khi component bị hủy
        };
    }, []);

    return <WebSocketContext.Provider value={socket}>{children}</WebSocketContext.Provider>;
};
