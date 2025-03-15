<template>
  <div class="novel-comment-system" :class="{ 'reader-mode': isReaderMode }">
    <header class="header">
      <div class="container">
        <h1>章节内容与评论对照分析</h1>
      </div>
    </header>

    <div class="container tools-container">
      <div class="tools-left">
        <chapter-import @chapter-imported="handleChapterImport" />
        <button class="btn btn-text mode-toggle" @click="toggleMode">
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
            class="icon"
          >
            <path d="M4 14h16M4 10h16"></path>
            <path d="M12 22v-6"></path>
            <path
              d="M22 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2"
            ></path>
            <path d="M18 12v-2"></path>
          </svg>
          {{ isReaderMode ? "评论模式" : "阅读模式" }}
        </button>
      </div>

      <chapter-manager
        :chapters="chapters"
        :current-chapter-id="currentChapterId"
        @chapter-changed="switchChapter"
        @chapter-renamed="renameChapter"
        @chapter-deleted="deleteChapter"
      />
    </div>

    <!-- 评论模式 -->
    <comment-mode
      v-if="currentChapter && !isReaderMode"
      :current-chapter="currentChapter"
      :user-comments="userComments"
      @open-comment-form="openCommentForm"
      @highlight-paragraph="highlightParagraph"
      @open-overall-comment-form="openOverallCommentForm"
      @delete-user-comment="deleteUserComment"
      ref="commentMode"
    />

    <!-- 阅读模式 -->
    <reader-mode
      v-else-if="currentChapter && isReaderMode"
      :current-chapter="currentChapter"
      :user-comments="userComments"
      :font-size="fontSize"
      :reader-theme="readerTheme"
      :reading-progress="readingProgress"
      @font-size-changed="updateFontSize"
      @theme-changed="setReaderTheme"
      @open-comment-form="openCommentForm"
      @open-paragraph-comments="openParagraphComments"
      @delete-user-comment="deleteUserComment"
      @open-overall-comment-form="openOverallCommentForm"
      @navigate-to-previous="navigateToPreviousChapter"
      @navigate-to-next="navigateToNextChapter"
      @update-reading-progress="updateReadingProgress"
      ref="readerMode"
    />

    <div v-else class="container">
      <div class="empty-state-card card">
        <div class="empty-state">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 5V19H5V5H19ZM21 3H3V21H21V3ZM11 7H7V9H11V7ZM17 7H13V9H17V7ZM11 11H7V13H11V11ZM17 11H13V13H17V11ZM11 15H7V17H11V15ZM17 15H13V17H17V15Z"
              fill="currentColor"
            />
          </svg>
          <h3>没有可用的章节</h3>
          <p>请使用"导入新章节"按钮添加内容</p>
        </div>
      </div>
    </div>

    <!-- 评论表单 -->
    <comment-form
      v-if="showCommentForm"
      :paragraph-number="currentParagraphNumber"
      :initial-text="newCommentText"
      @submit="submitComment"
      @cancel="cancelComment"
      @update:text="newCommentText = $event"
    />

    <!-- 总体评价表单 -->
    <overall-comment-form
      v-if="showOverallCommentForm"
      :initial-text="newOverallComment"
      @submit="submitOverallComment"
      @cancel="cancelOverallComment"
      @update:text="newOverallComment = $event"
    />
  </div>
</template>

<script>
import ChapterImport from "../ChapterImport.vue";
import ChapterManager from "../ChapterManager.vue";
import CommentMode from "./CommentMode.vue";
import ReaderMode from "./ReaderMode.vue";
import CommentForm from "./modals/CommentForm.vue";
import OverallCommentForm from "./modals/OverallCommentForm.vue";

