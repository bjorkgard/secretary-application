<script setup lang="ts">
import {onMounted} from 'vue';

onMounted(() => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.getElementsByTagName('body')[0].classList.add('dark');
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ({matches}) => {
    if (matches) {
      document.getElementsByTagName('body')[0].classList.add('dark');
    } else {
      document.getElementsByTagName('body')[0].classList.remove('dark');
    }
  });
});
</script>

<template>
  <RouterView />
</template>
