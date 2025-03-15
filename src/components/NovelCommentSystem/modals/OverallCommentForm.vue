<template>
  <div>
    <div class="modal-overlay" @click="$emit('cancel')"></div>
    <div class="modal animate-slideUp">
      <div class="modal-content card">
        <div class="modal-header">
          <h3>添加总体评价</h3>
          <button class="close-button" @click="$emit('cancel')">&times;</button>
        </div>
        <div class="modal-body">
          <textarea
            class="form-control"
            v-model="commentText"
            placeholder="请输入对本章节的整体评价..."
            ref="overallCommentTextarea"
            rows="10"
          ></textarea>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="$emit('cancel')">取消</button>
          <button class="btn btn-primary" @click="submitComment">
            提交评价
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OverallCommentForm",
  props: {
    initialText: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      commentText: this.initialText,
    };
  },
  watch: {
    initialText(newValue) {
      this.commentText = newValue;
    },
    commentText(newValue) {
      this.$emit("update:text", newValue);
    },
  },
  methods: {
    submitComment() {
      this.$emit("submit");
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.overallCommentTextarea.focus();
    });
  },
};
</script>

<style scoped>
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

.form-control {
  width: 100%;
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 1rem;
  color: var(--text-primary);
  background-color: var(--surface-color);
  resize: vertical;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(126, 87, 194, 0.2);
}

.modal-footer {
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
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

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
  }
}
</style>
