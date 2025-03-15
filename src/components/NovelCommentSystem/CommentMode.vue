<template>
  <div class="container main-content">
    <div class="row">
      <div class="content-column card" ref="contentDiv">
        <h2 class="column-title">
          {{ currentChapter.title }}
          <span class="hint-text">点击段落添加评论</span>
        </h2>

        <div
          v-for="paragraph in currentChapter.paragraphs"
          :key="paragraph.id"
          :id="paragraph.id"
          class="paragraph"
          @click="$emit('open-comment-form', paragraph.id, paragraph.number)"
        >
          <span class="paragraph-number">{{ paragraph.number }}</span>
          <div v-html="paragraph.content"></div>
        </div>
      </div>

      <div class="comments-column card" ref="analysisDiv">
        <h2 class="column-title">评论区</h2>

        <section class="comment-section">
          <div class="section-header">
            <h3>原文分析</h3>
          </div>

          <div
            v-for="comment in currentChapter.comments"
            :key="comment.id"
            :id="comment.id"
            :data-target="comment.targetParagraph"
            class="comment"
            :class="{ active: activeComment === comment.id }"
            @click="highlightParagraph(comment.targetParagraph, comment.id)"
          >
            <h4 class="comment-title">{{ comment.title }}</h4>
            <div class="comment-content" v-html="comment.content"></div>
          </div>
        </section>

        <section class="comment-section">
          <div class="section-header">
            <h3>总体评价</h3>
          </div>
          <div class="comment" v-if="currentChapter.overallComment">
            <div
              class="comment-content"
              v-html="currentChapter.overallComment"
            ></div>
          </div>
          <div v-else class="empty-state">
            <p>暂无总体评价</p>
            <button
              class="btn btn-primary"
              @click="$emit('open-overall-comment-form')"
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
            :key="'user-comment-' + index"
            :data-target="comment.targetParagraph"
            class="comment user-comment"
            :class="{ active: activeComment === 'user-comment-' + index }"
            @click="
              highlightParagraph(
                comment.targetParagraph,
                'user-comment-' + index
              )
            "
          >
            <button
              class="delete-button"
              @click.stop="$emit('delete-user-comment', index)"
            >
              <span aria-hidden="true">&times;</span>
              <span class="sr-only">删除评论</span>
            </button>
            <h4 class="comment-title">段落{{ comment.paragraphNumber }}</h4>
            <p class="comment-content">{{ comment.content }}</p>
            <span class="comment-timestamp">{{ comment.timestamp }}</span>
          </div>
          <div v-if="userComments.length === 0" class="empty-state">
            <p>点击左侧段落添加您的评论</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommentMode",
  props: {
    currentChapter: {
      type: Object,
      required: true,
    },
    userComments: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      activeComment: "",
      contentScrolling: false,
      analysisScrolling: false,
    };
  },
  methods: {
    highlightParagraph(paragraphId, commentId) {
      // 移除之前的高亮
      const paragraphElements = document.querySelectorAll(".highlight");
      paragraphElements.forEach((el) => {
        el.classList.remove("highlight");
      });

      // 添加高亮效果
      const targetParagraph = document.getElementById(paragraphId);
      if (targetParagraph) {
        targetParagraph.classList.add("highlight");
        targetParagraph.scrollIntoView({ behavior: "smooth" });
      }

      // 设置当前活动评论
      this.activeComment = commentId;
      this.$emit("highlight-paragraph", paragraphId, commentId);
    },

    handleContentScroll() {
      if (this.analysisScrolling) return;
      this.contentScrolling = true;

      // 寻找当前可见的段落
      const paragraphElements = document.querySelectorAll(".paragraph");
      let visibleParagraph = null;

      for (const para of paragraphElements) {
        const rect = para.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
          visibleParagraph = para;
          break;
        }
      }

      if (visibleParagraph) {
        const paraId = visibleParagraph.id;

        // 查找匹配的原始评论
        const originalComment = this.currentChapter.comments.find(
          (c) => c.targetParagraph === paraId
        );

        // 查找匹配的用户评论
        const userCommentIndex = this.userComments.findIndex(
          (c) => c.targetParagraph === paraId
        );

        if (originalComment) {
          this.activeComment = originalComment.id;
          const commentElement = document.getElementById(originalComment.id);
          if (commentElement) {
            commentElement.scrollIntoView({ behavior: "smooth" });
          }
        } else if (userCommentIndex !== -1) {
          this.activeComment = `user-comment-${userCommentIndex}`;
          // 找到用户评论元素
          const commentElements = document.querySelectorAll(".user-comment");
          if (commentElements[userCommentIndex]) {
            commentElements[userCommentIndex].scrollIntoView({
              behavior: "smooth",
            });
          }
        }
      }

      setTimeout(() => {
        this.contentScrolling = false;
      }, 100);
    },

    handleAnalysisScroll() {
      if (this.contentScrolling) return;
      this.analysisScrolling = true;

      setTimeout(() => {
        this.analysisScrolling = false;
      }, 100);
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.contentDiv && this.$refs.analysisDiv) {
        this.$refs.contentDiv.addEventListener(
          "scroll",
          this.handleContentScroll
        );
        this.$refs.analysisDiv.addEventListener(
          "scroll",
          this.handleAnalysisScroll
        );
      }
    });
  },
  beforeUnmount() {
    if (this.$refs.contentDiv) {
      this.$refs.contentDiv.removeEventListener(
        "scroll",
        this.handleContentScroll
      );
    }
    if (this.$refs.analysisDiv) {
      this.$refs.analysisDiv.removeEventListener(
        "scroll",
        this.handleAnalysisScroll
      );
    }
  },
};
</script>

