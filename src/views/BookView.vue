<template>
  <div class="book-view">
    <header class="book-header">
      <div class="container">
        <div class="back-link">
          <router-link to="/" class="btn btn-icon">
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
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            返回书架
          </router-link>
        </div>
        <h1>{{ bookTitle }}</h1>
      </div>
    </header>

    <!-- 使用修改后的 NovelCommentSystem 组件 -->
    <novel-comment-system :book-id="bookId" />
  </div>
</template>

<script>
import NovelCommentSystem from "@/components/NovelCommentSystem/index.vue";

export default {
  name: "BookView",
  components: {
    NovelCommentSystem,
  },
  data() {
    return {
      bookTitle: "",
      bookId: "",
    };
  },
  created() {
    this.bookId = this.$route.params.id;
    this.loadBookData();
  },
  methods: {
    loadBookData() {
      // 从本地存储加载书籍信息
      const booksData = localStorage.getItem("books");
      if (booksData) {
        try {
          const books = JSON.parse(booksData);
          const book = books.find((b) => b.id === this.bookId);
          if (book) {
            this.bookTitle = book.title;
          } else {
            // 如果找不到书籍，返回书架
            this.$router.push("/");
          }
        } catch (error) {
          console.error("加载书籍数据失败:", error);
          this.$router.push("/");
        }
      } else {
        this.$router.push("/");
      }
    },
  },
  watch: {
    // 监听路由参数变化，更新数据
    "$route.params.id": function (newId) {
      this.bookId = newId;
      this.loadBookData();
    },
  },
};
</script>

<style scoped>
.book-header {
  padding: var(--spacing-md) 0;
  background-color: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
}

.book-header .container {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.book-header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
}

.back-link .btn-icon {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--text-secondary);
}

.back-link a {
  text-decoration: none;
}

@media (max-width: 768px) {
  .book-header h1 {
    font-size: 1.25rem;
  }
}
</style>
