<script lang="ts" setup>
import type { RouteLocationRaw } from "vue-router";

const props = defineProps<{
  home: string;
  items: { label: string; link?: string | RouteLocationRaw }[];
}>();

const router = useRouter();
const route = useRoute();
const store = useStore();

const shouldShowBackButton = computed(() => {
  const user = store.user;
  const currentPath = route.path;
  
  // 1. Always show for non-WORKER/non-ADMIN roles
  if (user?.role !== 'WORKER' && user?.role !== 'ADMIN') {
    return true;
  }
  
  // 2. Show for district-level patterns
  const districtLevelPatterns = [
    /^\/info\/district\/\d+\/\d+/, 
    /^\/execution\/district\/\d+\/\d+/,
    /^\/efficiency\/district\/\d+\/\d+/
  ];
  
  // 3. Show for execution detail pages with ID (like /execution/18277)
  const executionDetailPattern = /^\/execution\/\d+$/;
  
  // 4. Show when there are query params (your specific case)
  const hasRelevantQueryParams = 
    route.query.region && 
    route.query.district && 
    route.query.region_id && 
    route.query.district_id;
  
  return (
    districtLevelPatterns.some(pattern => pattern.test(currentPath)) ||
    executionDetailPattern.test(currentPath) ||
    hasRelevantQueryParams
  );
});

</script>

<template>
  <div class="w-full flex items-center justify-between gap-3">
    <div class="flex items-center gap-2">
      <router-link v-if="store.user?.role !== 'WORKER' && store.user?.role !== 'ADMIN'"
        class="flex items-center text-gray-400 transition hover:text-primary"
        :to="{
          path: props.home,
          query: {
            month: route.query.month,
            year: route.query.year,
          },
        }"
      >
        <svg
          class="size-4"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
          <path
            d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
          />
        </svg>

        <span class="ml-2 text-sm font-medium">/</span>
      </router-link>

      <a-breadcrumb class="text-sm font-medium" v-if="store.user?.role !== 'WORKER' && store.user?.role !== 'ADMIN'">
        <a-breadcrumb-item v-for="(item, index) in items" :key="index">
          <template v-if="item.link">
            <router-link :to="item.link">
              {{ item.label }}
            </router-link>
          </template>
          <template v-else>
            {{ item.label }}
          </template>
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>

    <div  v-if="shouldShowBackButton"
      class="py-1 px-2 flex items-center justify-center gap-1.5 bg-slate-100 cursor-pointer transition hover:bg-primary hover:text-white"
      @click="router.back()"
    >
      <svg
        class="w-4"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_5467_10062)">
          <path
            d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
            fill="currentColor"
          />
        </g>
        <defs>
          <clipPath id="clip0_5467_10062">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>

      <span class="text-xs font-medium">Ortga qaytish</span>
    </div>
  </div>
</template>
