<template>
  <div class="bookshelf-container">
    <header class="bookshelf-header">
      <div class="container">
        <h1>我的书架</h1>
        <button
          class="btn btn-primary add-book-btn"
          @click="showAddBookModal = true"
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
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          添加新书
        </button>
      </div>
    </header>

    <div class="container main-content">
      <div v-if="books.length === 0" class="empty-state-card card">
        <div class="empty-state">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <h3>书架上还没有书籍</h3>
          <p>点击"添加新书"按钮开始创建您的书籍收藏</p>
          <button class="btn btn-primary" @click="showAddBookModal = true">
            添加新书
          </button>
        </div>
      </div>

      <div v-else class="bookshelf-grid">
        <div
          v-for="book in books"
          :key="book.id"
          class="book-card card"
          @click="openBook(book.id)"
        >
          <div
            class="book-cover"
            :style="{ backgroundColor: book.coverColor || '#7e57c2' }"
          >
            <span class="book-emoji">{{ book.emoji || "📚" }}</span>
          </div>
          <div class="book-info">
            <h3 class="book-title">{{ book.title }}</h3>
            <p class="book-details">
              <span>{{ book.chapterCount || 0 }} 章节</span>
              <span>{{ book.lastUpdated }}</span>
            </p>
          </div>
          <div class="book-actions">
            <button class="btn btn-icon" @click.stop="editBook(book)">
              <svg
                xmlns="http://www.w3.org/2000/svg"
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
            </button>
            <button
              class="btn btn-icon delete-btn"
              @click.stop="deleteBook(book.id)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
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
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加新书对话框 -->
    <div v-if="showAddBookModal">
      <div class="modal-overlay" @click="showAddBookModal = false"></div>
      <div class="modal animate-slideUp">
        <div class="modal-content card">
          <div class="modal-header">
            <h3>{{ editMode ? "编辑书籍" : "添加新书" }}</h3>
            <button class="close-button" @click="showAddBookModal = false">
              &times;
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="bookTitle">书名</label>
              <input
                type="text"
                id="bookTitle"
                class="form-control"
                v-model="newBook.title"
                placeholder="输入书名"
                required
              />
            </div>
            <div class="form-group">
              <label for="bookDescription">描述</label>
              <textarea
                id="bookDescription"
                class="form-control"
                v-model="newBook.description"
                placeholder="简单描述一下这本书..."
                rows="3"
              ></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="bookEmoji">图标</label>
                <input
                  type="text"
                  id="bookEmoji"
                  class="form-control emoji-input"
                  v-model="newBook.emoji"
                  placeholder="📚"
                  maxlength="2"
                />
              </div>
              <div class="form-group">
                <label for="bookColor">颜色</label>
                <input
                  type="color"
                  id="bookColor"
                  class="form-control"
                  v-model="newBook.coverColor"
                />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" @click="showAddBookModal = false">
              取消
            </button>
            <button class="btn btn-primary" @click="saveBook">保存</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <div v-if="showDeleteConfirm">
      <div class="modal-overlay" @click="showDeleteConfirm = false"></div>
      <div class="modal animate-slideUp">
        <div class="modal-content card delete-confirm">
          <div class="modal-header">
            <h3>确认删除</h3>
            <button class="close-button" @click="showDeleteConfirm = false">
              &times;
            </button>
          </div>
          <div class="modal-body">
            <p>确定要删除这本书吗？此操作无法撤销，所有章节数据将会丢失。</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" @click="showDeleteConfirm = false">
              取消
            </button>
            <button class="btn btn-error" @click="confirmDelete">删除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BookshelfView",
  data() {
    return {
      books: [],
      showAddBookModal: false,
      showDeleteConfirm: false,
      bookToDeleteId: null,
      newBook: {
        title: "",
        description: "",
        emoji: "📚",
        coverColor: "#7e57c2",
      },
      editMode: false,
      editBookId: null,
    };
  },
  mounted() {
    this.loadBooks();
  },
  methods: {
    loadBooks() {
      // 从本地存储加载书籍列表
      const booksData = localStorage.getItem("books");
      if (booksData) {
        try {
          this.books = JSON.parse(booksData);
        } catch (error) {
          console.error("加载书籍数据失败:", error);
          this.books = [];
        }
      }

      // 如果没有书籍，添加示例书籍
      if (
        this.books.length === 0 &&
        !localStorage.getItem("hasSeenBookshelf")
      ) {
        this.addSampleBook();
        localStorage.setItem("hasSeenBookshelf", "true");
      }
    },

    saveBooks() {
      localStorage.setItem("books", JSON.stringify(this.books));
    },

    openBook(bookId) {
      // 导航到书籍详情页面
      this.$router.push({ name: "book", params: { id: bookId } });
    },

    addSampleBook() {
      const sampleBook = {
        id: "sample-book-" + Date.now(),
        title: "示例书籍",
        description: "这是一个示例书籍，您可以添加章节并进行评论分析。",
        emoji: "📖",
        coverColor: "#7e57c2",
        chapterCount: 1,
        lastUpdated: new Date().toLocaleDateString(),
      };

      this.books.push(sampleBook);
      this.saveBooks();

      // 创建一个示例章节
      const sampleChapter = {
        id: "sample-chapter",
        title: "示例章节",
        bookId: sampleBook.id,
        paragraphs: [
          {
            id: "para-1",
            number: "1.",
            content: "这是示例章节的第一个段落。点击任何段落可以添加您的评论。",
          },
          {
            id: "para-2",
            number: "2.",
            content: "您可以使用导入新章节按钮来添加您自己的小说章节内容。",
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

      // 保存示例章节
      const bookChapters = [sampleChapter];
      localStorage.setItem(
        `book-chapters-${sampleBook.id}`,
        JSON.stringify(bookChapters)
      );
    },

    editBook(book) {
      this.editMode = true;
      this.editBookId = book.id;
      this.newBook = {
        title: book.title,
        description: book.description || "",
        emoji: book.emoji || "📚",
        coverColor: book.coverColor || "#7e57c2",
      };
      this.showAddBookModal = true;
    },

    deleteBook(bookId) {
      this.bookToDeleteId = bookId;
      this.showDeleteConfirm = true;
    },

    confirmDelete() {
      if (!this.bookToDeleteId) return;

      // 删除相关的章节数据
      localStorage.removeItem(`book-chapters-${this.bookToDeleteId}`);

      // 删除相关的评论数据
      const chaptersDataString = localStorage.getItem(
        `book-chapters-${this.bookToDeleteId}`
      );
      if (chaptersDataString) {
        try {
          const chapters = JSON.parse(chaptersDataString);
          chapters.forEach((chapter) => {
            localStorage.removeItem(`comments-${chapter.id}`);
          });
        } catch (error) {
          console.error("删除章节评论数据失败:", error);
        }
      }

      // 从书籍列表中删除
      const index = this.books.findIndex(
        (book) => book.id === this.bookToDeleteId
      );
      if (index !== -1) {
        this.books.splice(index, 1);
        this.saveBooks();
      }

      this.showDeleteConfirm = false;
      this.bookToDeleteId = null;
    },

    saveBook() {
      if (!this.newBook.title) {
        alert("请输入书名");
        return;
      }

      if (this.editMode && this.editBookId) {
        // 编辑现有书籍
        const bookIndex = this.books.findIndex(
          (book) => book.id === this.editBookId
        );
        if (bookIndex !== -1) {
          // 保留原有的其他属性
          const originalBook = this.books[bookIndex];
          this.books[bookIndex] = {
            ...originalBook,
            title: this.newBook.title,
            description: this.newBook.description,
            emoji: this.newBook.emoji,
            coverColor: this.newBook.coverColor,
            lastUpdated: new Date().toLocaleDateString(),
          };
        }
      } else {
        // 创建新书籍
        const newBook = {
          id: "book-" + Date.now(),
          title: this.newBook.title,
          description: this.newBook.description,
          emoji: this.newBook.emoji,
          coverColor: this.newBook.coverColor,
          chapterCount: 0,
          lastUpdated: new Date().toLocaleDateString(),
        };

        this.books.push(newBook);
      }

      this.saveBooks();
      this.resetForm();
    },

    resetForm() {
      this.newBook = {
        title: "",
        description: "",
        emoji: "📚",
        coverColor: "#7e57c2",
      };
      this.editMode = false;
      this.editBookId = null;
      this.showAddBookModal = false;
    },
  },
};
</script>

<style scoped>
.bookshelf-container {
  min-height: 100vh;
}

.bookshelf-header {
  padding: var(--spacing-lg) 0;
  background-color: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
}

.bookshelf-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bookshelf-header h1 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--primary-color);
}

