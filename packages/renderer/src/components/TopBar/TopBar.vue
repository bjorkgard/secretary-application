<script setup lang="ts">
import Breadcrumb from '/@/base-components/Breadcrumb';
</script>

<template>
  <!-- BEGIN: Top Bar -->
  <div class="h-[67px] z-[51] flex items-center relative border-b border-slate-200">
    <!-- BEGIN: Breadcrumb -->
    <Breadcrumb class="hidden mr-auto -intro-x sm:flex">
      <Breadcrumb.Link to="/">Secretary</Breadcrumb.Link>
      <Breadcrumb.Link
        to="/"
        :active="true"
      >
        Dashboard
      </Breadcrumb.Link>
    </Breadcrumb>
    <!-- END: Breadcrumb -->
  </div>
</template>
