<template>
  <div class="home">
    <div class="navbar">
      <a @click="goRoute('/home')">Projects</a>
      <a @click="goRoute('/chat')">Chat</a>
    </div>
    <div class="main">
      <div class="left">
        <div class="project_list_div">
          <h2>Projects</h2>
          <table class="project_table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Role</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody v-if="projects && projects.length > 0">
              <tr
                v-for="(project, index) in projects"
                :key="project.id"
                @click="getProjectDetail"
              >
                <td>#{{ index + 1 }}</td>
                <td>{{ project.role }}</td>
                <td>{{ project.name }}</td>
                <td>
                  <button @click="showUsers(project)">Chat Room</button>
                </td>
              </tr>
            </tbody>
          </table>
          <p class="response" v-if="!loading">
            Proje Oluşturuldu:
            <span class="response" v-if="responseToken">{{
              responseToken
            }}</span>
          </p>
        </div>
      </div>
      <div class="right">
        <div class="friend_list_div">
          <div style="text-align: start">
            <h2>Project Members</h2>
            <h4 v-if="selectedProject">
              Project Name: {{ selectedProject.name }}
            </h4>
          </div>
          <table class="project_table">
            <tbody v-if="userList && userList.length > 0">
              <tr v-for="user in userList" :key="user.username">
                <td>{{ user.username }}</td>
                <td>
                  <div
                    class="circle"
                    :style="{
                      backgroundColor:
                        user.status === 'Online' ? '#05B113' : '#BA0000',
                    }"
                  ></div>
                </td>
                <td>
                  <button v-if="user.id != userID" @click="changeToDM(user)">
                    DM
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <p class="response" v-if="!loading">
            Proje Oluşturuldu:
            <span class="response" v-if="responseToken">{{
              responseToken
            }}</span>
          </p>
        </div>
        <template v-if="isGroupChat">
          <div class="chat-room">
            <div style="text-align: start">
              <h2>Chat Room</h2>
            </div>

            <div class="messages">
              <div
                v-for="message in messages"
                :key="message.id"
                class="message_box"
              >
                <div>
                  <span>{{ message.senderName }}</span>
                </div>
                <p>
                  {{ message.content }}
                </p>
                <div v-if="message.file">
                  <a :href="message.file.fileData" target="_blank">{{
                    message.file.fileName
                  }}</a>
                  <img :src="message.file.fileData" alt="Resim" />
                  <button @click="downloadFile(message.file.fileData)">
                    İndir
                  </button>
                </div>
                <div
                  style="display: flex; justify-content: flex-end; width: 100%"
                >
                  <span>{{ new Date().toLocaleDateString() }}</span>
                </div>
              </div>
            </div>
            <div
              style="display: flex; gap: 10px; width: 100%; margin-top: 15px"
            >
              <input
                class="chat"
                type="text"
                v-model="message"
                @keyup.enter="sendMessage"
              />
              <button @click="sendMsg()">Send</button>
              <button @click="selectFile">Select File</button>
              <input
                type="file"
                ref="fileInput"
                style="display: none"
                @change="handleFileSelect"
              />
            </div>
          </div>
        </template>
        <template v-else>
          <div class="chat-room">
            <div style="display: flex; justify-content: space-between">
              <h2>Direct Message</h2>
              <h4 v-if="selectedUser">
                Chatting with {{ selectedUser.username }}
              </h4>
            </div>
            <div style="text-align: start"></div>
            <div class="messages">
              <div
                v-for="message in privateMessages"
                :key="message.id"
                class="message_box"
              >
                <div>
                  <span style="color: rgb(228, 44, 44)">{{
                    message.senderName
                  }}</span>
                </div>
                <p>
                  {{ message.content }}
                </p>
                <div
                  style="display: flex; justify-content: flex-end; width: 100%"
                >
                  <span>{{ new Date().toLocaleDateString() }}</span>
                </div>
              </div>
            </div>
            <div
              style="display: flex; gap: 10px; width: 100%; margin-top: 15px"
            >
              <input
                class="chat"
                type="text"
                v-model="message"
                @keyup.enter="sendMessage"
              />
              <button @click="sendDMMsg()">Send</button>
              <input
                type="file"
                ref="fileInput"
                style="display: none"
                @change="handleFileSelect"
              />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { socket } from "@/socket";

