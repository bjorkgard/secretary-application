<script setup lang="ts">
import {withDefaults, ref, onMounted, inject} from 'vue';
import type {PopperElement, Props} from 'tippy.js';
import tippy, {roundArrow, animateFill as animateFillPlugin} from 'tippy.js';

export type ProvideTippy = (el: PopperElement) => void;

interface TippyProps {
  refKey: string;
  content: string;
  as?: string | object;
  options: Partial<Props>;
}

const props = withDefaults(defineProps<TippyProps>(), {
  as: 'span',
});

const tippyRef = ref<PopperElement>();

const init = (el: PopperElement, props: TippyProps) => {
  tippy(el, {
    plugins: [animateFillPlugin],
    content: props.content,
    arrow: roundArrow,
    popperOptions: {
      modifiers: [
        {
          name: 'preventOverflow',
          options: {
            rootBoundary: 'viewport',
          },
        },
      ],
    },
    animateFill: false,
    animation: 'shift-away',
    ...props.options,
  });
};

const bindInstance = (el: PopperElement) => {
  if (props.refKey) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const bind = inject<ProvideTippy>(`bind[${props.refKey}]`, () => {});
    if (bind) {
      bind(el);
    }
  }
};

const vTippyDirective = {
  mounted(el: PopperElement) {
    tippyRef.value = el;
  },
};

onMounted(() => {
  if (tippyRef.value) {
    init(tippyRef.value, props);
    bindInstance(tippyRef.value);
  }
});
</script>

<template>
  <component
    :is="as"
    v-tippy-directive
    class="cursor-pointer"
  >
    <slot></slot>
  </component>
</template>
