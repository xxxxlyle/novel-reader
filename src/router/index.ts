import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import BookshelfView from "@/views/BookshelfView.vue";
import BookView from "@/views/BookView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "bookshelf",
    component: BookshelfView,
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

export default router;