export default {
  name: "HomeView",
  components: {},
  data() {
    return {
      isGroupChat: true,
      loading: true,
      joinLoading: true,
      name: "",
      content: "",
      responseToken: null,
      projects: [],
      joinToken: null,
      userLoading: true,
      userList: [],
      selectedProjectID: null,
      selectedProject: null,
      message: "",
      messages: [],
      privateMessages: [],
      selectedUser: null,
      userID: null,
      userName: null,
      selectedFile: null,
    };
  },
  methods: {
    goRoute(link) {
      this.$router.push(link);
    },
    async showUsers(project) {
      this.isGroupChat = true;
      this.selectedUser = null;
      this.privateMessages = [];
      this.messages = [];
      const token = localStorage.getItem("token");
      socket.emit("project_users", { projectID: project.id, token });
      socket.emit("leave_room", { roomID:this.selectedProjectID, token });

      this.selectedProjectID = project.id;
      this.selectedProject = project;

      socket.emit("join_room", { roomID: project.id, token });
    },

    async getProjects() {
      socket.on("my_projects", (data) => {
        this.projects = data;
      });
    },
    async sendMsg() {
      // const token = localStorage.getItem("token");
      const projectID = this.selectedProjectID;
      const message = this.message;

      socket.emit("send_message", {
        roomID: projectID,
        message,
        fileData: null,
      });
    },
    async changeToDM(user) {
      const userId = localStorage.getItem("userID");
      if (user.id == userId)
        return alert("You cannot send message to yourself");
      this.isGroupChat = false;
      this.selectedUser = user;
    },
    async sendDMMsg() {
      const token = localStorage.getItem("token");
      const userID = localStorage.getItem("userID");
      const senderName = localStorage.getItem("userName");
      const receiverID = this.selectedUser.id;
      const message = this.message;

      socket.emit("send_private_message", {
        recipientID: receiverID,
        senderName: this.userName,
        message,
        token,
      });

      this.privateMessages.push({
        sender: userID, // Gönderen istemcinin kimliği
        senderName: senderName,
        content: message,
      });
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
    selectFile() {
      this.$refs.fileInput.click();
    },
    handleFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;

        const reader = new FileReader();
        const projectID = this.selectedProjectID;
        const message = this.message;

        reader.onload = (event) => {
          let fileData = event.target.result;
          fileData = {
            fileName: file.name,
            fileType: file.type,
            fileData: fileData,
          };
          socket.emit("send_message", { roomID: projectID, message, fileData });
        };

        // Dosya okuma işlemi başlat
        reader.readAsDataURL(file);
      }
    },
    downloadFile(url) {
      window.open(url, "_blank");
    },
  },
  mounted() {
    const token = localStorage.getItem("token");

    socket.emit("my_projects", { token });

    socket.on("my_projects", (data) => {
      this.projects = data;
    });

    socket.on("project_users", (data) => {
      this.userList = data;
    });

    socket.on("private_message", (data) => {
      this.privateMessages.push(data);
    });

    socket.on("receive_message", (data) => {
      const { sender, content, file } = data;
        console.log(data);
      if (!file) {
        this.messages.push({
          sender: sender,
          content: content,
        });
        return;
      }

      if (file.fileType == "image/jpeg") {

        this.messages.push({
          sender: sender,
          content: null,
          file: file,
        });
      }
    });
  },
  created() {
    this.userID = localStorage.getItem("userID");
    this.userName = localStorage.getItem("userName");
    socket.connect();
    this.getProjects();
  },
};
</script>

<style>
h2,
h4 {
  color: black;
  margin: 15px 5px;
}

.circle {
  height: 30px;
  width: 30px;
  border-radius: 50%;
}

.chat-room {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 665px;
  width: 650px;
  padding: 10px;
  border-radius: 10px;
  background-color: rgb(86, 221, 179);
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}

.form_group {
  width: 100%;
}

.right {
  display: flex;
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
  gap: 0px;
  padding-left: 20px;
}

p {
  word-break: break-all;
  white-space: normal;
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
  width: 100%;
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

.friend_list_div {
  padding: 1em;
  height: 650px;
  min-width: 250px;
  width: auto;
  border: 1px solid transparent;
  border-radius: 0px;
  color: black;
  background-color: rgb(86, 221, 179);
  display: flex;
  overflow-x: hidden;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  max-height: 660px;
  overflow-y: auto;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

.project_table {
  width: 100%;
  border-collapse: collapse;
}

.chat {
  width: 75%;
}

.message_box {
  display: flex;
  flex-direction: column;
  color: black;
  background-color: #f5f5f5;
  border: 1 solid blue;
  padding: 1em;
  overflow: hidden;
  justify-content: flex-start;
  align-items: flex-start;
  border-radius: 6px;
  min-height: 90px;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 1px;
  border: 1px solid white;
  height: 550px;
  overflow-y: scroll;
  overflow-x: hidden;
  border-radius: 10px;
  padding: 0.5em;
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
  border-radius: 12px;
  background-color: rgb(13, 189, 224);
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
  padding: 1em;
  display: flex;
  gap: 50px;
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

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
}

::-webkit-scrollbar {
  width: 10px;
  background-color: #f5f5f5;
}

::-webkit-scrollbar-thumb {
  background-color: #000000;
  border: 2px solid #555555;
}
</style>
