import {createRouter, createWebHistory} from 'vue-router';
import SideMenu from '/@/layouts/SideMenu.vue';
import DashboardOverview from '/@/pages/DashboardOverview.vue';
import PublishersForm from '/@/pages/PublishersForm.vue';
import PublishersList from '/@/pages/PublishersList.vue';

const routes = [
  {
    path: '/',
    component: SideMenu,
    children: [
      {path: '/', name: 'dashboard', component: DashboardOverview},
      {
        path: 'publishers-add',
        name: 'publishers-add',
        component: PublishersForm,
      },
      {
        path: 'publishers-list',
        name: 'publishers-list',
        component: PublishersList,
      },
    ],
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
