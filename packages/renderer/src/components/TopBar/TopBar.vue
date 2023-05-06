<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import Breadcrumb from '/@/base-components/Breadcrumb';
import type {FormattedMenu} from '/@/layouts/side-menu';
import {buildBreadCrumbs} from '/@/layouts/side-menu';

interface TopBarProps {
  formattedMenu: Array<FormattedMenu | 'divider'>;
}
const props = defineProps<TopBarProps>();
let breadCrumbs = ref<FormattedMenu[]>([]);

onMounted(() => {
  watch(props, () => {
    breadCrumbs.value = buildBreadCrumbs(props.formattedMenu);
  });
});
</script>

<template>
  <!-- BEGIN: Top Bar -->
  <div class="h-12 z-[51] flex items-center relative border-b border-slate-200">
    <!-- BEGIN: Breadcrumb -->
    <Breadcrumb class="hidden mr-auto -intro-x sm:flex">
      <Breadcrumb.Link to="/">Secretary</Breadcrumb.Link>
      <Breadcrumb.Link
        v-for="(item, index) in breadCrumbs"
        :key="index"
        :index="index + 1"
      >
        {{ item.title }}
      </Breadcrumb.Link>
    </Breadcrumb>
    <!-- END: Breadcrumb -->
  </div>
</template>