<style scoped>
/* 评论模式样式 */
.main-content {
  margin-bottom: var(--spacing-xl);
}

.row {
  display: flex;
  gap: var(--spacing-lg);
}

.content-column,
.comments-column {
  flex: 1;
  border-radius: var(--radius-lg);
  background-color: var(--surface-color);
  box-shadow: var(--shadow-sm);
  overflow-y: auto;
  height: calc(100vh - 220px);
  padding: var(--spacing-lg);
}

.column-title {
  margin-top: 0;
  margin-bottom: var(--spacing-lg);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border-color);
}

.hint-text {
  font-size: 0.875rem;
  font-weight: normal;
  color: var(--text-muted);
  margin-left: var(--spacing-sm);
}

/* 段落样式 */
.paragraph {
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  background-color: var(--bg-color);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all var(--transition-fast) ease;
}

.paragraph:hover {
  border-color: var(--primary-light);
  background-color: var(--surface-variant);
}

.paragraph-number {
  display: inline-block;
  padding: 2px var(--spacing-sm);
  background-color: var(--primary-color);
  color: var(--text-on-primary);
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: var(--radius-sm);
  margin-right: var(--spacing-sm);
}

.paragraph.highlight {
  border-color: var(--primary-color);
  background-color: rgba(126, 87, 194, 0.05);
  animation: pulse 1.5s ease;
}

@keyframes pulse {
  0% {
    background-color: rgba(126, 87, 194, 0.15);
  }
  100% {
    background-color: rgba(126, 87, 194, 0.05);
  }
}

/* 评论区样式 */
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

.comment {
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  background-color: var(--bg-color);
  border-left: 3px solid var(--primary-color);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  cursor: pointer;
  transition: all var(--transition-fast) ease;
  position: relative;
}

.comment:hover {
  background-color: var(--surface-variant);
  transform: translateX(3px);
}

.comment.active {
  background-color: rgba(126, 87, 194, 0.05);
  border-left-color: var(--primary-dark);
}

.comment-title {
  margin-top: 0;
  margin-bottom: var(--spacing-xs);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--primary-color);
}

.comment-content {
  margin-bottom: 0;
  color: var(--text-primary);
  font-size: 0.95rem;
  line-height: 1.6;
}

.user-comment {
  border-left-color: var(--secondary-color);
}

.user-comment .comment-title {
  color: var(--secondary-color);
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
  opacity: 0;
  transition: all var(--transition-fast) ease;
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

.user-comment:hover .delete-button {
  opacity: 1;
}

.delete-button:hover {
  color: var(--error-color);
  background-color: rgba(229, 57, 53, 0.1);
}

.comment-timestamp {
  display: block;
  margin-top: var(--spacing-sm);
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: var(--spacing-lg);
  color: var(--text-muted);
}

/* 响应式调整 */
@media (max-width: 992px) {
  .row {
    flex-direction: column;
  }

  .content-column,
  .comments-column {
    height: auto;
    max-height: 60vh;
  }
}
</style>
