<template>
  <div id="app">
    <header class="app-header">
      <div class="container">
        <router-link to="/" class="logo">
          <h1>🏐 Suled</h1>
        </router-link>
        <nav>
          <router-link to="/">Tournaments</router-link>
        </nav>
      </div>
    </header>

    <main>
      <router-view />
    </main>

    <footer class="app-footer">
      <div class="container">
        <p>&copy; 2025 Suled Tournament Management</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Main app component
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

.app-header {
  background: #2c3e50;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-header .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  text-decoration: none;
  color: white;
}

.logo h1 {
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

nav {
  display: flex;
  gap: 2rem;
}

nav a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}

nav a:hover {
  opacity: 0.8;
}

.app-footer {
  background: #2c3e50;
  color: #a0aec0;
  padding: 2rem 0;
  text-align: center;
  margin-top: 4rem;
}

.app-footer .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}
</style>
