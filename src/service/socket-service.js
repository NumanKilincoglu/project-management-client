import { io } from "socket.io-client";

const socket = io("https://project-management-server-fvka.onrender.com");
const token = localStorage.getItem("token");

socket.on("connect", () => {
  console.log("connected");
});

async function login() {
  socket.emit("login", token);
}


const SocketService = {
  login,
};

export default SocketService;
