<template>
  <div class="paragraph-comments-sidebar" :class="{ active: show }">
    <div class="sidebar-header">
      <h3>段落 {{ currentParagraphNumber }} 的评论</h3>
      <button class="close-btn" @click="$emit('close')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <div class="sidebar-content">
      <!-- 官方评论 -->
      <div
        v-for="comment in getOfficialCommentsForParagraph()"
        :key="comment.id"
        class="sidebar-comment official-comment"
      >
        <h4 class="comment-title">{{ comment.title }}</h4>
        <div class="comment-content" v-html="comment.content"></div>
      </div>

      <!-- 用户评论 -->
      <div
        v-for="(comment, index) in getUserCommentsForParagraph()"
        :key="'sidebar-user-comment-' + index"
        class="sidebar-comment user-comment"
      >
        <button
          class="delete-button"
          @click.stop="
            $emit('delete-user-comment', getUserCommentIndex(comment))
          "
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <h4 class="comment-title">我的评论</h4>
        <p class="comment-content">{{ comment.content }}</p>
        <span class="comment-timestamp">{{ comment.timestamp }}</span>
      </div>

      <!-- 无评论提示 -->
      <div v-if="!hasParagraphComments()" class="no-comments">
        <p>暂无评论</p>
      </div>

      <!-- 添加评论按钮 -->
      <button
        class="btn btn-primary add-comment-btn"
        @click="$emit('add-comment')"
      >
        添加评论
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ParagraphComments",
  props: {
    show: Boolean,
    currentParagraphId: String,
    currentParagraphNumber: String,
    currentChapter: Object,
    userComments: Array,
  },
  methods: {
    getOfficialCommentsForParagraph() {
      if (!this.currentChapter) return [];
      return this.currentChapter.comments.filter(
        (comment) => comment.targetParagraph === this.currentParagraphId
      );
    },

    getUserCommentsForParagraph() {
      return this.userComments.filter(
        (comment) => comment.targetParagraph === this.currentParagraphId
      );
    },

    hasParagraphComments() {
      return (
        this.getOfficialCommentsForParagraph().length > 0 ||
        this.getUserCommentsForParagraph().length > 0
      );
    },

    getUserCommentIndex(comment) {
      return this.userComments.findIndex(
        (c) =>
          c.targetParagraph === comment.targetParagraph &&
          c.content === comment.content &&
          c.timestamp === comment.timestamp
      );
    },
  },
};
</script>

<style scoped>
.paragraph-comments-sidebar {
  position: fixed;
  top: 0;
  right: -350px;
  width: 350px;
  height: 100vh;
  background-color: var(--bg-color);
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 900;
  overflow-y: auto;
  transition: right var(--transition-normal) ease;
  display: flex;
  flex-direction: column;
}

.paragraph-comments-sidebar.active {
  right: 0;
}

.sidebar-header {
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background-color: var(--bg-color);
  z-index: 2;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: var(--text-primary);
}

.sidebar-content {
  flex: 1;
  padding: var(--spacing-md) var(--spacing-lg);
  overflow-y: auto;
}

.sidebar-comment {
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  background-color: var(--surface-variant);
  border-radius: var(--radius-md);
  position: relative;
}

.sidebar-comment.official-comment {
  border-left: 3px solid var(--primary-color);
}

.sidebar-comment.user-comment {
  border-left: 3px solid var(--secondary-color);
}

.delete-button {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  width: 24px;
  height: 24px;
  padding: 0;
  background-color: transparent;
  border: none;
  border-radius: 50%;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: all var(--transition-fast) ease;
}

.delete-button:hover {
  opacity: 1;
  color: var(--error-color);
  background-color: rgba(229, 57, 53, 0.1);
}

.comment-title {
  margin-top: 0;
  margin-bottom: var(--spacing-xs);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--primary-color);
}

.user-comment .comment-title {
  color: var(--secondary-color);
}

.comment-content {
  margin-bottom: 0;
  color: var(--text-primary);
  font-size: 0.95rem;
  line-height: 1.6;
}

.comment-timestamp {
  display: block;
  margin-top: var(--spacing-sm);
  font-size: 0.75rem;
  color: var(--text-muted);
}

.no-comments {
  text-align: center;
  padding: var(--spacing-lg);
  color: var(--text-muted);
}

.add-comment-btn {
  width: 100%;
  margin-top: var(--spacing-md);
}

@media (max-width: 992px) {
  .paragraph-comments-sidebar {
    width: 85%;
    right: -85%;
  }
}
</style>
