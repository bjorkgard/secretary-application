<script setup lang="ts">
import type {HTMLAttributes} from 'vue';
import {useSlots, provide} from 'vue';

export type ProvideBeradcrumb = {
  light?: boolean;
};

interface BreadcrumbProps extends HTMLAttributes {
  light?: boolean;
}

const slots = useSlots();

// eslint-disable-next-line vue/no-setup-props-destructure
const {light} = defineProps<BreadcrumbProps>();

provide<ProvideBeradcrumb>('breadcrumb', {
  light: light,
});
</script>

<template>
  <nav
    class="flex"
    aria-label="breadcrumb"
  >
    <ol :class="['flex items-center text-primary dark:text-slate-300', {'text-white/90': light}]">
      <component
        :is="item"
        v-for="(item, key) in slots.default && slots.default()"
        :key="key"
        :index="key"
      />
    </ol>
  </nav>
</template>
