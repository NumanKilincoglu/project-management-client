<template>
  <div class="home">
    <div class="navbar">
      <a @click="goRoute('/home')">Projects</a>
      <a @click="goRoute('/chat')">Chat</a>
    </div>
    <div class="main">
      <div class="left">
        <div class="project">
          <h2>Create Project</h2>
          <div class="form_group">
            <label for="username">Project Name</label>
            <input type="text" id="name" v-model="name" required />
          </div>
          <textarea id="content" v-model="content" rows="5" required></textarea>
          <button class="btn" @click="postProject">Create</button>
          <p class="response" v-if="!loading">
            Proje Oluşturuldu:
            <span class="response" v-if="responseToken">{{
              responseToken
            }}</span>
          </p>
        </div>
        <div class="project">
          <h2>Join a Project</h2>
          <div class="form_group">
            <label for="username">Project Token</label>
            <input type="text" id="name" v-model="joinToken" required />
          </div>
          <button class="btn" @click="join">Join</button>
          <p class="response" v-if="!joinLoading">
            Projeye Katıldın:
            <span class="response" v-if="responseToken">{{
              responseToken
            }}</span>
          </p>
        </div>
      </div>

      <div class="project_list_div">
        <h2>My Projects</h2>
        <table class="project_table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Role</th>
              <th>Name</th>
              <th>Content</th>
              <th>Token</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody v-if="projects && projects.length > 0">
            <tr v-for="(project, index) in projects" :key="project.id">
              <td>#{{ index + 1 }}</td>
              <td>{{ project.role }}</td>
              <td>{{ project.name }}</td>
              <td>{{ project.content }}</td>
              <td>{{ project.token }}</td>
              <td>
                <button @click="copyToken(project.token)">Copy Token</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p class="response" v-if="!loading">
          Proje Oluşturuldu:
          <span class="response" v-if="responseToken">{{ responseToken }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
//import SocketService from "../service/socket-service.js";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");
export default {
  name: "HomeView",
  components: {},
  data() {
    return {
      loading: true,
      joinLoading: true,
      name: "",
      content: "",
      responseToken: null,
      projects: [],
      joinToken: null,
    };
  },
  methods: {
    goRoute(link) {
      this.$router.push(link); 
    },
    async getProjects() {
      socket.on("my_projects", (data) => {
        this.projects = data;
      });
    },
    async postProject() {
      const token = localStorage.getItem("token");

      this.loading = true;

      const project = { name: this.name, content: this.content };

      socket.emit("create_project", { project, token });
      console.log(project, token);
      socket.on("create_project", (response) => {
        this.responseToken = response;
      });
      this.loading = false;
    },
    async join() {
      const token = localStorage.getItem("token");

      this.joinLoading = true;

      socket.emit("join_project", { join_token: this.joinToken, token });

      socket.on("join_project", (response) => {
        this.responseToken = response;
      });
      this.joinLoading = false;
    },
    copyToken(token) {
      if (!token)
        return alert("Token not exist, youre not creator of the project!");

      try {
        navigator.clipboard.writeText(token);
        alert("Token copied");
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    const serverUrl = "http://localhost:3001";

    this.socket = io(serverUrl);

    this.socket.on("connection", () => {
      console.log("Socket.io connection established!");
      this.connected = true;
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket.io connection error:", error);
      this.connected = false;
    });

    const token = localStorage.getItem("token");
    socket.emit("my_projects", { token });
    socket.on("my_projects", (data) => {
      this.projects = data;
      console.log(data);
    });
  },
  created() {
    this.getProjects();
  },
};
</script>

<style scoped>
.form_group {
  width: 100%;
}

.response {
  color: #212121;
  font-size: 24px;
}

.navbar {
  width: 100%;
  height: 8vh;
  background-color: rgb(0, 0, 0);
  color: white;
  font-size: 24px;
  display: flex;
  justify-content: center;
  gap: 50px;
  align-items: center;
}

.left {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding-left: 20px;
}

.project {
  padding: 1em;
  height: 450px;
  width: 600px;
  border: 1px solid transparent;
  border-radius: 12px;
  color: black;
  background: rgb(86, 221, 179);
  background: linear-gradient(
    344deg,
    rgba(86, 221, 179, 1) 0%,
    rgba(86, 221, 179, 1) 35%,
    rgba(0, 212, 255, 1) 100%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.project_list_div {
  padding: 1em;
  height: 650px;
  width: 60%;
  border: 1px solid transparent;
  border-radius: 12px;
  color: black;
  background: rgb(86, 221, 179);
  background: linear-gradient(
    344deg,
    rgba(86, 221, 179, 1) 0%,
    rgba(86, 221, 179, 1) 35%,
    rgba(0, 212, 255, 1) 100%
  );
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  max-height: 620px;
  overflow-y: auto;
}

.project_table {
  width: 100%;
  border-collapse: collapse;
}

.project_table th,
.project_table td {
  padding: 8px;
  text-align: left;
  font-size: 22px;
}

.project_table th {
  background-color: rgb(13, 189, 224);
  font-size: 21.5px;
  color: rgb(0, 0, 0);
}

.project_table tr:hover {
  border: 2px solid #f9f9f9;
  border-radius: 6px;
}

.project_table button {
  padding: 5px 10px;
  margin-right: 5px;
  cursor: pointer;
  font-size: 17px;
}

.project_table tbody {
  max-height: 200px;
  overflow-y: auto;
}

.main {
  height: 100%;
  width: 100%;
  background-color: rgb(142, 140, 140);
  padding: 1.5em;
  display: flex;
  gap: 2em;
}

.project input {
  width: 60%;
  margin-top: 15px;
}

#content {
  width: 60%;
}

.btn {
  display: inline-block;
  outline: none;
  cursor: pointer;
  font-size: 16px;
  line-height: 20px;
  font-weight: 600;
  border-radius: 8px;
  padding: 14px 24px;
  width: 60%;
  height: 45px;
  border: none;
  transition: box-shadow 0.2s ease 0s, -ms-transform 0.1s ease 0s,
    -webkit-transform 0.1s ease 0s, transform 0.1s ease 0s;
  background: linear-gradient(
    to right,
    rgb(230, 30, 77) 0%,
    rgb(227, 28, 95) 50%,
    rgb(215, 4, 102) 100%
  );
  color: #fff;
}
</style>
