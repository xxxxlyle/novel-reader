<template>
  <div class="container reader-container">
    <div class="reader-main">
      <!-- 阅读区域 -->
      <div
        class="reader-content card"
        :class="readerTheme"
        :style="{ fontSize: fontSize + 'px' }"
        @click="handleReaderClick"
        @scroll="updateReadingProgress"
        ref="readerContent"
      >
        <h1 class="reader-title">{{ currentChapter.title }}</h1>

        <div
          v-for="paragraph in currentChapter.paragraphs"
          :key="paragraph.id"
          :id="paragraph.id + '-reader'"
          class="reader-paragraph"
          @click="
            $emit(
              'open-paragraph-comments',
              paragraph.id,
              paragraph.number,
              $event
            )
          "
        >
          <div class="paragraph-content">
            <span v-html="paragraph.content"></span>

            <!-- 内联评论按钮 -->
            <button
              class="inline-comment-btn"
              :class="{ 'has-comments': hasParagraphComments(paragraph.id) }"
              :title="
                getParagraphCommentsCount(paragraph.id) > 0
                  ? '查看评论 (' + getParagraphCommentsCount(paragraph.id) + ')'
                  : '添加评论'
              "
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
              </svg>
              <span
                v-if="getParagraphCommentsCount(paragraph.id) > 0"
                class="comment-count"
              >
                {{ getParagraphCommentsCount(paragraph.id) }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- 底部浮动控制栏 -->
      <bottom-controls
        :show-controls="showControls"
        :reading-progress="readingProgress"
        :font-size="fontSize"
        :reader-theme="readerTheme"
        :has-previous="hasPreviousChapter"
        :has-next="hasNextChapter"
        @navigate-previous="$emit('navigate-to-previous')"
        @navigate-next="$emit('navigate-to-next')"
        @decrease-font="decreaseFontSize"
        @increase-font="increaseFontSize"
        @change-theme="setReaderTheme"
        @toggle-comments="showAllComments"
      />

      <!-- 段落评论侧边栏 -->
      <paragraph-comments
        :show="showParagraphComments"
        :current-paragraph-id="currentParagraphId"
        :current-paragraph-number="currentParagraphNumber"
        :current-chapter="currentChapter"
        :user-comments="userComments"
        @close="closeParagraphComments"
        @add-comment="
          $emit('open-comment-form', currentParagraphId, currentParagraphNumber)
        "
        @delete-user-comment="$emit('delete-user-comment', $event)"
      />

      <!-- 所有评论侧边栏 -->
      <all-comments
        :show="showAllCommentsSidebar"
        :current-chapter="currentChapter"
        :user-comments="userComments"
        @close="closeAllComments"
        @scroll-to-paragraph="scrollToParagraph"
        @open-overall-comment="$emit('open-overall-comment-form')"
        @delete-user-comment="$emit('delete-user-comment', $event)"
      />
    </div>
  </div>
</template>

<script>
import BottomControls from "./controls/BottomControls.vue";
import ParagraphComments from "./sidebars/ParagraphComments.vue";
import AllComments from "./sidebars/AllComments.vue";

export default {
  name: "ReaderMode",
  components: {
    BottomControls,
    ParagraphComments,
    AllComments,
  },
  props: {
    currentChapter: {
      type: Object,
      required: true,
    },
    userComments: {
      type: Array,
      required: true,
    },
    fontSize: {
      type: Number,
      default: 18,
    },
    readerTheme: {
      type: String,
      default: "light",
    },
    readingProgress: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      showControls: false,
      controlsTimer: null,
      showParagraphComments: false,
      showAllCommentsSidebar: false,
      currentParagraphId: "",
      currentParagraphNumber: "",
    };
  },
  methods: {
    handleReaderClick(event) {
      // 获取窗口的中心点
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // 定义中心区域的范围（例如中心50%的区域）
      const centerWidthRange = window.innerWidth * 0.5;
      const centerHeightRange = window.innerHeight * 0.5;

      // 检查点击是否在中心区域内
      if (
        Math.abs(event.clientX - centerX) < centerWidthRange / 2 &&
        Math.abs(event.clientY - centerY) < centerHeightRange / 2
      ) {
        this.toggleControls();
      }
    },

    toggleControls() {
      this.showControls = !this.showControls;

      // 重置自动隐藏计时器
      if (this.showControls) {
        this.resetControlsTimeout();
      } else {
        this.clearControlsTimeout();
      }
    },

    resetControlsTimeout() {
      this.clearControlsTimeout();

      // 3秒后自动隐藏控制栏
      this.controlsTimer = setTimeout(() => {
        this.showControls = false;
      }, 3000);
    },

    clearControlsTimeout() {
      if (this.controlsTimer) {
        clearTimeout(this.controlsTimer);
        this.controlsTimer = null;
      }
    },

    // 章节导航
    hasPreviousChapter() {
      return true; // 这里使用props替代实际逻辑，父组件会处理
    },

    hasNextChapter() {
      return true; // 这里使用props替代实际逻辑，父组件会处理
    },

    // 评论相关方法
    hasParagraphComments(paragraphId) {
      return this.getParagraphCommentsCount(paragraphId) > 0;
    },

    getParagraphCommentsCount(paragraphId) {
      const officialComments =
        this.getOfficialCommentsForParagraph(paragraphId).length;
      const userComments = this.getUserCommentsForParagraph(paragraphId).length;
      return officialComments + userComments;
    },

    getOfficialCommentsForParagraph(paragraphId) {
      if (!this.currentChapter) return [];
      return this.currentChapter.comments.filter(
        (comment) => comment.targetParagraph === paragraphId
      );
    },

    getUserCommentsForParagraph(paragraphId) {
      return this.userComments.filter(
        (comment) => comment.targetParagraph === paragraphId
      );
    },

    openParagraphComments(paragraphId, paragraphNumber) {
      // 显示控制栏
      this.showControls = true;
      this.resetControlsTimeout();

      // 关闭全部评论侧边栏（如果打开）
      this.showAllCommentsSidebar = false;

      this.currentParagraphId = paragraphId;
      this.currentParagraphNumber = paragraphNumber;
      this.showParagraphComments = true;
    },

    closeParagraphComments() {
      this.showParagraphComments = false;
      this.resetControlsTimeout();
    },

    showAllComments() {
      this.showControls = true;
      this.resetControlsTimeout();
      this.showParagraphComments = false;
      this.showAllCommentsSidebar = true;
    },

    closeAllComments() {
      this.showAllCommentsSidebar = false;
      this.resetControlsTimeout();
    },

    // 阅读器设置
    decreaseFontSize() {
      if (this.fontSize > 12) {
        this.$emit("font-size-changed", this.fontSize - 2);
      }
      this.resetControlsTimeout();
    },

    increaseFontSize() {
      if (this.fontSize < 28) {
        this.$emit("font-size-changed", this.fontSize + 2);
      }
      this.resetControlsTimeout();
    },

    setReaderTheme(theme) {
      this.$emit("theme-changed", theme);
      this.resetControlsTimeout();
    },

    // 滚动和阅读进度
    updateReadingProgress() {
      if (!this.$refs.readerContent) return;

      const container = this.$refs.readerContent;
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      // 计算阅读进度百分比
      const progress =
        Math.round((scrollTop / (scrollHeight - clientHeight)) * 100) || 0;

      // 限制在0-100之间
      const boundedProgress = Math.min(100, Math.max(0, progress));

      this.$emit("update-reading-progress", boundedProgress);
    },

    scrollToParagraph(paragraphId) {
      const targetId = paragraphId + "-reader";
      const targetElement = document.getElementById(targetId);

      if (targetElement && this.$refs.readerContent) {
        // 计算目标元素相对于阅读器容器的位置
        const containerTop =
          this.$refs.readerContent.getBoundingClientRect().top;
        const targetTop = targetElement.getBoundingClientRect().top;
        const scrollTop = this.$refs.readerContent.scrollTop;

        // 将目标元素滚动到可视区域
        this.$refs.readerContent.scrollTo({
          top: scrollTop + (targetTop - containerTop) - 100, // 减去一些偏移以便更好地查看
          behavior: "smooth",
        });

        // 高亮效果
        targetElement.classList.add("highlight");
        setTimeout(() => {
          targetElement.classList.remove("highlight");
        }, 2000);

        // 如果是从全部评论侧边栏点击的，关闭侧边栏
        this.showAllCommentsSidebar = false;

        // 打开对应段落的评论侧边栏
        this.openParagraphComments(
          paragraphId,
          this.getParagraphNumberById(paragraphId)
        );
      }
    },

    getParagraphNumberById(paragraphId) {
      if (!this.currentChapter) return "";
      const paragraph = this.currentChapter.paragraphs.find(
        (p) => p.id === paragraphId
      );
      return paragraph ? paragraph.number : "";
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.readerContent) {
        this.updateReadingProgress();
      }
    });
  },
  beforeUnmount() {
    this.clearControlsTimeout();
  },
};
</script>

