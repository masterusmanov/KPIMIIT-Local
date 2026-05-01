<script lang="ts" setup>
const props = defineProps<{
  class?: string;
  rating: any;
  place: any;
  active?: boolean;
}>();
</script>

<template>
  <div class="absolute" :class="props.class">
    <!-- <div class="min-w-[85px] bg-white rounded-md shadow-md">
      <div class="flex items-center">
        <span
          class="p-1 text-[10px] font-bold border-r transition"
          :class="[props.active ? 'text-black' : 'text-cGreen']"
        >
          {{ place || 0 }}
        </span>
        <span class="p-1 text-[8px] text-cDarkBlue font-semibold">O‘rin</span>
      </div>
      <div class="flex items-center border-t">
        <span
          class="p-1 text-[10px] font-bold border-r transition"
          :class="[props.active ? 'text-black' : 'text-cGreen']"
        >
          {{ rating || 0 }}%
        </span>
        <span class="p-1 text-[8px] text-cDarkBlue font-semibold">KPI</span>
      </div>
    </div> -->
    <slot />
  </div>
</template>
