<template>
    <div class="login-container">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="username" required>
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <button type="submit">Login</button>
        <p v-if="loginError" class="error-message">{{ loginError }}</p>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '',
        password: '',
        loginError: ''
      };
    },
    methods: {
      async login() {
        try {
          // Bu kısımda gerçek bir backend ile kullanıcı doğrulaması yapılabilir
          // Örnek olarak, kullanıcı adı ve şifreyi backend'e POST isteği ile gönderip doğrulama yapılabilir
          // Burada axios, fetch veya diğer HTTP kütüphaneleri kullanılabilir
          // Örneğin:
          // const response = await axios.post('http://example.com/login', { username: this.username, password: this.password });
          // if (response.data.success) {
          //   // Başarılı login durumu
          //   // Kullanıcıyı yönlendir veya başka işlemler yap
          // } else {
          //   this.loginError = response.data.message; // Hata mesajını göster
          // }
  
          // Burada basitçe username ve password'u konsola yazdırarak simüle ediyoruz
          console.log('Username:', this.username);
          console.log('Password:', this.password);
  
          // Başarılı login durumu simülasyonu için
          this.loginError = ''; // Hata mesajını temizle
        } catch (error) {
          console.error('Login error:', error);
          this.loginError = 'Login failed. Please try again.'; // Genel hata mesajı
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    font-weight: bold;
  }
  
  input {
    width: 100%;
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .error-message {
    color: red;
    font-weight: bold;
  }
  </style>
  