<style scoped>
/* 阅读模式样式 */
.reader-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.reader-main {
  position: relative;
}

.reader-content {
  padding: var(--spacing-xl);
  max-width: 800px;
  margin: 0 auto var(--spacing-xl);
  line-height: 1.8;
  min-height: calc(100vh - 200px);
  overflow-y: auto;
  border-radius: var(--radius-lg);
  transition: margin-right var(--transition-normal) ease;
}

.reader-content.light {
  background-color: #ffffff;
  color: #333333;
}

.reader-content.sepia {
  background-color: #f8f1e3;
  color: #5f4b32;
}

.reader-content.dark {
  background-color: #121212;
  color: #e0e0e0;
}

.reader-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: var(--spacing-xl);
  text-align: center;
}

/* 段落样式 */
.reader-paragraph {
  margin-bottom: var(--spacing-sm);
  padding-bottom: var(--spacing-xs);
  text-indent: 2em;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.reader-paragraph:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.reader-content.dark .reader-paragraph:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.reader-content.sepia .reader-paragraph:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.paragraph-content {
  display: inline;
}

/* 内联评论按钮样式 */
.inline-comment-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  background-color: transparent;
  color: var(--text-muted);
  cursor: pointer;
  opacity: 0.3;
  transition: all var(--transition-fast) ease;
  position: relative;
  margin-left: 3px;
  vertical-align: middle;
  transform: translateY(-1px);
}

.inline-comment-btn:hover,
.inline-comment-btn.has-comments {
  opacity: 1;
  color: var(--primary-color);
}

.comment-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: var(--primary-color);
  color: white;
  font-size: 0.7rem;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 高亮效果 */
.reader-paragraph.highlight {
  animation: reader-highlight 2s ease;
}

@keyframes reader-highlight {
  0% {
    background-color: rgba(126, 87, 194, 0.2);
  }
  100% {
    background-color: transparent;
  }
}

@media (max-width: 768px) {
  .reader-container {
    padding: 0 var(--spacing-sm);
  }

  .reader-content {
    padding: var(--spacing-md);
  }
}
</style>
