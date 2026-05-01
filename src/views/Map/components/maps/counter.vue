<template>
  <a-tag size="large" class="min-w-[65px] text-[#2E4F93] text-lg rating_tag">
    {{ formattedCount }}
  </a-tag>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import anime from "animejs";

const props = defineProps({
  start: {
    type: Number,
    default: 0,
  },
  end: {
    type: [Number, String],
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
