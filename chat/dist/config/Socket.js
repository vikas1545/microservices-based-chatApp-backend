import { Server } from "socket.io";
import http from "http";
import express from "express";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
const userSocketMap = {};
io.on("connection", (socket) => {
    console.log("User connected", socket.id);
    const userId = socket.handshake.query.userId;
    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
        console.log(`User ID ${userId} mapped to socket ID ${socket.id}`);
    }
    io.emit("getOnlineUser", Object.keys(userSocketMap));
    if (userId) {
        socket.join(userId);
    }
    socket.on("typing", (data) => {
        console.log(`User ${data.userId} is typing in chat ${data.chatId}`);
        socket.to(data.chatId).emit("userTyping", { userId: data.userId, chatId: data.chatId });
    });
    socket.on("stopTyping", (data) => {
        console.log(`User ${data.userId} stopped typing in chat ${data.chatId}`);
        socket.to(data.chatId).emit("userStoppedTyping", { userId: data.userId, chatId: data.chatId });
    });
    socket.on("joinChat", (chatId) => {
        socket.join(chatId);
        console.log(`User joined chat room ${chatId}`);
    });
    socket.on("leaveChat", (chatId) => {
        socket.leave(chatId);
        console.log(`User left chat room ${chatId}`);
    });
    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
        if (userId) {
            delete userSocketMap[userId];
            console.log(`User ID ${userId} removed from online users`);
            io.emit("getOnlineUser", Object.keys(userSocketMap));
        }
    });
    socket.on("connect_error", (err) => {
        console.log(`socket connection error: ${err}`);
    });
});
export { app, server, io };
