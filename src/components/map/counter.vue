<script lang="ts" setup>
import anime from "animejs";

const props = defineProps({
  start: {
    type: Number,
    default: 0,
  },
  end: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    default: 2000,
  },
  decimals: {
    type: Number,
    default: 2,
  },
});

const count = ref(props.start);

const formattedCount = computed(() =>
  Number(count.value).toFixed(props.decimals)
);

// Start animation on mount
onMounted(() => {
  anime({
    targets: count,
    value: [props.start, Number(props.end)],
    easing: "easeOutQuad",
    duration: props.duration,
    update: () => {
      count.value = count.value;
    },
  });
});
</script>

<template>
  <a-tag size="large" class="min-w-[43px] text-[#2E4F93] text-lg rating_tag">
    {{ formattedCount }}
  </a-tag>
</template>
