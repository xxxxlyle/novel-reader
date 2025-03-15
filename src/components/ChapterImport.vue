<template>
  <div class="chapter-import">
    <button class="btn btn-primary import-button" @click="showModal = true">
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
        class="button-icon"
      >
        <path d="M12 5v14M5 12h14"></path>
      </svg>
      导入新章节
    </button>

    <!-- 导入模态框 -->
    <div v-if="showModal" class="modal-wrapper">
      <div class="modal-overlay" @click="showModal = false"></div>
      <div class="modal animate-slideUp">
        <div class="modal-content card">
          <div class="modal-header">
            <h3>导入新章节</h3>
            <button class="close-button" @click="showModal = false">
              &times;
            </button>
          </div>

          <div class="modal-body">
            <div class="tabs">
              <button
                :class="['tab-button', { active: activeTab === 'text' }]"
                @click="activeTab = 'text'"
              >
                粘贴文本
              </button>
              <button
                :class="['tab-button', { active: activeTab === 'file' }]"
                @click="activeTab = 'file'"
              >
                上传文件
              </button>
              <button
                :class="['tab-button', { active: activeTab === 'html' }]"
                @click="activeTab = 'html'"
              >
                导入HTML
              </button>
            </div>

            <div class="tab-content">
              <!-- 文本导入选项卡 -->
              <div v-if="activeTab === 'text'" class="text-import">
                <div class="form-group">
                  <label class="form-label" for="chapter-title">章节标题</label>
                  <input
                    type="text"
                    id="chapter-title"
                    class="form-control"
                    v-model="chapterTitle"
                    placeholder="请输入章节标题"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label" for="chapter-content"
                    >章节内容</label
                  >
                  <textarea
                    id="chapter-content"
                    class="form-control"
                    v-model="chapterContent"
                    placeholder="请粘贴章节内容"
                    rows="10"
                  ></textarea>
                </div>

                <div class="form-group">
                  <label class="form-label">段落分割方式</label>
                  <div class="radio-group">
                    <label class="radio-label">
                      <input
                        type="radio"
                        v-model="splitMode"
                        value="emptyLine"
                      />
                      <span class="radio-text">空行分割</span>
                    </label>
                    <label class="radio-label">
                      <input
                        type="radio"
                        v-model="splitMode"
                        value="indentation"
                      />
                      <span class="radio-text">缩进分割</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- 文件导入选项卡 -->
              <div v-if="activeTab === 'file'" class="file-import">
                <div class="file-upload">
                  <input
                    type="file"
                    id="file-upload"
                    @change="handleFileUpload"
                    accept=".txt,.md,.doc,.docx"
                  />
                  <label for="file-upload" class="file-upload-label">
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
                      <path
                        d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                      ></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <span v-if="!uploadedFile">选择文件</span>
                    <span v-else>{{ uploadedFile.name }}</span>
                  </label>
                </div>

                <div v-if="uploadedFile" class="file-info">
                  <p><strong>文件名:</strong> {{ uploadedFile.name }}</p>
                  <p>
                    <strong>大小:</strong>
                    {{ formatFileSize(uploadedFile.size) }}
                  </p>
                  <p>
                    <strong>类型:</strong> {{ uploadedFile.type || "未知" }}
                  </p>
                </div>

                <div class="form-group" v-if="uploadedFile">
                  <label class="form-label" for="file-chapter-title"
                    >章节标题</label
                  >
                  <input
                    type="text"
                    id="file-chapter-title"
                    class="form-control"
                    v-model="chapterTitle"
                    placeholder="请输入章节标题"
                  />
                </div>
              </div>

              <!-- HTML导入选项卡 -->
              <div v-if="activeTab === 'html'" class="html-import">
                <div class="form-group">
                  <label class="form-label" for="html-chapter-title"
                    >章节标题</label
                  >
                  <input
                    type="text"
                    id="html-chapter-title"
                    class="form-control"
                    v-model="chapterTitle"
                    placeholder="请输入章节标题"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label" for="html-content">HTML内容</label>
                  <textarea
                    id="html-content"
                    class="form-control"
                    v-model="htmlContent"
                    placeholder="请粘贴HTML内容"
                    rows="10"
                  ></textarea>
                </div>

                <div class="form-group">
                  <label class="form-label">选择段落标签</label>
                  <select
                    class="form-control form-select"
                    v-model="paragraphSelector"
                  >
                    <option value="p">段落标签 (p)</option>
                    <option value="div">DIV标签 (div)</option>
                    <option value=".paragraph">段落类 (.paragraph)</option>
                    <option value="custom">自定义选择器</option>
                  </select>

                  <input
                    v-if="paragraphSelector === 'custom'"
                    type="text"
                    class="form-control custom-selector"
                    v-model="customSelector"
                    placeholder="输入自定义CSS选择器"
                  />
                </div>
              </div>
            </div>

            <div class="preview-section" v-if="previewParagraphs.length > 0">
              <h4>导入预览</h4>
              <div class="preview-container">
                <div
                  v-for="(para, index) in previewParagraphs.slice(0, 3)"
                  :key="index"
                  class="preview-paragraph"
                >
                  <span class="preview-number">{{ index + 1 }}.</span>
                  <div v-html="para"></div>
                </div>
                <div v-if="previewParagraphs.length > 3" class="preview-more">
                  ...及更多 {{ previewParagraphs.length - 3 }} 个段落
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button
              class="btn btn-outline"
              @click="generatePreview"
              :disabled="!canPreview"
            >
              预览
            </button>
            <button
              class="btn btn-primary"
              @click="importChapter"
              :disabled="!canImport"
            >
              导入
            </button>
            <button class="btn btn-text" @click="showModal = false">
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
  name: "ChapterImport",
  emits: ["chapter-imported"],
  data() {
    return {
      showModal: false,
      activeTab: "text",
      chapterTitle: "",
      chapterContent: "",
      htmlContent: "",
      uploadedFile: null,
      splitMode: "emptyLine",
      paragraphSelector: "p",
      customSelector: "",
      previewParagraphs: [],
    };
  },
  computed: {
    canPreview() {
      if (this.activeTab === "text") {
        return (
          this.chapterTitle.trim() !== "" && this.chapterContent.trim() !== ""
        );
      } else if (this.activeTab === "file") {
        return this.uploadedFile && this.chapterTitle.trim() !== "";
      } else if (this.activeTab === "html") {
        return (
          this.chapterTitle.trim() !== "" && this.htmlContent.trim() !== ""
        );
      }
      return false;
    },
    canImport() {
      return (
        this.previewParagraphs.length > 0 && this.chapterTitle.trim() !== ""
      );
    },
    effectiveSelector() {
      return this.paragraphSelector === "custom"
        ? this.customSelector
        : this.paragraphSelector;
    },
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.uploadedFile = file;

      // 如果没有设置章节标题，使用文件名作为默认标题
      if (!this.chapterTitle) {
        // 移除文件扩展名
        this.chapterTitle = file.name.replace(/\.[^/.]+$/, "");
      }

      // 读取文件内容
      const reader = new FileReader();
      reader.onload = (e) => {
        this.chapterContent = e.target.result;
        this.generatePreview();
      };
      reader.readAsText(file);
    },

    formatFileSize(bytes) {
      if (bytes < 1024) {
        return bytes + " bytes";
      } else if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(1) + " KB";
      } else {
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
      }
    },

    generatePreview() {
      try {
        if (this.activeTab === "text" || this.activeTab === "file") {
          this.processTextContent();
        } else if (this.activeTab === "html") {
          this.processHtmlContent();
        }
      } catch (error) {
        console.error("预览生成失败:", error);
        alert("预览生成失败，请检查输入内容格式。");
      }
    },

    processTextContent() {
      let paragraphs = [];
      const content = this.chapterContent.trim();

      if (this.splitMode === "emptyLine") {
        // 使用空行分割段落
        paragraphs = content
          .split(/\n\s*\n/)
          .map((p) => p.trim())
          .filter((p) => p);
      } else if (this.splitMode === "indentation") {
        // 使用缩进分割段落
        const lines = content.split("\n");
        let currentParagraph = "";

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine) continue;

          if (line.startsWith(" ") || line.startsWith("\t")) {
            // 如果行以空格或制表符开始，附加到当前段落
            currentParagraph += " " + trimmedLine;
          } else {
            // 否则，开始新段落
            if (currentParagraph) {
              paragraphs.push(currentParagraph);
            }
            currentParagraph = trimmedLine;
          }
        }

        // 添加最后一个段落
        if (currentParagraph) {
          paragraphs.push(currentParagraph);
        }
      }

      // 将纯文本转换为HTML格式
      this.previewParagraphs = paragraphs.map((p) => {
        // 替换换行符为<br>
        return p.replace(/\n/g, "<br>");
      });
    },

    processHtmlContent() {
      // 使用DOMParser解析HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(this.htmlContent, "text/html");

      // 使用选择器获取段落元素
      const selector = this.effectiveSelector;
      const paragraphElements = doc.querySelectorAll(selector);

      // 将HTML元素的内容提取为HTML字符串
      this.previewParagraphs = Array.from(paragraphElements)
        .map((element) => {
          return element.innerHTML.trim();
        })
        .filter((p) => p);
    },

    importChapter() {
      if (!this.canImport) return;

      // 准备章节数据
      const paragraphs = this.previewParagraphs.map((content, index) => {
        return {
          id: `para-${index + 1}`,
          number: `${index + 1}.`,
          content: content,
        };
      });

      // 创建章节对象
      const chapter = {
        id: "chapter-" + Date.now(),
        title: this.chapterTitle,
        paragraphs: paragraphs,
        comments: [], // 初始没有评论
        overallComment: "", // 初始没有总体评价
        createdAt: new Date().toISOString(),
      };

      // 发出章节导入事件
      this.$emit("chapter-imported", chapter);

      // 重置表单和关闭模态框
      this.resetForm();
      this.showModal = false;
    },

    resetForm() {
      this.chapterTitle = "";
      this.chapterContent = "";
      this.htmlContent = "";
      this.uploadedFile = null;
      this.previewParagraphs = [];
      this.splitMode = "emptyLine";
      this.paragraphSelector = "p";
      this.customSelector = "";
    },
  },
};
</script>

