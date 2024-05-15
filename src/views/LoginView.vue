<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
      <p v-if="loginError" class="error-message">{{ loginError }}</p>
    </form>
  </div>
</template>

<script>
import { apiInstance } from "../service/api-service.js";

export default {
  data() {
    return {
      username: "",
      password: "",
      loginError: "",
    };
  },
  methods: {
    async login() {
      try {
        const response = await apiInstance.post("auth/login", {
          username: this.username,
          password: this.password,
        });

        if (!response) return false;

        const success = response.data.success;

        if (success) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userID", response.data.userID);
          localStorage.setItem("userName", response.data.userName);
          this.$router.push("/home");
        }

        this.loginError = ""; // Hata mesajını temizle

        return response.data.success;

        // Başarılı login durumu simülasyonu için
      } catch (error) {
        console.error("Login error:", error);
        this.loginError = "Login failed. Please try again."; // Genel hata mesajı
      }
    },
  },
};
</script>

<style>
.login-container {
  max-width: 400px;
  margin: auto;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
}
h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}
.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
}

input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}
.error-message {
  color: #dc3545;
  font-weight: bold;
  margin-top: 10px;
}
</style>
