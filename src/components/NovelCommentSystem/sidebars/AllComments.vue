<template>
  <div class="all-comments-sidebar" :class="{ active: show }">
    <div class="sidebar-header">
      <h3>所有评论</h3>
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
      <section class="comment-section">
        <div class="section-header">
          <h3>原文分析</h3>
        </div>

        <div
          v-for="comment in currentChapter.comments"
          :key="comment.id"
          class="sidebar-comment official-comment"
          @click="$emit('scroll-to-paragraph', comment.targetParagraph)"
        >
          <h4 class="comment-title">
            段落{{ getParagraphNumberById(comment.targetParagraph) }}
          </h4>
          <div class="comment-content" v-html="comment.content"></div>
        </div>

        <div v-if="currentChapter.comments.length === 0" class="no-comments">
          <p>暂无原文分析</p>
        </div>
      </section>

      <section class="comment-section">
        <div class="section-header">
          <h3>总体评价</h3>
        </div>
        <div class="sidebar-comment" v-if="currentChapter.overallComment">
          <div
            class="comment-content"
            v-html="currentChapter.overallComment"
          ></div>
        </div>
        <div v-else class="empty-state">
          <p>暂无总体评价</p>
          <button
            class="btn btn-primary"
            @click="$emit('open-overall-comment')"
          >
            添加总体评价
          </button>
        </div>
      </section>

      <section class="comment-section user-comments">
        <div class="section-header">
          <h3>我的评论</h3>
        </div>
        <div
          v-for="(comment, index) in userComments"
          :key="'all-user-comment-' + index"
          class="sidebar-comment user-comment"
          @click="$emit('scroll-to-paragraph', comment.targetParagraph)"
        >
          <button
            class="delete-button"
            @click.stop="$emit('delete-user-comment', index)"
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="comment-title">段落{{ comment.paragraphNumber }}</h4>
          <p class="comment-content">{{ comment.content }}</p>
          <span class="comment-timestamp">{{ comment.timestamp }}</span>
        </div>
        <div v-if="userComments.length === 0" class="empty-state">
          <p>暂无我的评论</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: "AllComments",
  props: {
    show: Boolean,
    currentChapter: Object,
    userComments: Array,
  },
  methods: {
    getParagraphNumberById(paragraphId) {
      if (!this.currentChapter) return "";
      const paragraph = this.currentChapter.paragraphs.find(
        (p) => p.id === paragraphId
      );
      return paragraph ? paragraph.number : "";
    },
  },
};
</script>

<style scoped>
.all-comments-sidebar {
  position: fixed;
  top: 0;
  right: -400px;
  width: 400px;
  height: 100vh;
  background-color: var(--bg-color);
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 900;
  overflow-y: auto;
  transition: right var(--transition-normal) ease;
  display: flex;
  flex-direction: column;
}

.all-comments-sidebar.active {
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

.comment-section {
  margin-bottom: var(--spacing-lg);
}

.section-header {
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid var(--border-color);
}

.section-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.user-comments .section-header h3 {
  color: var(--secondary-color);
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

.all-comments-sidebar .sidebar-comment {
  cursor: pointer;
  transition: transform var(--transition-fast) ease;
}

.all-comments-sidebar .sidebar-comment:hover {
  transform: translateX(5px);
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
  z-index: 1;
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

.no-comments,
.empty-state {
  text-align: center;
  padding: var(--spacing-lg);
  color: var(--text-muted);
}

@media (max-width: 992px) {
  .all-comments-sidebar {
    width: 85%;
    right: -85%;
  }
}
</style>
