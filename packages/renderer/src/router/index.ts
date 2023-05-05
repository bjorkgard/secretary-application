import {createRouter, createWebHistory} from 'vue-router';
import SideMenu from '/@/layouts/SideMenu.vue';
import DashboardOverview from '/@/pages/DashboardOverview.vue';

const routes = [
  {
    path: '/',
    component: SideMenu,
    children: [{path: '/', name: 'dashboard', component: DashboardOverview}],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || {left: 0, top: 0};
  },
});

export default router;
