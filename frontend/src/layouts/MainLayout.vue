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

<style scoped lang="scss">
.main-layout {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 24px;
}

.header {
  margin-bottom: 24px;

  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #303133;
  }
}

.content {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
</style>