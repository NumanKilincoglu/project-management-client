import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
});

export const socket = io("https://project-management-server-fvka.onrender.com");

socket.on("connect", () => {
  const token = localStorage.getItem("token");
  socket.emit("login", { token });
  state.connected = true;
});


socket.on("disconnect", () => {
  state.connected = false;
});
