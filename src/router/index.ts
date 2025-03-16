import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import BookshelfView from "@/views/BookshelfView.vue";
import BookView from "@/views/BookView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "bookshelf",
    component: BookshelfView,
    meta: {
      title: "NovelReader - 首页",
    },
  },
  {
    path: "/book/:id",
    name: "book",
    component: BookView,
    props: true,
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 路由前置守卫修改标题
router.beforeEach((to, _from, next) => {
  document.title = (to.meta.title as string) || "NovelReader";
  next();
});

export default router;
