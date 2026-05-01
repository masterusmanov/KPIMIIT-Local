<!-- navbartwo -->
<script lang="ts" setup>
import { ref, reactive, watch, onMounted, computed } from "vue";
import http from "@/libs/axios";
import { useStore } from "@/stores/index.store";
import { useDateStore } from "@/stores/date";


// ✅ TO'G'RI IMPORT - tm va rt funksiyalarini ham qo'shamiz
const { t, rt, tm } = useI18n();

type CategoryType = 'vazirlik' | 'viloyat'

interface RegionOption {
  value: string
  label: string
}

interface TumanOption {
  value: string
  label: string
}

interface WorkerKPI {
  id: string;
  full_name: string;
  region_title: string;
  position_title: string;
  kpi: string;
  index: number;
}

interface StageData {
  id: string;
  title: string;
  totals: number;
  quarters: QuarterData[];
}

interface QuarterData {
  number: number;
  totals: number;
  months: MonthData[];
}

interface MonthData {
  month: number;
  values: number;
}

interface UsersCount {
  total: number;
}

interface MapData {
  id: string;
  name: string;
  value: number;
}

const router = useRouter();
const route = useRoute();
const indexStore = useStore()
const dateStore = useDateStore();


const selectedCategory = computed({
  get() {
    return route.path.startsWith('/ministry') ? 'vazirlik' : 'viloyat';
  },
  set(value: CategoryType) {
    if (value === 'vazirlik') {
      router.push('/ministry');
    } else {
      router.push('/');
    }
  }
});

const selectedViloyat = ref<string | null>(null)
const selectedTuman = ref<string | null>(null)

const menus = reactive([
  {
    title: t("layout.main"),
    link: "/ministry",
    icon: '<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#prefix__clip0_5019_18243)"><path d="M10 2.5l-6.667 5v10H7.5v-5.833h5V17.5h4.167v-10L10 2.5z" fill="currentColor"/></g><defs><clipPath id="prefix__clip0_5019_18243"><path fill="currentColor" d="M0 0h20v20H0z"/></clipPath></defs></svg>',
  },
  {
    title: "Ma'lumotlar",
    link: "/ministry/info",
    icon: '<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#prefix__clip0_5019_18248)"><path d="M10 1.667A8.336 8.336 0 001.667 10c0 4.6 3.733 8.333 8.333 8.333S18.333 14.6 18.333 10 14.6 1.667 10 1.667zm.833 12.5H9.167v-5h1.666v5zm0-6.667H9.167V5.833h1.666V7.5z" fill="currentColor"/></g><defs><clipPath id="prefix__clip0_5019_18248"><path fill="#fff" d="M0 0h20v20H0z"/></clipPath></defs></svg>',
  },
  {
    title: "Tahlil va ijro",
    link: "/ministry/analize",
    icon: '<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#prefix__clip0_5019_18253)" fill="currentColor"><path d="M6.667 7.5H3.333v9.167h3.334V7.5zM16.667 10.833h-3.334v5.834h3.334v-5.834zM11.667 3.333H8.333v13.334h3.334V3.333z"/></g><defs><clipPath id="prefix__clip0_5019_18253"><path fill="#fff" d="M0 0h20v20H0z"/></clipPath></defs></svg>',
  },
  {
    title: "Samaradorlik",
    link: "/ministry/efficiency",
    icon: '<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#prefix__clip0_5020_18284)" fill="currentColor"><path d="M15 9.167c1.242 0 2.392.391 3.333 1.05v-3.55A1.66 1.66 0 0016.667 5h-3.334V3.333a1.66 1.66 0 00-1.666-1.666H8.333a1.66 1.66 0 00-1.666 1.666V5H3.333c-.925 0-1.658.742-1.658 1.667l-.008 9.166A1.66 1.66 0 003.333 17.5h6.4A5.83 5.83 0 0115 9.167zM8.333 3.333h3.334V5H8.333V3.333z"/><path d="M15 10.833A4.168 4.168 0 0010.834 15c0 2.3 1.866 4.167 4.166 4.167 2.3 0 4.167-1.867 4.167-4.167S17.3 10.833 15 10.833zm1.375 6.125l-1.791-1.791V12.5h.833v2.325l1.542 1.542-.584.591z"/></g><defs><clipPath id="prefix__clip0_5020_18284"><path fill="#fff" d="M0 0h20v20H0z"/></clipPath></defs></svg>',
  },
  {
    title: "Dinamika",
    link: "/ministry/analytics",
    icon: '<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#prefix__clip0_5019_18271)"><path d="M15.893 4.107a8.336 8.336 0 00-11.785 0 8.336 8.336 0 000 11.786 8.337 8.337 0 0011.785 0 8.337 8.337 0 000-11.786zm-5.304 6.482l-2.357 2.357-1.178-1.178L9.41 9.41 7.643 7.643h4.714v4.714l-1.768-1.768z" fill="currentColor"/></g><defs><clipPath id="prefix__clip0_5019_18271"><path fill="#fff" d="M0 0h20v20H0z"/></clipPath></defs></svg>',
  },
]);

