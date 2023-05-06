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
        icon: 'LayoutDashboard',
        pageName: 'dashboard',
        title: 'Dashboard',
      },
      'divider',
      {
        icon: 'Users',
        pageName: 'publishers',
        title: 'Förkunnare',
        subMenu: [
          {
            icon: 'Users',
            pageName: 'publishers-list',
            title: 'Visa alla',
          },
          {
            icon: 'UserPlus',
            pageName: 'publishers-add',
            title: 'Lägg till',
          },
        ],
      },
    ],
  }),
});