.add-book-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.main-content {
  margin: var(--spacing-xl) auto;
}

.bookshelf-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.book-card {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all var(--transition-fast) ease;
  overflow: hidden;
  position: relative;
  height: 220px;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.book-cover {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
}

.book-emoji {
  font-size: 3rem;
}

.book-info {
  padding: var(--spacing-md);
  flex: 1;
}

.book-title {
  margin: 0 0 var(--spacing-xs);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.book-details {
  display: flex;
  justify-content: space-between;
  color: var(--text-muted);
  font-size: 0.85rem;
  margin: 0;
}

.book-actions {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  display: flex;
  gap: var(--spacing-xs);
  visibility: hidden; /* 使用 visibility 代替 opacity */
  opacity: 0;
  transition: opacity var(--transition-fast) ease,
    visibility var(--transition-fast) ease;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: var(--radius-sm);
  padding: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.book-card:hover .book-actions {
  visibility: visible; /* 悬停时显示 */
  opacity: 1;
}

/* 移动设备上始终显示按钮 */
@media (max-width: 768px) {
  .book-actions {
    visibility: visible;
    opacity: 1;
  }
}

/* 确保从其他页面返回时不会保持悬停状态 */
.bookshelf-container:not(:hover) .book-actions {
  visibility: hidden !important;
  opacity: 0 !important;
  transition: opacity 0.1s ease, visibility 0.1s ease;
}

.book-actions .btn-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: white;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  overflow: hidden;
}

.book-actions .btn-icon:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.book-actions .btn-icon svg {
  width: 40px !important;
  height: 40px !important;
  transform: scale(5);
  stroke-width: 1.5;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
  transition: all 0.2s ease;
}

.book-actions .btn-icon:hover svg {
  transform: scale(5.3);
}

.book-actions .delete-btn {
  color: var(--error-color);
}

.book-actions .delete-btn:hover {
  background-color: var(--error-color);
  color: white;
  border-color: var(--error-color);
}

/* 表单样式 */
.form-group {
  margin-bottom: var(--spacing-md);
}

.form-row {
  display: flex;
  gap: var(--spacing-md);
}

.form-row .form-group {
  flex: 1;
}

label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
  color: var(--text-secondary);
}

.form-control {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 1rem;
  color: var(--text-primary);
  background-color: var(--surface-color);
}

.emoji-input {
  font-size: 1.5rem;
  text-align: center;
}

/* 确认删除对话框 */
.delete-confirm .modal-body {
  color: var(--text-secondary);
}

.btn-error {
  background-color: var(--error-color);
  color: white;
}

.btn-error:hover {
  background-color: var(--error-dark);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .bookshelf-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }

  .book-card {
    height: 200px;
  }

  .book-cover {
    height: 100px;
  }

  .book-emoji {
    font-size: 2.5rem;
  }

  .book-title {
    font-size: 1rem;
  }

  .book-actions {
    opacity: 1;
    top: var(--spacing-xs);
    right: var(--spacing-xs);
  }

  .book-actions .btn-icon {
    width: 32px;
    height: 32px;
  }

  .book-actions .btn-icon svg {
    width: 18px;
    height: 18px;
  }
}

/* 添加对话框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 101;
  width: 90%;
  max-width: 500px;
}

.modal-content {
  background-color: var(--bg-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-secondary);
}

.modal-body {
  padding: var(--spacing-lg);
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--border-color);
}

.animate-slideUp {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translate(-50%, 10%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, -50%);
    opacity: 1;
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .modal {
    width: 95%;
  }

  .modal-body {
    padding: var(--spacing-md);
    max-height: 60vh;
  }

  .form-row {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
}
</style>