const viloyatOptions = ref<RegionOption[]>([])
const tumanOptions = ref<TumanOption[]>([])
const tumanLoading = ref(false)

const fetchRegions = async () => {
  try {
    const response = await http.get("/region/list");
    console.log("viloyat olish API", response);
    
    viloyatOptions.value = response?.data?.data?.results.map((region: any) => ({
      value: region.code || region.id, 
      label: region.name || region.title 
    }));
  } catch (error) {
    console.error('Viloyatlarni olishda xatolik:', error);
  }
}

const fetchDistricts = async (regionId: string) => {
  try {
    tumanLoading.value = true;
    const response = await http.get(`/district/list`, {
      params: {
        limit: 10,
        page: 1,
        regions: regionId
      }
    });
    
    console.log("tuman olish API", response?.data?.data?.results);
    
    tumanOptions.value = response?.data?.data?.results?.map((district: any) => ({
      value: district.code || district.id,
      label: district.name || district.title
    })) || [];
    
  } catch (error) {
    console.error('Tumanlarni olishda xatolik:', error);
    tumanOptions.value = [];
  } finally {
    tumanLoading.value = false;
  }
}

onMounted(() => {
  fetchRegions();
})

watch(selectedCategory, (newValue: CategoryType) => {
  if (newValue === 'vazirlik') {
    selectedViloyat.value = null
    selectedTuman.value = null
    tumanOptions.value = []
  }
})

watch(selectedViloyat, (newValue: string | null) => {
  selectedTuman.value = null
  tumanOptions.value = []
  
  if (newValue) {
    fetchDistricts(newValue);
  }
})

const isActiveMenu = (menuLink: string) => {
  const currentPath = route.path;
  
  if (currentPath === menuLink) {
    return true;
  }
  
  if (menuLink !== '/ministry' && currentPath.startsWith(menuLink + '/')) {
    return true;
  }
  
  return false;
}

const handleViloyatChange = (value: string) => {
  console.log('Tanlangan viloyat:', value)
  selectedViloyat.value = value;
}

const handleTumanChange = (value: string) => {
  console.log('Tanlangan tuman:', value)
  selectedTuman.value = value;
}

const activeRank = ref("3");

const columns = ref([
  { title: "Xodim", dataIndex: "employee", key: "employee" },
  {
    title: "KPI",
    dataIndex: "kpi",
    field: "kpi",
    key: "kpi",
    sorter: true,
    align: "center",
    width: 120,
  },
]);

const data = ref<WorkerKPI[]>([]);
const table = reactive({
  total: 10,
  sort: "desc",
});

const stages = ref<StageData[]>([]);
const users_count = ref<UsersCount | null>(null);
const map = ref<MapData[]>([]);

const handleYearChange = (year: number) => {
  dateStore.setYear(year);
};

const handleMonthChange = (month: number) => {
  dateStore.setMonth(month);
};

// ✅ TO'G'RILANGAN: months computed property
const months = computed(() => {
  try {
    const translatedMonths = tm("date.months");
    if (translatedMonths && Array.isArray(translatedMonths)) {
      return translatedMonths;
    }
  } catch (error) {
    console.warn("tm funksiyasi ishlamadi, default qiymatlar ishlatilmoqda");
  }
  
  return [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
    "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr",
  ];
});
const currentMonth = new Date().getMonth() + 1; // 1-12 oralig'ida

const visibleMonths = computed(() => {
  return months.value.slice(0, currentMonth);
});

// const fetchData = async () => {
//   try {
//     const params = {
//       rank_id: indexStore.user?.rank_id || 1,
//       year: selectedYear.value,
//       month: selectedMonth.value,
//     };