<style scoped>
.chapter-import {
  position: relative;
}

.import-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-weight: 500;
}

.button-icon {
  margin-right: var(--spacing-xs);
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
  max-width: 800px;
  max-height: 90vh;
  z-index: 1001;
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
  overflow-y: auto;
  flex: 1;
}

.tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: var(--spacing-lg);
}

.tab-button {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-secondary);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast) ease;
}

.tab-button.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.tab-button:hover:not(.active) {
  color: var(--text-primary);
}

.tab-content {
  margin-bottom: var(--spacing-lg);
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.radio-group {
  display: flex;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-xs);
}

.radio-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  cursor: pointer;
}

.radio-text {
  color: var(--text-secondary);
}

.file-upload {
  margin-bottom: var(--spacing-md);
}

.file-upload input[type="file"] {
  display: none;
}

.file-upload-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background-color: var(--surface-variant);
  border: 1px dashed var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--text-secondary);
  transition: all var(--transition-fast) ease;
  text-align: center;
}

.file-upload-label:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.file-info {
  padding: var(--spacing-md);
  background-color: var(--surface-variant);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-md);
}

.file-info p {
  margin: var(--spacing-xs) 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.custom-selector {
  margin-top: var(--spacing-sm);
}

.preview-section {
  margin-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
  padding-top: var(--spacing-md);
}

.preview-section h4 {
  margin-bottom: var(--spacing-md);
  font-size: 1rem;
  color: var(--text-primary);
}

.preview-container {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--surface-variant);
  padding: var(--spacing-md);
}

.preview-paragraph {
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
}

.preview-paragraph:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.preview-number {
  display: inline-block;
  padding: 2px var(--spacing-sm);
  background-color: var(--primary-color);
  color: var(--text-on-primary);
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: var(--radius-sm);
  margin-right: var(--spacing-sm);
}

.preview-more {
  text-align: center;
  padding: var(--spacing-md) 0 0;
  font-style: italic;
  color: var(--text-muted);
}

.modal-footer {
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
}

@media (max-width: 768px) {
  .tabs {
    overflow-x: auto;
    white-space: nowrap;
  }

  .tab-button {
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .radio-group {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .modal-footer {
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }

  .modal-footer .btn {
    flex: 1;
    min-width: 80px;
  }
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
</style>
