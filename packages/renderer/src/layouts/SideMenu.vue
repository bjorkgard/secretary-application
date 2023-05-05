<script lang="ts" setup>
import {useRoute} from 'vue-router';
import {watch, reactive, computed, onMounted} from 'vue';
import {useSideMenuStore} from '/@/stores/side-menu';
import type {FormattedMenu} from './side-menu';
import {nestedMenu, enter, leave} from './side-menu';
import TopBar from '/@/components/TopBar';
import Divider from './DividerComponent.vue';
import Menu from './MenuComponent.vue';

const route = useRoute();
const sideMenuStore = useSideMenuStore();
const sideMenu = computed(() => nestedMenu(sideMenuStore.menu, route));

let formattedMenu = reactive<Array<FormattedMenu | 'divider'>>([]);

const setFormattedMenu = (computedFormattedMenu: Array<FormattedMenu | 'divider'>) => {
  Object.assign(formattedMenu, computedFormattedMenu);
};

watch(sideMenu, () => {
  setFormattedMenu(sideMenu.value);
});

onMounted(() => {
  setFormattedMenu(sideMenu.value);
});
</script>

<template>
  <div class="pt-8 pb-2 min-h-full flex">
    <div class="flex mt-[4.7rem] md:mt-0 min-h-full grow">
      <!-- BEGIN: Side Menu -->
      <nav class="pr-5 pb-16 overflow-x-hidden hidden md:block w-[85px] xl:w-[230px]">
        <ul>
          <!-- BEGIN: First Child -->
          <template v-for="(menu, menuKey) in formattedMenu">
            <Divider
              v-if="menu == 'divider'"
              :key="'divider-' + menuKey"
              type="li"
              :class="[
                'my-6',

                // Animation
                `opacity-0 animate-[0.4s_ease-in-out_0.1s_intro-divider] animate-fill-mode-forwards animate-delay-${
                  (menuKey + 1) * 10
                }`,
              ]"
            ></Divider>
            <li
              v-else
              :key="menuKey"
            >
              <Menu
                :class="{
                  // Animation
                  [`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
                    (menuKey + 1) * 10
                  }`]: !menu.active,
                }"
                :menu="menu"
                :formatted-menu-state="[formattedMenu, setFormattedMenu]"
                level="first"
              ></Menu>
              <!-- BEGIN: Second Child -->
              <Transition
                @enter="() => enter"
                @leave="() => leave"
              >
                <ul
                  v-if="menu.subMenu && menu.activeDropdown"
                  class="rounded-lg bg-black/10 dark:bg-darkmode-900/30"
                >
                  <li
                    v-for="(subMenu, subMenuKey) in menu.subMenu"
                    :key="subMenuKey"
                  >
                    <Menu
                      :class="{
                        // Animation
                        [`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
                          (subMenuKey + 1) * 10
                        }`]: !subMenu.active,
                      }"
                      :menu="subMenu"
                      :formatted-menu-state="[formattedMenu, setFormattedMenu]"
                      level="second"
                    ></Menu>
                    <!-- BEGIN: Third Child -->
                    <Transition
                      v-if="subMenu.subMenu"
                      @enter="() => enter"
                      @leave="() => leave"
                    >
                      <ul
                        v-if="subMenu.subMenu && subMenu.activeDropdown"
                        class="rounded-lg bg-black/10 dark:bg-darkmode-900/30"
                      >
                        <li
                          v-for="(lastSubMenu, lastSubMenuKey) in subMenu.subMenu"
                          :key="lastSubMenuKey"
                        >
                          <Menu
                            :class="{
                              // Animation
                              [`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
                                (lastSubMenuKey + 1) * 10
                              }`]: !lastSubMenu.active,
                            }"
                            :menu="lastSubMenu"
                            :formatted-menu-state="[formattedMenu, setFormattedMenu]"
                            level="third"
                          ></Menu>
                        </li>
                      </ul>
                    </Transition>
                    <!-- END: Third Child -->
                  </li>
                </ul>
              </Transition>
              <!-- END: Second Child -->
            </li>
          </template>
        </ul>
      </nav>
      <!-- END: Side Menu -->
      <!-- BEGIN: Content -->
      <div
        class="no-drag rounded-[30px] min-w-0 flex-1 pb-10 bg-slate-100 dark:bg-darkmode-700 px-4 md:px-[22px] max-w-full md:max-w-auto before:content-[''] before:w-full before:h-px before:block"
      >
        <TopBar />
        <RouterView />
      </div>
      <!-- END: Content -->
    </div>
  </div>
</template>
