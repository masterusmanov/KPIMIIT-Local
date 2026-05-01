<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { RightOutlined } from "@ant-design/icons-vue";
import http from "@/libs/axios";
import { useKpiStore } from "@/stores/kpiStore"
import type { StatData } from "@/stores/kpiStore"

// Type definitions
interface KpiRankItem {
  id: string | number;
  place: number;
  title: string;
  share_percent: number;
  difference_share_percent: number;
  previous_month_share_percent: number;
  value?: number;
  difference?: number;
  rank?: number;
}

interface ApiResponse {
  data: {
    data: any[];
  };
}

type ArrowDirection = 'up' | 'down' | 'neutral';

// State
const locale = ref<string>('uz');
const showingMore = ref<boolean>(false);
const maxVisibleItems: number = 14;
const router = useRouter();
const route = useRoute();
const activeRank = ref<number>(1);
const currentYear: number = new Date().getFullYear();
const kpiRanks = ref<KpiRankItem[]>([]);
const store = useKpiStore();

const defaultMonth = computed<number>(() => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-based (0 = January)
  const day = today.getDate();

  // If it's the 1st to 5th of the month, return previous month
  if (day <= 5) {
    return month === 0 ? 12 : month; // Return 12 if January
  } else {
    return month + 1; // Return 1-based month
  }
});

const selectedMonth = ref<number>(
  route.query && route.query.month
    ? Number(route.query.month as string)
    : defaultMonth.value
);

const selectedYear = ref<number>(
  route.query && route.query.year
    ? Number(route.query.year as string)
    : currentYear
);

// API Methods
const fetchKpiRanks = async (): Promise<void> => {
  try {
    const params = {
      rank_id: Number(activeRank.value),
      year: selectedYear.value,
      month: selectedMonth.value,
    };
    
    const response: ApiResponse = await http.get("/statistics/kpi-ranks", {
      params,
    });
    
    console.log('Rank++++', response.data);
    
    // API'dan kelgan qiymatlarni to'g'rilash - type safe mapping
    kpiRanks.value = response.data.data.map((item: any): KpiRankItem => ({
      id: item.id,
      place: Number(item.place),
      title: String(item.title || ''),
      share_percent: Number(item.share_percent || 0),
      difference_share_percent: Number(item.difference_share_percent || 0),
      previous_month_share_percent: Number(item.previous_month_share_percent || 0),
      value: Number(item.share_percent), // UI uchun
      difference: Number(item.difference_share_percent), // o'zgarish
      rank: Number(item.place), // backendda `place`, lekin UI `rank` ishlatyapti
    }));
  } catch (error) {
    console.error("KPI rank ma'lumotlarini olishda xatolik:", error);
    kpiRanks.value = [];
  }
};

// Computed properties
const visibleKpiRanks = computed<KpiRankItem[]>(() => {
  if (kpiRanks.value.length <= maxVisibleItems) {
    return kpiRanks.value;
  }

  if (showingMore.value) {
    return kpiRanks.value.slice(maxVisibleItems);
  } else {
    return kpiRanks.value.slice(0, maxVisibleItems);
  }
});

const shouldShowMoreButton = computed<boolean>(() => {
  return kpiRanks.value.length > maxVisibleItems;
});

// Methods
const toggleShowMore = (): void => {
  showingMore.value = !showingMore.value;
};

// Function to interpolate between two colors - with proper types
const interpolateColor = (color1: string, color2: string, factor: number): string => {
  const hex1 = color1.replace("#", "");
  const hex2 = color2.replace("#", "");

  const r1 = parseInt(hex1.substr(0, 2), 16);
  const g1 = parseInt(hex1.substr(2, 2), 16);
  const b1 = parseInt(hex1.substr(4, 2), 16);

  const r2 = parseInt(hex2.substr(0, 2), 16);
  const g2 = parseInt(hex2.substr(2, 2), 16);
  const b2 = parseInt(hex2.substr(4, 2), 16);

  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));

  return `rgb(${r}, ${g}, ${b})`;
};

// Get gradient color based on position - with proper types
const getGradientColor = (index: number, total: number): string => {
  const startColor = "#00C564"; // Green
  const endColor = "#F94449"; // Red
  const factor = total > 1 ? index / (total - 1) : 0;
  return interpolateColor(startColor, endColor, factor);
};

// Difference ga qarab rang olish - with proper types
const getDifferenceColor = (difference: number): string => {
  if (difference > 0) {
    return '#22C55E'; // Yashil rang (ko'tarilgan)
  } else if (difference < 0) {
    return '#EF4444'; // Qizil rang (tushgan)
  } else {
    return '#6B7280'; // Kulrang (o'zgarish yo'q)
  }
};

// Difference ga qarab strelka yo'nalishi - with proper types
const getDifferenceArrow = (difference: number): ArrowDirection => {
  if (difference > 0) {
    return 'up'; // Yuqoriga
  } else if (difference < 0) {
    return 'down'; // Pastga
  } else {
    return 'neutral'; // Neytral
  }
};

