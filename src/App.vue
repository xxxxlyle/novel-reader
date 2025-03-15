<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
/* 导入全局变量和基础样式 */
@import "./assets/styles/flat-design.css";

/* 添加全局定制样式 */
html,
body {
  height: 100%;
  scroll-behavior: smooth;
}

#app {
  min-height: 100%;
  background-color: var(--bg-color);
  padding-bottom: var(--spacing-xl);
}

::selection {
  background-color: rgba(126, 87, 194, 0.2);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: var(--surface-variant);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background-color: var(--text-muted);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: var(--primary-color);
}

/* 模态框通用样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 990;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 500px;
  background-color: var(--bg-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.animate-slideUp {
  animation: slideUp var(--transition-normal) ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media print {
  .btn,
  .chapter-manager {
    display: none !important;
  }

  .card {
    box-shadow: none !important;
    border: 1px solid #eee;
  }

  body {
    font-size: 12pt;
  }
}
</style>
