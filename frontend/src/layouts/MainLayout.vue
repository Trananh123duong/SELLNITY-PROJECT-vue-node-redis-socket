<template>
  <div class="main-layout">
    <header class="header">
      <h1>User Management</h1>
    </header>

    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.main-layout {
  padding: 20px;
}

.header {
  margin-bottom: 20px;
}

.content {
  border: 1px solid #ddd;
  padding: 20px;
}
</style>