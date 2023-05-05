import {defineStore} from 'pinia';
import type {Icon} from '/@/base-components/Lucide/LucideIcon.vue';

export interface Menu {
  icon: Icon;
  title: string;
  pageName?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}

export interface SideMenuState {
  menu: Array<Menu | 'divider'>;
}

export const useSideMenuStore = defineStore('sideMenu', {
  state: (): SideMenuState => ({
    menu: [
      {
        icon: 'Home',
        pageName: 'side-menu-dashboard',
        title: 'Dashboard',
        subMenu: [
          {
            icon: 'Activity',
            pageName: 'side-menu-dashboard-overview-1',
            title: 'Overview',
          },
        ],
      },
      'divider',
    ],
  }),
});
