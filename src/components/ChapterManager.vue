<template>
  <div class="chapter-manager">
    <div class="chapter-selector">
      <label class="form-label" for="chapter-select">选择章节</label>
      <div class="select-container">
        <select
          id="chapter-select"
          class="form-control form-select"
          v-model="selectedChapterId"
          @change="changeChapter"
        >
          <option
            v-for="chapter in chapters"
            :key="chapter.id"
            :value="chapter.id"
          >
            {{ chapter.title }}
          </option>
        </select>
      </div>
    </div>

    <div class="chapter-actions" v-if="chapters.length > 0">
      <button class="btn btn-text" @click="startRename" title="重命名章节">
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
            d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"
          ></path>
        </svg>
        <span class="sr-only">重命名</span>
      </button>
      <button
        class="btn btn-text btn-danger"
        @click="confirmDelete"
        title="删除章节"
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
          <polyline points="3 6 5 6 21 6"></polyline>
          <path
            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
          ></path>
        </svg>
        <span class="sr-only">删除</span>
      </button>
    </div>

    <!-- 重命名弹窗 -->
    <div v-if="showRenameModal" class="modal-wrapper">
      <div class="modal-overlay" @click="showRenameModal = false"></div>
      <div class="modal animate-fadeIn">
        <div class="modal-content card">
          <div class="modal-header">
            <h3>重命名章节</h3>
            <button class="close-button" @click="showRenameModal = false">
              &times;
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label" for="new-chapter-title"
                >新章节名称</label
              >
              <input
                type="text"
                id="new-chapter-title"
                class="form-control"
                v-model="newChapterTitle"
                placeholder="输入新的章节名称"
                @keyup.enter="renameChapter"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button @click="renameChapter" class="btn btn-primary">确定</button>
            <button @click="showRenameModal = false" class="btn btn-outline">
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChapterManager",
  props: {
    chapters: {
      type: Array,
      required: true,
    },
    currentChapterId: {
      type: String,
      required: true,
    },
  },
  emits: ["chapter-changed", "chapter-renamed", "chapter-deleted"],
  data() {
    return {
      selectedChapterId: "",
      showRenameModal: false,
      newChapterTitle: "",
    };
  },
  watch: {
    currentChapterId: {
      immediate: true,
      handler(newId) {
        this.selectedChapterId = newId;
      },
    },
  },
  methods: {
    changeChapter() {
      if (this.selectedChapterId !== this.currentChapterId) {
        this.$emit("chapter-changed", this.selectedChapterId);
      }
    },

    startRename() {
      const currentChapter = this.chapters.find(
        (c) => c.id === this.currentChapterId
      );
      if (currentChapter) {
        this.newChapterTitle = currentChapter.title;
        this.showRenameModal = true;
      }
    },

    renameChapter() {
      if (this.newChapterTitle.trim() === "") {
        alert("章节名称不能为空！");
        return;
      }

      this.$emit("chapter-renamed", {
        id: this.currentChapterId,
        title: this.newChapterTitle,
      });

      this.showRenameModal = false;
    },

    confirmDelete() {
      const currentChapter = this.chapters.find(
        (c) => c.id === this.currentChapterId
      );
      if (!currentChapter) return;

      if (this.chapters.length <= 1) {
        alert("不能删除唯一的章节！");
        return;
      }

      if (
        confirm(`确定要删除章节"${currentChapter.title}"吗？此操作不可撤销！`)
      ) {
        this.$emit("chapter-deleted", this.currentChapterId);
      }
    },
  },
};
</script>

<style scoped>
.chapter-manager {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.chapter-selector {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.form-label {
  white-space: nowrap;
  color: var(--text-secondary);
  margin-bottom: 0;
}

.select-container {
  position: relative;
  flex: 1;
}

.chapter-actions {
  display: flex;
  gap: var(--spacing-xs);
}

.btn-danger {
  color: var(--error-color);
}

.btn-danger:hover {
  background-color: rgba(229, 57, 53, 0.1);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.modal-wrapper {
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

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal {
  position: relative;
  width: 90%;
  max-width: 400px;
  z-index: 1001;
}

.modal-content {
  background-color: var(--bg-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.modal-header {
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--text-primary);
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  color: var(--text-muted);
  cursor: pointer;
}

.close-button:hover {
  color: var(--text-primary);
}

.modal-body {
  padding: var(--spacing-lg);
}

.modal-footer {
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
}

.animate-fadeIn {
  animation: fadeIn var(--transition-normal) ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .chapter-manager {
    flex-direction: column;
    align-items: stretch;
  }

  .chapter-selector {
    margin-bottom: var(--spacing-sm);
  }

  .chapter-actions {
    justify-content: flex-end;
  }
}
</style>
