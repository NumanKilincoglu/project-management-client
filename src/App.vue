<template>
  <nav>
    <router-link to="/register">Register</router-link> |
    <router-link to="/">Login</router-link>
  </nav>
  <router-view />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #666565;
  height: 100vh;
  overflow: hidden;
  background-color: rgb(142, 140, 140);
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}

html {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(142, 140, 140);
}

nav {
  padding: 20px;
}

nav a {
  font-weight: bold;
  color: #272727;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
