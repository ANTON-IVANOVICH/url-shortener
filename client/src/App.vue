<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <div class="app">
    <header>
      <h1>URL Shortener</h1>
      <nav>
        <router-link to="/">Home</router-link>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>

    <footer>
      <p>© {{ new Date().getFullYear() }} URL Shortener</p>
    </footer>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f5f5f5;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
  text-align: center;
}

header h1 {
  margin-bottom: 0.5rem;
}

nav a {
  color: white;
  text-decoration: none;
  margin: 0 10px;
}

main {
  flex: 1;
  padding: 2rem;
}

footer {
  background-color: #2c3e50;
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}
</style>