//     const [stages_data, users_data] = await Promise.all([
//       http.get("/worker_indicator/statistics/plan_amount", { params }),
//       http.get("/user/statistics/count", { params }),
//       // http.get("/statistics/map", { params }),
//     ]);

//     stages.value = stages_data.data.data?.stages || [];
//     users_count.value = users_data.data.data || null;
//     // map.value = map_data.data.data || [];
//   } catch (e) {
//     console.error(e);
//   }
// };

// const fetchWorkersKPI = async () => {
//   try {
//     const res = await http.get("/worker/statistics/kpi", {
//       params: {
//         rank_id: indexStore.user?.rank_id || 1,
//         page: route.query?.page || 1,
//         limit: 10,
//         sort_kpi_percent: route.query?.order == "ascend" ? "asc" : "desc",
//         year: selectedYear.value,
//         month: selectedMonth.value,
//       },
//     });

//     data.value =
//       res.data.data?.results.map((item: any, idx: number) => {
//         const currentPage = Number(route.query.page) || 1;
//         return {
//           ...item,
//           index: (currentPage - 1) * 10 + idx + 1,
//         };
//       }) || [];
//     table.total = res.data.data?.count || 10;
//   } catch (e) {
//     console.error(e);
//   }
// };

watch(
  () => [activeRank.value, route.query],
  () => {
    // fetchData();
    // fetchWorkersKPI();
  },
  { immediate: true }
);

const isHomePage = computed(() => {
  return route.path === '/ministry'; 
});
</script>

<template>
  <div class="p-4 flex items-center justify-between">
    <div class="flex space-x-2">      
      <a-radio-group v-model:value="selectedCategory" class="flex">
        <a-radio-button value="vazirlik">Vazirlik</a-radio-button>
        <a-radio-button value="viloyat">Viloyat</a-radio-button>
      </a-radio-group>

      <div v-if="selectedCategory === 'viloyat'" class="flex space-x-2">
        <a-select
          v-model:value="selectedViloyat"
          placeholder="Viloyatni tanlang"
          style="width: 200px"
          :options="viloyatOptions"
          @change="handleViloyatChange"
          :loading="viloyatOptions.length === 0"
          allow-clear
        />

        <a-select
          v-if="selectedViloyat" 
          v-model:value="selectedTuman"
          placeholder="Tumanni tanlang"
          style="width: 200px"
          :options="tumanOptions"
          @change="handleTumanChange"
          :loading="tumanLoading"
          allow-clear
        />
      </div>
    </div>

    <nav class="flex items-center space-x-2">
        <a-select
        :value="dateStore.selectedYear"
        class="the-datepicker" 
        @change="handleYearChange"
      >
        <a-select-option v-for="year in dateStore.years" :key="year" :value="year">
          {{ year }}
        </a-select-option>
      </a-select>
       
      <a-select
        :value="dateStore.selectedMonth"
        style="min-width: 100px; width: auto"
        class="the-datepicker"
        :disabled="isHomePage"
        @change="handleMonthChange"
      >
        <a-select-option
          v-for="(month, index) in visibleMonths"
          :key="index"
          :value="index + 1"
        >
          {{ rt(month) }}
        </a-select-option>
      </a-select>
      
      <ul class="mb-0 flex items-center bg-[#F1F1F1]">
        <li
          v-for="menu in menus"
          :key="menu.link"
          class="text-sm duration-200 py-2 px-4"
          :class="{
            'active-link': isActiveMenu(menu.link)
          }"
        >
          <RouterLink
            class="font-normal flex w-max duration-200 text-[#2E4F93] items-center justify-center gap-2 hover:text-blue-500"
            :class="{ 'text-white': isActiveMenu(menu.link) }"
            :to="menu.link"
          >
            <i
              class="size-5 text-[#2E4F93] flex items-center justify-center "
              v-html="menu.icon"
            ></i>
            {{ menu.title }}
          </RouterLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style>
.active-link {
  background-color: #2E4F93 !important;
  color: white !important;
  border-radius: 8px;
}

.active-link * {
  color: white !important;
}

.active-link svg {
  color: white !important;
}

.active-link svg path {
  fill: white !important;
}

/* ✅ YIL VA OY TANLAGICHLAR UCHUN ROUNDED */
.the-datepicker .ant-select-selector {
  border-radius: 8px !important;
}
</style>