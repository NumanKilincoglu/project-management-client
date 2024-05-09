import { io } from "socket.io-client";

const socket = io("http://localhost:3001");
const token = localStorage.getItem("token");

socket.on("connect", () => {
  console.log("connected");
});

async function login() {
  socket.emit("login", token);
}

async function createProject(project) {
  socket.emit("create_project", { project, token });

  socket.on("create_project", (response) => {
    console.log(response, ":res");
    if (!response) return response;
    return response;
  });
}


const SocketService = {
  login,
  createProject,
};

export default SocketService;