export default {
  name: "NovelCommentSystem",
  props: {
    bookId: {
      type: String,
      required: true,
    },
  },
  components: {
    ChapterImport,
    ChapterManager,
    CommentMode,
    ReaderMode,
    CommentForm,
    OverallCommentForm,
  },
  data() {
    return {
      // 章节相关
      chapters: [],
      currentChapterId: "",

      // 显示控制
      isReaderMode: false,

      // 阅读器设置
      fontSize: 18,
      readerTheme: "light",
      readingProgress: 0,

      // 评论相关
      activeComment: "",
      currentParagraphId: "",
      currentParagraphNumber: "",
      showCommentForm: false,
      newCommentText: "",
      userComments: [],

      // 总体评价
      showOverallCommentForm: false,
      newOverallComment: "",
    };
  },
  computed: {
    currentChapter() {
      return (
        this.chapters.find((chapter) => chapter.id === this.currentChapterId) ||
        null
      );
    },
  },
  methods: {
    // 模式切换
    saveChaptersToLocalStorage() {
      localStorage.setItem(
        `book-chapters-${this.bookId}`,
        JSON.stringify(this.chapters)
      );

      // 更新书籍的章节计数
      this.updateBookChapterCount();
    },

    loadChaptersFromLocalStorage() {
      const chaptersData = localStorage.getItem(`book-chapters-${this.bookId}`);
      if (chaptersData) {
        try {
          this.chapters = JSON.parse(chaptersData);
          if (this.chapters.length > 0) {
            this.currentChapterId = this.chapters[0].id;
            this.loadUserCommentsFromLocalStorage();
          }
        } catch (error) {
          console.error("加载章节数据失败:", error);
        }
      }
    },

    updateBookChapterCount() {
      // 更新书籍的章节数量信息
      const booksData = localStorage.getItem("books");
      if (booksData) {
        try {
          const books = JSON.parse(booksData);
          const bookIndex = books.findIndex((b) => b.id === this.bookId);

          if (bookIndex !== -1) {
            books[bookIndex].chapterCount = this.chapters.length;
            books[bookIndex].lastUpdated = new Date().toLocaleDateString();
            localStorage.setItem("books", JSON.stringify(books));
          }
        } catch (error) {
          console.error("更新书籍章节数量失败:", error);
        }
      }
    },

    handleChapterImport(chapter) {
      // 在章节对象中添加书籍ID
      chapter.bookId = this.bookId;
      this.chapters.push(chapter);
      this.saveChaptersToLocalStorage();
      this.switchChapter(chapter.id);
    },

    saveUserCommentsToLocalStorage() {
      if (this.currentChapterId) {
        localStorage.setItem(
          `comments-${this.currentChapterId}`,
          JSON.stringify(this.userComments)
        );
      }
    },
    toggleMode() {
      this.isReaderMode = !this.isReaderMode;
      localStorage.setItem("isReaderMode", this.isReaderMode.toString());
    },

    // 章节管理
    handleChapterImport(chapter) {
      this.chapters.push(chapter);
      this.saveChaptersToLocalStorage();
      this.switchChapter(chapter.id);
    },

    switchChapter(chapterId) {
      this.saveUserCommentsToLocalStorage();
      this.currentChapterId = chapterId;
      this.loadUserCommentsFromLocalStorage();
      this.activeComment = "";
    },

    renameChapter(data) {
      const chapter = this.chapters.find((c) => c.id === data.id);
      if (chapter) {
        chapter.title = data.title;
        this.saveChaptersToLocalStorage();
      }
    },

    deleteChapter(chapterId) {
      const index = this.chapters.findIndex((c) => c.id === chapterId);
      if (index === -1) return;

      this.chapters.splice(index, 1);
      localStorage.removeItem(`comments-${chapterId}`);

      if (this.chapters.length > 0) {
        this.switchChapter(this.chapters[0].id);
      } else {
        this.currentChapterId = "";
        this.userComments = [];
      }

      this.saveChaptersToLocalStorage();
    },

    // 章节导航
    hasPreviousChapter() {
      if (!this.currentChapter) return false;
      const currentIndex = this.chapters.findIndex(
        (c) => c.id === this.currentChapterId
      );
      return currentIndex > 0;
    },

    hasNextChapter() {
      if (!this.currentChapter) return false;
      const currentIndex = this.chapters.findIndex(
        (c) => c.id === this.currentChapterId
      );
      return currentIndex < this.chapters.length - 1;
    },

    navigateToPreviousChapter() {
      if (!this.hasPreviousChapter()) return;
      const currentIndex = this.chapters.findIndex(
        (c) => c.id === this.currentChapterId
      );
      this.switchChapter(this.chapters[currentIndex - 1].id);
    },

    navigateToNextChapter() {
      if (!this.hasNextChapter()) return;
      const currentIndex = this.chapters.findIndex(
        (c) => c.id === this.currentChapterId
      );
      this.switchChapter(this.chapters[currentIndex + 1].id);
    },

    // 段落评论
    openParagraphComments(paragraphId, paragraphNumber) {
      this.currentParagraphId = paragraphId;
      this.currentParagraphNumber = paragraphNumber;

      if (this.$refs.readerMode) {
        this.$refs.readerMode.openParagraphComments(
          paragraphId,
          paragraphNumber
        );
      }
    },

    // 评论表单
    openCommentForm(paragraphId, paragraphNumber) {
      this.currentParagraphId = paragraphId;
      this.currentParagraphNumber = paragraphNumber;
      this.showCommentForm = true;
    },

    cancelComment() {
      this.showCommentForm = false;
      this.newCommentText = "";
    },

    submitComment() {
      const commentContent = this.newCommentText.trim();
      if (commentContent === "") {
        alert("评论内容不能为空！");
        return;
      }

      const newComment = {
        targetParagraph: this.currentParagraphId,
        paragraphNumber: this.currentParagraphNumber,
        content: commentContent,
        timestamp: new Date().toLocaleString(),
        chapterId: this.currentChapterId,
      };

      this.userComments.push(newComment);
      this.saveUserCommentsToLocalStorage();
      this.showCommentForm = false;
      this.newCommentText = "";

      if (!this.isReaderMode && this.$refs.commentMode) {
        this.$nextTick(() => {
          this.$refs.commentMode.highlightParagraph(
            this.currentParagraphId,
            `user-comment-${this.userComments.length - 1}`
          );
        });
      }
    },

    deleteUserComment(index) {
      if (confirm("确定删除此评论吗？")) {
        this.userComments.splice(index, 1);
        this.saveUserCommentsToLocalStorage();
      }
    },

    // 总体评价
    openOverallCommentForm() {
      if (this.currentChapter) {
        this.newOverallComment = this.currentChapter.overallComment || "";
        this.showOverallCommentForm = true;
      }
    },

    cancelOverallComment() {
      this.showOverallCommentForm = false;
      this.newOverallComment = "";
    },

    submitOverallComment() {
      if (!this.currentChapter) return;
      this.currentChapter.overallComment = this.newOverallComment.trim();
      this.saveChaptersToLocalStorage();
      this.showOverallCommentForm = false;
      this.newOverallComment = "";
    },

    // 高亮段落
    highlightParagraph(paragraphId, commentId) {
      if (!this.isReaderMode && this.$refs.commentMode) {
        this.$refs.commentMode.highlightParagraph(paragraphId, commentId);
      }
    },

    // 阅读器设置
    updateFontSize(size) {
      this.fontSize = size;
      localStorage.setItem("readerFontSize", this.fontSize.toString());
    },

    setReaderTheme(theme) {
      this.readerTheme = theme;
      localStorage.setItem("readerTheme", theme);
    },

    updateReadingProgress(progress) {
      this.readingProgress = progress;
    },

    // 本地存储
    saveChaptersToLocalStorage() {
      localStorage.setItem("chapters", JSON.stringify(this.chapters));
    },

    loadChaptersFromLocalStorage() {
      const chaptersData = localStorage.getItem("chapters");
      if (chaptersData) {
        try {
          this.chapters = JSON.parse(chaptersData);
          if (this.chapters.length > 0) {
            this.currentChapterId = this.chapters[0].id;
            this.loadUserCommentsFromLocalStorage();
          }
        } catch (error) {
          console.error("加载章节数据失败:", error);
        }
      }
    },

    saveUserCommentsToLocalStorage() {
      if (this.currentChapterId) {
        localStorage.setItem(
          `comments-${this.currentChapterId}`,
          JSON.stringify(this.userComments)
        );
      }
    },

    loadUserCommentsFromLocalStorage() {
      if (this.currentChapterId) {
        const commentsData = localStorage.getItem(
          `comments-${this.currentChapterId}`
        );
        if (commentsData) {
          try {
            this.userComments = JSON.parse(commentsData);
          } catch (error) {
            console.error("加载评论数据失败:", error);
            this.userComments = [];
          }
        } else {
          this.userComments = [];
        }
      }
    },

    // 加载用户阅读偏好
    loadUserPreferences() {
      // 加载评论/阅读模式偏好
      const isReaderMode = localStorage.getItem("isReaderMode");
      if (isReaderMode !== null) {
        this.isReaderMode = isReaderMode === "true";
      }

      // 加载字体大小偏好
      const fontSize = localStorage.getItem("readerFontSize");
      if (fontSize !== null) {
        this.fontSize = parseInt(fontSize);
      }

      // 加载主题偏好
      const readerTheme = localStorage.getItem("readerTheme");
      if (readerTheme) {
        this.readerTheme = readerTheme;
      }
    },

    // 导入示例章节
    importSampleChapter() {
      if (this.chapters.length === 0) {
        // 只有在没有章节时才导入示例
        const sampleChapter = {
          id: "sample-chapter",
          title: "示例章节",
          paragraphs: [
            {
              id: "para-1",
              number: "1.",
              content:
                "这是示例章节的第一个段落。点击任何段落可以添加您的评论。",
            },
            {
              id: "para-2",
              number: "2.",
              content: '您可以使用"导入新章节"按钮来添加您自己的小说章节内容。',
            },
            {
              id: "para-3",
              number: "3.",
              content: "系统支持从纯文本或HTML导入内容，也可以直接粘贴文本。",
            },
          ],
          comments: [
            {
              id: "comment-1",
              targetParagraph: "para-1",
              title: "段落1：",
              content: "这是一个示例评论，展示了评论功能的使用方式。",
            },
          ],
          overallComment:
            "这是一个示例章节，用于展示系统的基本功能。您可以导入自己的章节内容进行分析。",
          createdAt: new Date().toISOString(),
        };

        this.chapters.push(sampleChapter);
        this.currentChapterId = sampleChapter.id;
        this.saveChaptersToLocalStorage();
      }
    },
  },
  mounted() {
    this.loadUserPreferences();
    this.loadChaptersFromLocalStorage();

    if (this.chapters.length === 0) {
      this.importSampleChapter();
    }
  },
  beforeUnmount() {
    this.saveUserCommentsToLocalStorage();
  },
};
</script>

<style>
/* 只保留基本布局样式，其他样式移至各个组件 */
.novel-comment-system {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter",
    "Helvetica Neue", Arial, sans-serif;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.header {
  padding: var(--spacing-lg) 0;
  background-color: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
}

.header h1 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--primary-color);
}

.tools-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: var(--spacing-lg) auto;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.tools-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.mode-toggle {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.mode-toggle .icon {
  margin-right: var(--spacing-xs);
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: var(--spacing-lg);
  color: var(--text-muted);
}

.empty-state svg {
  color: var(--text-muted);
  margin-bottom: var(--spacing-md);
}

.empty-state h3 {
  margin-bottom: var(--spacing-sm);
  color: var(--text-secondary);
}

.empty-state p {
  margin-bottom: var(--spacing-md);
}

.empty-state-card {
  padding: var(--spacing-xl);
  background-color: var(--surface-color);
  margin: var(--spacing-xl) auto;
  max-width: 500px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .header h1 {
    font-size: 1.5rem;
  }

  .tools-container {
    flex-direction: column;
    align-items: stretch;
  }

  .tools-left {
    justify-content: space-between;
    width: 100%;
  }
}
</style>