// TO'G'RI YECHIM: Type conversion function qo'shish
const convertToStatData = (item: KpiRankItem): StatData => {
  return {
    id: typeof item.id === 'string' ? parseInt(item.id) : item.id, // string'dan number'ga
    place: item.place,
    title: item.title,
    share_percent: item.share_percent.toString(), // number'dan string'ga
    difference_share_percent: item.difference_share_percent.toString(),
    previous_month_share_percent: item.previous_month_share_percent.toString(),
    // StatData interface'da boshqa required fieldlar bo'lsa qo'shing
  };
};

// User selection method - TO'G'RILANGAN
const selectUser = (item: KpiRankItem): void => {  
  const statData = convertToStatData(item);
  store.setKpi(statData);
};

// Lifecycle
onMounted((): void => {
  fetchKpiRanks();
});
</script>

<template>
  <div class="relative w-full">
    <!-- Statistics Grid -->
    <div class="grid grid-cols-7 gap-2 px-4">
      <template v-for="(item, index) in visibleKpiRanks" :key="item.id">
        <div
          class="relative w-full h-[50px] flex items-center gap-2 cursor-pointer group bg-gray-100 rounded-[8px] hover:bg-gray-200"
          :style="{
            color: getGradientColor(
              showingMore ? index + maxVisibleItems : index,
              kpiRanks.length
            ),
          }"
          @click="selectUser(item)"
          :title="`${item.title}`"
        >
          <!-- Rank number and percentage box -->
          <div
            class="relative z-10 w-6 xl:w-10 h-full border border-current rounded-md xl:rounded-lg overflow-hidden shadow-sm "
          >
            <!-- Rank number (top half) -->
            <div class="w-[full] h-1/2 flex items-center justify-center bg-white">
              <span class="text-[12px] xl:text-sm font-bold">{{ item.place }}</span>
            </div>
            
            <!-- Percentage (bottom half) -->
            <div class="w-full h-1/2 flex items-center justify-center text-white text-[8px] xl:text-xs font-medium"
                 :style="{ 
                   backgroundColor: getGradientColor(
                     showingMore ? index + maxVisibleItems : index,
                     kpiRanks.length
                   )
                 }">
              {{ item.share_percent.toFixed(1) }}%
            </div>
          </div>

          <!-- Content area -->
          <div class="relative z-10 flex-1 h-full flex flex-col justify-between py-1">
            <!-- Title -->
            <div class="text-[8px] xl:text-[9px] 2xl:text-[11px] z-0 font-medium text-blue-800 leading-tight line-clamp-2" >
              {{ item.title.length > 50 ? item.title.slice(0, 50) + '...' : item.title }}
            </div>
             <!-- <div class="absolute left-0 top-5 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200  bg-red-500 border border-gray-300 shadow-xl rounded-lg p-1 px-2 w-46 text-[8px] 2xl:text-[10px] xl:text-[10px] font-medium text-blue-800 leading-normal z-[9999]">
                {{ item.title }}
              </div>
             -->
            <!-- Statistics -->
            <div class="xl:flex items-center gap-2 text-[8px] xl:text-[10px] 2xl:text-xs">
              <!-- Growth indicator -->
              <span class="flex items-center gap-1" :style="{ color: getDifferenceColor(item.difference_share_percent) }">
                <!-- Up arrow -->
                <svg
                  v-if="getDifferenceArrow(item.difference_share_percent) === 'up'"
                  class="w-2 h-2"
                  viewBox="0 0 10 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 5.0578L5 0.0578003L10 5.0578H0Z"
                    fill="currentColor"
                  />
                </svg>
                
                <!-- Down arrow -->
                <svg
                  v-if="getDifferenceArrow(item.difference_share_percent) === 'down'"
                  class="w-2 h-2"
                  viewBox="0 0 10 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style="transform: rotate(180deg);"
                >
                  <path
                    d="M0 5.0578L5 0.0578003L10 5.0578H0Z"
                    fill="currentColor"
                  />
                </svg>
                
                <!-- Neutral indicator -->
                <div
                  v-if="getDifferenceArrow(item.difference_share_percent) === 'neutral'"
                  class="w-2 h-2 rounded-full"
                  style="background-color: currentColor;"
                ></div>
                
                {{ Math.abs(item.difference_share_percent).toFixed(1) }}%
              </span>
              
              <!-- Previous value -->
              <span class="text-blue-500 ml-[11px] xl:ml-0">{{ item.previous_month_share_percent.toFixed(1) }}%</span>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Navigation arrows (right side) -->
    <div
      v-if="shouldShowMoreButton"
      class="absolute top-12 right-2 transform translate-x-1/2 -translate-y-1/2 z-50"
    >
      <div
        class="w-6 h-6 xl:w-8 xl:h-8 bg-white rounded-[8px] shadow-lg border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        @click="toggleShowMore"
      >
        <RightOutlined
          class="text-gray-600 text-sm transition-transform duration-200"
          :style="{
            transform: showingMore ? 'rotate(180deg)' : 'none',
          }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>