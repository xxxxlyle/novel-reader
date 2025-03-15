<template>
  <div class="bottom-controls" :class="{ visible: showControls }">
    <div class="controls-container">
      <!-- 左侧：章节导航 -->
      <div class="controls-section chapter-navigation">
        <button
          class="btn btn-icon nav-btn"
          :disabled="!hasPrevious"
          @click="$emit('navigate-previous')"
          title="上一章"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <button
          class="btn btn-icon nav-btn"
          :disabled="!hasNext"
          @click="$emit('navigate-next')"
          title="下一章"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <!-- 中间：阅读进度 -->
      <div class="controls-section reading-progress">
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: readingProgress + '%' }"
          ></div>
        </div>
        <span class="progress-text">{{ readingProgress }}%</span>
      </div>

      <!-- 右侧：字体和主题设置、评论控制 -->
      <div class="controls-section reader-actions">
        <!-- 字体大小控制 -->
        <button
          class="btn btn-icon"
          @click="$emit('decrease-font')"
          title="减小字体"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M4 12h16" />
          </svg>
        </button>
        <span class="font-size-display">{{ fontSize }}</span>
        <button
          class="btn btn-icon"
          @click="$emit('increase-font')"
          title="增大字体"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 4v16m-8-8h16" />
          </svg>
        </button>

        <!-- 主题选择 -->
        <div class="theme-selector">
          <button
            class="theme-btn light-theme"
            :class="{ active: readerTheme === 'light' }"
            @click="$emit('change-theme', 'light')"
            title="亮色主题"
          >
            A
          </button>
          <button
            class="theme-btn sepia-theme"
            :class="{ active: readerTheme === 'sepia' }"
            @click="$emit('change-theme', 'sepia')"
            title="护眼模式"
          >
            A
          </button>
          <button
            class="theme-btn dark-theme"
            :class="{ active: readerTheme === 'dark' }"
            @click="$emit('change-theme', 'dark')"
            title="暗色主题"
          >
            A
          </button>
        </div>

        <!-- 评论控制 -->
        <button
          class="btn btn-icon comments-btn"
          @click.stop="$emit('toggle-comments')"
          title="显示所有评论"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            ></path>
            <line x1="9" y1="10" x2="15" y2="10"></line>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BottomControls",
  props: {
    showControls: Boolean,
    readingProgress: Number,
    fontSize: Number,
    readerTheme: String,
    hasPrevious: Boolean,
    hasNext: Boolean,
  },
};
</script>

<style scoped>
.bottom-controls {
  position: fixed;
  bottom: -100px;
  left: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 800;
  padding: 15px 0;
  transition: bottom 0.3s ease;
}

.bottom-controls.visible {
  bottom: 0;
}

.controls-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--spacing-md);
}

.controls-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

/* 章节导航按钮 */
.nav-btn {
  color: var(--text-secondary);
}

.nav-btn:disabled {
  color: var(--text-muted);
  opacity: 0.5;
  cursor: not-allowed;
}

/* 阅读进度条 */
.reading-progress {
  flex: 1;
  max-width: 200px;
  padding: 0 var(--spacing-md);
}

.progress-bar {
  flex: 1;
  height: 6px;
  background-color: var(--surface-variant);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 3px;
}

.progress-text {
  font-size: 0.75rem;
  color: var(--text-secondary);
  min-width: 40px;
  text-align: center;
}

/* 阅读设置 */
.reader-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.btn-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 50%;
  background-color: transparent;
  color: var(--text-secondary);
  transition: all var(--transition-fast) ease;
}

.btn-icon:hover {
  background-color: var(--surface-variant);
  color: var(--primary-color);
}

.font-size-display {
  font-size: 0.875rem;
  color: var(--text-secondary);
  min-width: 24px;
  text-align: center;
}

.theme-selector {
  display: flex;
  gap: var(--spacing-xs);
  margin-left: var(--spacing-xs);
}

.theme-btn {
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  opacity: 0.7;
  transition: all var(--transition-fast) ease;
}

.theme-btn.active {
  opacity: 1;
  box-shadow: 0 0 0 2px var(--primary-color);
}

.light-theme {
  background-color: #ffffff;
  color: #000000;
}

.sepia-theme {
  background-color: #f8f1e3;
  color: #5f4b32;
}

.dark-theme {
  background-color: #121212;
  color: #ffffff;
}

.comments-btn {
  margin-left: var(--spacing-xs);
}

@media (max-width: 768px) {
  .bottom-controls {
    padding: 10px 0;
  }

  .controls-container {
    padding: 0 var(--spacing-sm);
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }

  .controls-section {
    width: 100%;
    justify-content: center;
    margin-bottom: var(--spacing-sm);
  }

  .controls-section:last-child {
    margin-bottom: 0;
  }

  .reading-progress {
    max-width: none;
  }

  .btn-icon {
    width: 28px;
    height: 28px;
  }

  .theme-btn {
    width: 22px;
    height: 22px;
    font-size: 0.75rem;
  }
}
</style>
