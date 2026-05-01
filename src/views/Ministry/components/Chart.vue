<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useKpiStore } from '@/stores/kpiStore'
import { storeToRefs } from 'pinia'

const store = useKpiStore()
const { selectedKpi } = storeToRefs(store) // reactive access
console.log(selectedKpi);


interface ChartData {
  month: string;
  value: number;
  color: 'green' | 'red';
}

const data = ref<ChartData[]>([
  { month: 'Yanvar', value: 13, color: 'green' },
  { month: 'Fevral', value: 5, color: 'green' },
  { month: 'Mart', value: 9, color: 'green' },
  { month: 'Aprel', value: 13, color: 'green' },
  { month: 'May', value: 10, color: 'green' },
  { month: 'Iyun', value: 13, color: 'red' },
  { month: 'Iyul', value: 13, color: 'green' },
  { month: 'Avgust', value: 0, color: 'red' },
  { month: 'Sentyabr', value: 0, color: 'green' },
  { month: 'Oktyabr', value: 0, color: 'green' },
  { month: 'Noyabr', value: 0, color: 'green' },
  { month: 'Dekabr', value: 0, color: 'green' }
]);

const maxValue = computed(() => Math.max(...data.value.map(item => item.value)));

const getBarHeight = (value: number): string => {
  // Responsive height calculation based on screen size
  if (typeof window !== 'undefined') {
    const width = window.innerWidth;
    let maxHeight;
    
    if (width < 640) {
      maxHeight = 200; // Mobile
    } else if (width < 1024) {
      maxHeight = 280; // Tablet
    } else if (width < 1280) {
      maxHeight = 200; // Desktop
    } else if (width < 1536) {
      maxHeight = 420; // Large desktop
    } else {
      maxHeight = 500; // Extra large
    }
    
    const height = (value / maxValue.value) * maxHeight;
    return `${height}px`;
  }
  
  // SSR fallback
  const height = (value / maxValue.value) * 300;
  return `${height}px`;
};

const getStripePattern = (color: 'green' | 'red'): string => {
  const bgColor = color === 'green' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.3)';
  return `repeating-linear-gradient(
    45deg,
    transparent,
    transparent 4px,
    ${bgColor} 4px,
    ${bgColor} 8px
  )`;
};
</script>

<template>
  <div class="xl:w-full 2xl:w-[80%] mx-auto bg-white px-2 sm:p-4 lg:p-6 lg:mt-[150px] xl:mt-0">
    <div v-if="selectedKpi" class="text-center font-[700] text-[14px] xl:text-[16px]">
      <p>{{ selectedKpi.title }}</p>
    </div>
    <!-- Chart container with border and grid -->
    <div class="relative  p-2 sm:p-3 lg:p-4">
      <!-- Chart area with responsive height -->
      <div class="relative h-64 sm:h-80 lg:h-96 xl:h-[430px] 2xl:h-[600px]">
        <!-- Horizontal grid lines -->
        <div class="absolute inset-0 pointer-events-none">
          <!-- 100% line -->
          <div class="absolute top-0 left-0 right-0 border-t border-gray-300"></div>
          <!-- 75% line -->
          <div class="absolute left-0 right-0 border-t border-gray-200" style="top: 25%"></div>
          <!-- 50% line -->
          <div class="absolute left-0 right-0 border-t border-gray-200" style="top: 50%"></div>
          <!-- 25% line -->
          <div class="absolute left-0 right-0 border-t border-gray-200" style="top: 75%"></div>
          <!-- 0% line (at bottom of chart area) -->
          <div class="absolute left-0 right-0 border-t border-gray-300 bottom-8 sm:bottom-10"></div>
        </div>

        <!-- Percentage labels on the left -->
        <div class="absolute left-0 top-0 flex flex-col justify-between text-xs text-gray-500 -ml-6 sm:-ml-7 lg:-ml-8 h-[calc(100%-2rem)] sm:h-[calc(100%-2.5rem)]">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>

        <!-- Chart bars area -->
        <div class="absolute inset-0 bottom-8 sm:bottom-10">
          <div class="flex items-end justify-center space-x-1 sm:space-x-2 lg:space-x-4 2xl:space-x-8 h-full relative z-10">
            <div 
              v-for="(item, index) in data" 
              :key="index" 
              class="flex flex-col items-center h-full justify-end"
            >
              <!-- Value label on top -->
              <div class="text-green-500 font-medium text-xs sm:text-sm mb-1 sm:mb-2">
                {{ item.value }}
              </div>
              
              <!-- Bar -->
              <div 
                :class="[
                  'w-6 sm:w-8 lg:w-8 xl:w-12 relative rounded-t-sm',
                  item.color === 'green' ? 'bg-green-400' : 'bg-red-400'
                ]"
                :style="{ height: getBarHeight(item.value) }"
              >
                <!-- Diagonal stripes pattern -->
                <div 
                  class="absolute inset-0 rounded-t-sm"
                  :style="{ backgroundImage: getStripePattern(item.color) }"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Month labels at bottom -->
        <div class="absolute bottom-0 left-0 right-0 h-8 sm:h-10 flex items-center justify-center space-x-1 sm:space-x-2 lg:space-x-4 2xl:space-x-8">
          <div 
            v-for="(item, index) in data" 
            :key="index" 
            class="flex justify-center w-6 sm:w-8 lg:w-10 xl:w-12"
          >
            <div class="text-gray-600 text-xs sm:text-sm font-medium text-center">
              <span class="block sm:hidden">{{ item.month.slice(0, 3) }}</span>
              <span class="hidden sm:block lg:hidden">{{ item.month.slice(0, 4) }}</span>
              <span class="hidden lg:block">{{ item.month }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional custom styles if needed */
</style>