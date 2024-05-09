import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
});

export const socket = io("http://localhost:3001");

socket.on("connect", () => {
  const token = localStorage.getItem("token");
  socket.emit("login", { token });
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});
