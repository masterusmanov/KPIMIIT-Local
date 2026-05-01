<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { storeToRefs } from "pinia";
// import http from "@/libs/axios";
import Map from "./Map/Map.vue";
import { useStore } from "@/stores/index.store";
import { useDistStore } from "@/stores/district";

const { t, rt, tm } = useI18n();
const router = useRouter();
const route = useRoute();
const indexStore = useStore();
const distStore = useDistStore();
const { selectedDist, selectedTuman } = storeToRefs(distStore);

// Type definitions
interface StageData {
  id: string;
  title: string;
  totals: string[];
  quarters: QuarterData[];
}

interface QuarterData {
  number: number;
  totals: string;
  months: MonthData[];
}

interface MonthData {
  month: number;
  values: number | string | string[];
}

interface UsersCount {
  // Users count ma'lumotlari uchun type
  total: number;
}

interface MapData {
  // Map ma'lumotlari uchun type
  id: string;
  name: string;
  value: number;
}

interface WorkerKPI {
  id: string;
  full_name: string;
  region_title: string;
  position_title: string;
  kpi: string;
  index: number;
}

const activeRank = ref<string>("3");
const columns = ref([
  {
    title: "№",
    key: "index",
    width: 10,
    align: "center",
  },
  { title: "Xodim", dataIndex: "employee", key: "employee" },
  {
    title: "KPI",
    dataIndex: "kpi",
    field: "kpi",
    key: "kpi",
    sorter: true,
    align: "center",
    width: 80,
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

// Accordion holati uchun o'zgaruvchi qo'shamiz
const activeCollapseKey = ref<string | null>(null);

const handleNavigate = (): void => {
  router.back();
};

const months = computed(() => tm("date.months"));
const currentYear: number = new Date().getFullYear();
const years: number[] = Array.from({ length: 5 }, (_, i) => currentYear - i);
const currentMonth = computed<number>(() => new Date().getMonth() + 1);
const currentQuarter = computed<number>(() =>
  Math.ceil(currentMonth.value / 3)
);

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

// const fetchData = async (): Promise<void> => {
//   try {
//     let params: any = {
//       rank_id: indexStore.user?.rank_id || 2,
//       year: selectedYear.value,
//       // month: selectedMonth.value,
//     };

//     // ✅ Rol asosida params ni sozlash
//     if (indexStore.user?.role === "WORKER") {
//       // WORKER uchun faqat o'z region_id si
//       if (indexStore.user?.region_id) {
//         params.region_id = indexStore.user.region_id;
//       }
//     } else if (indexStore.user?.role === "ADMIN") {
//       // ADMIN uchun o'z viloyati va shu viloyat ichidagi barcha tumanlar
//       if (indexStore.user?.region_id) {
//         params.region_id = indexStore.user.region_id;
//         console.log("ADMIN uchun region_id qo'shildi:", params.region_id);
//       }

//       if (indexStore.user?.rank_id === 3 && indexStore.user?.district_id) {
//         params.district_id = indexStore.user.district_id;
//         console.log("ADMIN uchun district_id qo'shildi:", params.district_id);
//       }
//     } else if (indexStore.user?.role === "SUPERADMIN") {
//       // SUPERADMIN uchun rank_id = 3 qo'yamiz
//       params.rank_id = 2;

//       // Agar tuman tanlangan bo'lsa
//       if (selectedTuman?.value) {
//         params.district_id = typeof selectedTuman.value === "object"
//           ? selectedTuman.value.id
//           : selectedTuman.value;
//             params.rank_id = 3;


//         // Tuman tanlanganda viloyat ham kerak bo'ladi
//         if (selectedDist?.value) {
//           params.region_id = typeof selectedDist.value === "object"
//             ? selectedDist.value.id
//             : selectedDist.value;
//         }
//       }
//       // Agar faqat viloyat tanlangan bo'lsa
//       else if (selectedDist?.value) {
//         params.region_id = typeof selectedDist.value === "object"
//           ? selectedDist.value.id
//           : selectedDist.value;
//             params.rank_id = 2;
//       }
//       // Agar hech narsa tanlanmagan bo'lsa, hech qanday region_id yoki district_id yuborilmaydi
//       // Bu holda backend barcha ma'lumotlarni qaytaradi
//     }

//     // API chaqiruvlari
//     const [stages_data] = await Promise.all([
//       http.get("/worker_indicator/statistics/plan_amount", { params }),
//       // http.get("/user/statistics/count", { params }),
//     ]);

//     console.log("Accordion ma'lumotlari:", stages_data?.data?.data?.stages);
//     console.log("SUPERADMIN uchun yuborilgan parametrlar:", params);

//     stages.value = stages_data.data?.data?.stages || [];
//     // users_count.value = users_data.data.data || null;

//   } catch (e) {
//     console.error("Ma'lumot olishda xatolik:", e);
//   }
// };

const fetchData = async (): Promise<void> => {
  stages.value = [
    {
      id: "1",
      title: "Investitsiya loyihalari",
      totals: ["24 ta", "12.5 mln. dollar"],
      quarters: [
        {
          number: 1,
          totals: "8 ta",
          months: [
            { month: 1, values: ["3 ta", "1.5 mln. dollar"] },
            { month: 2, values: ["2 ta", "1.2 mln. dollar"] },
            { month: 3, values: ["3 ta", "1.5 mln. dollar"] },
          ],
        },
        {
          number: 2,
          totals: "6 ta",
          months: [
            { month: 4, values: ["6 ta", "3.1 mln. dollar"] },
            { month: 5, values: ["0 ta"] },
            { month: 6, values: ["0 ta"] },
          ],
        },
      ],
    },
    {
      id: "2",
      title: "Shartnomalar",
      totals: ["18 ta"],
      quarters: [
        {
          number: 1,
          totals: "10 ta",
          months: [
            { month: 1, values: ["4 ta"] },
            { month: 2, values: ["3 ta"] },
            { month: 3, values: ["3 ta"] },
          ],
        },
        {
          number: 2,
          totals: "8 ta",
          months: [
            { month: 4, values: ["8 ta"] },
            { month: 5, values: ["0 ta"] },
            { month: 6, values: ["0 ta"] },
          ],
        },
      ],
    },
    {
      id: "3",
      title: "Bajarilgan vazifalar",
      totals: ["42 ta"],
      quarters: [
        {
          number: 1,
          totals: "20 ta",
          months: [
            { month: 1, values: ["7 ta"] },
            { month: 2, values: ["6 ta"] },
            { month: 3, values: ["7 ta"] },
          ],
        },
        {
          number: 2,
          totals: "22 ta",
          months: [
            { month: 4, values: ["22 ta"] },
            { month: 5, values: ["0 ta"] },
            { month: 6, values: ["0 ta"] },
          ],
        },
      ],
    },
  ];
};

// const fetchWorkersKPI = async (): Promise<void> => {
//   try {
//     const pageSize = Number(route.query?.pageSize) || 10;
//     const currentPage = Number(route.query?.page) || 1;

//     let rankId = Number(activeRank.value);

//     if (indexStore.user?.role === "SUPERADMIN") {
//       rankId = 2;
//     }

//     let params: any = {
//       rank_id: rankId,
//       page: currentPage,
//       limit: pageSize,
//       sort_kpi_percent: route.query?.order == "ascend" ? "asc" : "desc",
//       year: selectedYear.value,
//       month: selectedMonth.value,
//     };

//     if (indexStore.user?.role === "WORKER") {
//       // WORKER uchun faqat o'z region_id si (barcha tumanlar)
//       if (indexStore.user?.region_id) {
//         params.region_id = indexStore.user.region_id;
//       }
//       // district_id yubormaymiz - barcha tumanlar ko'rinsin
//     } else if (indexStore.user?.role === "ADMIN") {
//       // ADMIN uchun o'z region_id si (barcha tumanlar)
//       if (indexStore.user?.region_id) {
//         params.region_id = indexStore.user.region_id;
//       }

//       // Faqat tuman tanlangan bo'lsa district_id yuboramiz
//       if (selectedTuman?.value) {
//         params.district_id =
//           typeof selectedTuman.value === "object"
//             ? selectedTuman.value.id
//             : selectedTuman.value;
//       }
//       // Agar tuman tanlanmagan bo'lsa, barcha tumanlar ko'rinadi
//     }
//      if (indexStore.user?.role === "SUPERADMIN") {
//       if (selectedTuman?.value) {
//         params.district_id =
//           typeof selectedTuman.value === "object"
//             ? selectedTuman.value.id
//             : selectedTuman.value;
//                     params.rank_id = 3;


//         if (selectedDist?.value) {
//           params.region_id =
//             typeof selectedDist.value === "object"
//               ? selectedDist.value.id
//               : selectedDist.value;
//         }
//       } else if (selectedDist?.value) {
//         params.region_id =
//           typeof selectedDist.value === "object"
//             ? selectedDist.value.id
//             : selectedDist.value;
//         params.rank_id = 2;
//       } else {
//         // Hech narsa tanlanmagan holat
//       }
//     }

//     const res = await http.get("/worker/statistics/kpi", { params });

//     data.value =
//       res.data.data?.results.map((item: any, idx: number): WorkerKPI => {
//         return {
//           ...item,
//           index: (currentPage - 1) * pageSize + idx + 1,
//         };
//       }) || [];
//     table.total = res.data.data?.count || 10;

//   } catch (e: any) {
//     console.error("❌ Fetch workers KPI xatosi:", e);
//     if (e.response) {
//       console.error("Backend xato javobi:", e.response.data);
//       console.error("Status kod:", e.response.status);
//     }
//   }
// };

const fetchWorkersKPI = async (): Promise<void> => {
  const pageSize = Number(route.query?.pageSize) || 10;
  const currentPage = Number(route.query?.page) || 1;

  const staticWorkers = [
    { id: "1", full_name: "Aliyev Jasur Baxtiyorovich", region_title: "Toshkent viloyati", district_title: "Yunusobod tumani", position_title: "Bosh mutaxassis", kpi: "92,5", image_url: "" },
    { id: "2", full_name: "Karimova Nilufar Saidovna", region_title: "Samarqand viloyati", district_title: "Samarqand tumani", position_title: "Bo'lim boshlig'i", kpi: "87,3", image_url: "" },
    { id: "3", full_name: "Toshmatov Bobur Hamidovich", region_title: "Farg'ona viloyati", district_title: "Farg'ona tumani", position_title: "Mutaxassis", kpi: "85,0", image_url: "" },
    { id: "4", full_name: "Xasanova Dilnoza Ilyosovna", region_title: "Andijon viloyati", district_title: "Andijon tumani", position_title: "Katta mutaxassis", kpi: "78,6", image_url: "" },
    { id: "5", full_name: "Umarov Sardor Toxirovich", region_title: "Namangan viloyati", district_title: "Namangan tumani", position_title: "Bosh mutaxassis", kpi: "74,2", image_url: "" },
    { id: "6", full_name: "Rajabova Mohira Baxtiyorovna", region_title: "Buxoro viloyati", district_title: "Buxoro tumani", position_title: "Mutaxassis", kpi: "71,8", image_url: "" },
    { id: "7", full_name: "Normatov Sherzod Qodirov", region_title: "Xorazm viloyati", district_title: "Urganch tumani", position_title: "Bo'lim boshlig'i", kpi: "68,4", image_url: "" },
    { id: "8", full_name: "Qodirov Mansur Salimovich", region_title: "Qashqadaryo viloyati", district_title: "Qarshi tumani", position_title: "Katta mutaxassis", kpi: "65,1", image_url: "" },
    { id: "9", full_name: "Ismoilova Zulfiya Hamidovna", region_title: "Surxondaryo viloyati", district_title: "Termiz tumani", position_title: "Mutaxassis", kpi: "61,7", image_url: "" },
    { id: "10", full_name: "Yusupov Komil Alijonovich", region_title: "Jizzax viloyati", district_title: "Jizzax tumani", position_title: "Bosh mutaxassis", kpi: "58,3", image_url: "" },
  ];

  data.value = staticWorkers.map((item, idx) => ({
    ...item,
    index: (currentPage - 1) * pageSize + idx + 1,
  }));

  table.total = staticWorkers.length;
};

const handleTableChange = (pagination: any, filters: any, sorter: any) => {
  // URL queryni yangilash
  router.push({
    query: {
      ...route.query,
      page: pagination.current,
      pageSize: pagination.pageSize, // Bu muhim - pageSize ni query ga qo'shish
      order: sorter.order || undefined,
    },
  });
};

// Accordion o'zgarishi uchun funksiya
const handleCollapseChange = (key: string | string[]): void => {
  activeCollapseKey.value = Array.isArray(key) ? key[0] : key;
};

watch(
  () => [
    activeRank.value,
    route.query.page,
    route.query.pageSize,
    route.query.order,
    selectedDist.value,
    selectedTuman.value,
  ],
  (): void => {
    fetchData();
    fetchWorkersKPI();
  },
  { immediate: true }
);

watch(
  [selectedDist, selectedTuman],
  () => {
    console.log(
      "District/Tuman o'zgardi:",
      selectedDist.value,
      selectedTuman.value
    );
    fetchWorkersKPI();
  },
  { deep: true }
);

// / Ochiq choraklar ro'yxati
// Faqat bitta chorak ochiq bo‘lishi uchun
const openQuarter = ref<number | null>(null);

const toggleQuarter = (quarterNumber: number) => {
  openQuarter.value =
    openQuarter.value === quarterNumber ? null : quarterNumber;
};

// Chorak ochiq ekanligini tekshirish
const isQuarterOpen = (quarterNumber: number) => {
  return openQuarter.value === quarterNumber;
};

const screenWidth = ref<number>(window.innerWidth);

// Kenglik o'zgarganda yangilash funksiyasi
const updateWidth = () => {
  screenWidth.value = window.innerWidth;
};

// Lifecycle — o'lchamni kuzatish
onMounted(() => {
  window.addEventListener("resize", updateWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateWidth);
});

// KPI progress uchun responsive o'lcham (radius) hisoblash
const progressSize = computed<number>(() => {
  if (screenWidth.value < 640) return 50; // sm: telefonlar
  if (screenWidth.value < 1280) return 40; // md: planshetlar
  return 60; // lg: noutbuklar va kattaroq
});
</script>

<template>
  <div class="">
    <!-- Statistics & Map -->
    <div class="relative mt-3 flex items-start gap-3 justify-between">
      <div class="w-[250px] 2xl:min-w-[300px] 2xl:w-[300px]">
        <!-- Objects List -->
        <div class="">
          <a-collapse
            v-model:activeKey="activeCollapseKey"
            class="custom-collapse custom-collapse-secondary"
            ghost
            accordion
            @change="handleCollapseChange"
          >
            <a-collapse-panel v-for="stage in stages" :key="stage.id">
              <template #header>
                <div class="border rounded-[16px] p-1 px-4 shadow-md">
                  <p
                    class="text-[10px] xl:text-sm text-[#0C0981] font-[700] mb-2"
                  >
                    {{ stage.title }}
                  </p>
                  <div class="flex items-center justify-between">
                    <div class="text-[10px] xl:text-[12px]">
                      <p class="text-[#0C0981] font-medium">Soni:</p>
                      <p
                        v-if="stage.totals[1]"
                        class="text-[#0C0981] font-medium"
                      >
                        Summa:
                      </p>
                    </div>
                    <div class="flex items-center space-x-4">
                      <div>
                        <div
                          class="flex items-center space-x-1 text-[10px] xl:text-[12px]"
                        >
                          <p
                            class="font-bold flex"
                            v-html="stage.totals[0].split(' ')[0] || 0"
                          ></p>
                          <p class="font-[700]">
                            {{
                              stage.totals[0].includes("mln.") ? "mln $" : "ta"
                            }}
                          </p>
                        </div>
                        <div
                          v-if="stage.totals[1]"
                          class="flex items-center space-x-1 text-[10px] xl:text-[12px]"
                        >
                          <p
                            class="font-bold flex text-right"
                            v-html="stage.totals[1].split(' ')[0] || 0"
                          ></p>
                          <p class="font-[700]">
                            {{
                              stage.totals[1].includes("mln.") ? "mln $" : "ta"
                            }}
                          </p>
                        </div>
                      </div>
                      <RightOutlined
                        v-show="String(activeCollapseKey) !== String(stage.id)"
                        class="bg-white p-1 text-[14px] border border-gray-200 text-[#0C0981] mb-[15px] shadow-md transition-shadow rounded-full"
                      />
                      <UpOutlined
                        v-show="String(activeCollapseKey) === String(stage.id)"
                        class="bg-white p-1 text-[14px] border border-gray-200 text-[#0C0981] mb-[15px] shadow-md transition-shadow rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </template>

              <!-- Nested collapse for past quarters -->
              <div class="w-full">
                <!-- Past choraklar uchun custom accordion -->
                <div
                  class="border border-[#bfbfbf] w-[90%] mx-auto px-2 rounded-t-[8px] bg-gray-100 pt-2 ml-3"
                  style="border-bottom: none"
                >
                  <div
                    v-for="quarter in stage.quarters?.filter(
                      (q) => q.number < currentQuarter
                    ) || []"
                    :key="quarter.number"
                    class=""
                  >
                    <!-- Quarter header (clickable) -->
                    <div
                      class="px-1 cursor-pointer hover:bg-gray-100 transition-colors"
                      @click="toggleQuarter(quarter.number)"
                    >
                      <div class="border-b border-gray-300 px-3">
                        <span class="text-[12px] font-bold">
                          {{ quarter.number }} - chorak
                        </span>
                        <div class="flex items-center space-x-2">
                          <div class="w-full">
                            <div
                              class="flex items-center space-x-1 justify-between m-0"
                            >
                              <p class="text-[12px] font-semibold">Soni:</p>
                              <div class="flex items-center space-x-2">
                                <p
                                  class="text-[11px] font-bold"
                                  v-html="
                                    (() => {
                                      if (Array.isArray(quarter.totals)) {
                                        const numericValue = quarter.totals
                                          .find(Boolean)
                                          ?.match(/[\d.,]+/);
                                        return numericValue
                                          ? numericValue[0]
                                          : 0;
                                      }
                                      if (typeof quarter.totals === 'string') {
                                        const numericValue =
                                          quarter.totals.match(/[\d.,]+/);
                                        return numericValue
                                          ? numericValue[0]
                                          : 0;
                                      }
                                      return 0;
                                    })()
                                  "
                                ></p>
                                <p class="text-[11px] font-bold">
                                  {{ "ta" }}
                                </p>
                              </div>
                            </div>

                            <!-- faqat agar quarter.totals ichida 'mln. dollar' mavjud bo'lsa ko'rsin -->
                            <div
                              class="flex items-center justify-between"
                              v-if="
                                Array.isArray(quarter.totals) &&
                                quarter.totals.some(
                                  (total) =>
                                    total && total.includes('mln. dollar')
                                )
                              "
                            >
                              <p class="text-[12px] font-semibold">Summa</p>
                              <div class="flex items-center space-x-2">
                                <p
                                  class="font-bold text-[11px]"
                                  v-html="
                                    (() => {
                                      const dollarValue = (quarter.totals as string[]).find(
                                        total => total && total.includes('mln. dollar')
                                      );
                                      return dollarValue
                                        ? dollarValue.replace('mln. dollar', '').trim()
                                        : '';
                                    })()
                                  "
                                ></p>
                                <p class="text-[11px] font-bold">mln $</p>
                              </div>
                            </div>
                          </div>
                          <!-- Arrow icon -->
                          <svg
                            class="w-4 h-4 transition-transform duration-200"
                            :class="{
                              'rotate-180': isQuarterOpen(quarter.number),
                            }"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <!-- Quarter content (collapsible) -->
                    <div
                      v-show="isQuarterOpen(quarter.number)"
                      class="bg-white"
                    >
                      <ul class="m-0 w-full">
                        <li
                          v-for="month in quarter.months?.filter(
                            (m) => m.month <= currentMonth
                          ) || []"
                          :key="month.month"
                          class="py-1 px-4 w-full border-b border-gray-200 last:border-b-0"
                        >
                          <p class="mb-0 text-[12px] font-bold">
                            {{ rt(months[month.month - 1]) }}
                          </p>
                          <!-- =========== -->
                          <div
                            class="flex items-center space-x-1 justify-between m-0"
                          >
                            <p class="text-[11px] font-semibold">Soni:</p>
                            <div class="flex items-center space-x-2">
                              <p
                                class="text-[11px] font-bold"
                                v-html="
                                  (() => {
                                    if (Array.isArray(month.values)) {
                                      const numericValue = month.values
                                        .find(Boolean)
                                        ?.match(/[\d.,]+/);
                                      return numericValue ? numericValue[0] : 0;
                                    }
                                    if (typeof month.values === 'string') {
                                      const numericValue =
                                        quarter.totals.match(/[\d.,]+/);
                                      return numericValue ? numericValue[0] : 0;
                                    }
                                    return 0;
                                  })()
                                "
                              ></p>
                              <p class="text-[11px] font-bold">
                                {{ "ta" }}
                              </p>
                            </div>
                          </div>
                          <!-- ========== -->
                          <div
                            class="flex items-center justify-between space-x-1 text-[11px]"
                            v-if="
                              Array.isArray(month.values) &&
                              month.values.some(
                                (total) =>
                                  total && total.includes('mln. dollar')
                              )
                            "
                          >
                            <p class="text-[#0C0981] font-medium">Summa:</p>
                            <div class="flex items-start gap-1">
                              <strong
                                v-html="
                                  (() => {
                                    if (Array.isArray(month.values)) {
                                      // Array ichidan dollar miqdorini topish
                                      const dollarValue = month.values.find(
                                        (total) =>
                                          total && total.includes('mln. dollar')
                                      );
                                      if (dollarValue) {
                                        // 'mln. dollar' so'zlarini olib tashlash va faqat sonni qoldirish
                                        return dollarValue
                                          .replace('mln. dollar', '')
                                          .trim();
                                      }
                                      return 0;
                                    }
                                    return 0;
                                  })()
                                "
                              ></strong>
                              <p class="text-[11px] font-semibold">mln $</p>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <!-- Current quarter months -->
                <div
                  v-if="stage.quarters && stage.quarters[currentQuarter - 1]"
                  class="border border-[#bfbfbf] w-[90%] mx-auto ml-[12px] 2xl:ml-[12px] rounded-b-[8px] bg-gray-100"
                  style="border-top: none"
                >
                  <ul class="w-full m-0">
                    <li
                      v-for="month in stage.quarters[
                        currentQuarter - 1
                      ]?.months?.filter((m) => m.month <= currentMonth) || []"
                      :key="month.month"
                      class="py-1 px-6 w-full border-b border-gray-200 last:border-b-0"
                    >
                      <p class="mb-0 text-[12px] font-bold">
                        {{ rt(months[month.month - 1]) }}
                      </p>
                      <div>
                        <div
                          class="flex items-center space-x-1 justify-between m-0"
                        >
                          <p class="text-[11px] font-semibold">Soni:</p>
                          <div class="flex items-center space-x-2">
                            <p
                              class="text-[11px] font-bold"
                              v-html="
                                (() => {
                                  if (Array.isArray(month.values)) {
                                    const numericValue = month.values
                                      .find(Boolean)
                                      ?.match(/[\d.,]+/);
                                    return numericValue ? numericValue[0] : 0;
                                  }
                                  if (typeof month.values === 'string') {
                                    const numericValue =
                                      month.values.match(/[\d.,]+/);
                                    return numericValue ? numericValue[0] : 0;
                                  }
                                  return 0;
                                })()
                              "
                            ></p>
                            <p class="text-[11px] font-bold">{{ "ta" }}</p>
                          </div>
                        </div>

                        <!-- Faqat mln. dollar mavjud bo'lsa ko'rsatish -->
                        <div
                          class="flex items-center justify-between space-x-1 text-[11px]"
                          v-if="
                            Array.isArray(month.values) &&
                            month.values.some(
                              (total) => total && total.includes('mln. dollar')
                            )
                          "
                        >
                          <p class="font-semibold">Summa:</p>
                          <div class="flex items-start gap-1">
                            <strong
                              v-html="
                                (() => {
                                  const dollarValue = month.values.find(
                                    (total) =>
                                      total && total.includes('mln. dollar')
                                  );
                                  return dollarValue
                                    ? dollarValue
                                        .replace('mln. dollar', '')
                                        .trim()
                                    : '';
                                })()
                              "
                            ></strong>
                            <p class="text-[11px] font-bold">mln $</p>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </div>

      <div class="w-[50%] space-y-6">
        <!-- <div
          class="bg-gray-200 mt-5 flex-center group duration-200 hover:bg-blue-300 min-w-8 -translate-x-2 !shrink-0 !size-8 rounded-full cursor-pointer"
          @click="handleNavigate"
        >
          <LeftOutlined
            class="text-[#0C0981] text-lg font-bold duration-200 group-hover:text-white"
          />
        </div> -->
        <!-- <Map :data="map" class="2xl:p-4" /> -->
        <Map />
      </div>

      <!-- Rating -->
      <div class="w-[30%] flex flex-col gap-4">
        <a-table
          class="custom-table dashboard-table"
          :columns="columns"
          :data-source="data"
          :showSorterTooltip="false"
          :pagination="{
            current: Number(route.query.page) || 1,
            pageSize: Number(route.query.pageSize) || 10,
            total: table.total,
            position: ['bottomCenter'],
            size: 'middle',
            showSizeChanger: true,
            showQuickJumper: false,
            pageSizeOptions: ['10', '20', '30', '50'],
            showTotal: (total: number, range: [number, number]) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }"
          bordered
          @change="handleTableChange"
        >
          <!-- Profile Image Column -->
          <template #bodyCell="{ column, record, index }">
            <!-- Tartib raqami ustuni -->
            <template v-if="column.key === 'index'">
              <div class="text-center font-semibold text-gray-600">
                {{
                  ((Number(route.query.page) || 1) - 1) *
                    (Number(route.query.pageSize) || 10) +
                  index +
                  1
                }}
              </div>
            </template>

            <!-- Xodim ma'lumotlari ustuni -->
            <template v-if="column.key === 'employee'">
              <div class="p-2 w-full flex flex-col items-start gap-2">
                <div
                  class="text-[10px] xl:text-sm font-bold"
                  :class="{
                    'text-cGreen':
                      record.index < 4 &&
                      (route.query?.order == 'descend' || !route.query?.order),
                    'text-cRed':
                      record.index < 4 && route.query?.order == 'ascend',
                  }"
                ></div>

                <div class="flex items-start 2xl:gap-3">
                  <div class="">
                    <a-avatar
                      class=""
                      :size="{ xl: 36, xxl: 40 }"
                      :src="record.image_url"
                    >
                      <template #icon>
                        <UserOutlined />
                      </template>
                    </a-avatar>
                  </div>
                  <div class="flex flex-col justify-start gap-1 ml-[10px]">
                    <div class="text-[10px] xl:text-xs font-semibold">
                      {{ record.full_name }}
                    </div>
                    <div class="text-[10px] xl:text-xs">
                      {{ record.region_title }}
                      <span v-if="selectedTuman">
                        /
                        {{
                                                    selectedTuman.title ||
                          selectedTuman
                        }}
                      </span>
                      <!-- Agar selectedTuman yo'q bo'lsa, ADMIN va WORKER uchun district_title ko'rsatish -->
                      <span
                        v-else-if="
                          (indexStore.user?.role === 'ADMIN' ||
                            indexStore.user?.role === 'WORKER') &&
                          record.district_title
                        "
                      >
                        / {{ record.district_title }}
                      </span>
                      / {{ record.position_title }}
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- KPI ustuni -->
            <template v-if="column.key === 'kpi'">
              <div class="flex items-center justify-center">
                <a-progress
                  class="custom-half-progress relative top-1 text-[10px]"
                  type="dashboard"
                  :percent="Number(record.kpi?.replace(',', '.')) || 0"
                  status="active"
                  :size="progressSize"
                  :strokeWidth="8"
                />
              </div>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
/* Bu yerda CSS o'zgarishsiz qoladi */
.custom-table :deep(.ant-table-thead > tr > th) {
  background-color: #f5f7fa;
  text-align: center;
  border-radius: 0;
}

.custom-table :deep(.ant-table-tbody > tr > td) {
  text-align: center;
}

.custom-table table {
  font-size: 12px;
  border-radius: 0px;
}

.custom-table .ant-table-thead > tr > th {
  background-color: #2e4f93;
  color: white;
}

.custom-table .ant-table-row:hover {
  background-color: #f5f5f5;
}

.custom-table .ant-table-body {
  scrollbar-width: thin;
}

.custom-table .ant-table-column-sorter.ant-table-column-sorter-full {
  color: #fff;
}

.custom-collapse {
  .ant-collapse-header {
    padding-left: 0 !important;
    border-radius: 0 !important;
  }

  .ant-collapse-arrow {
    display: none !important;
  }
}

.custom-collapse-secondary {
  .ant-collapse-content-box {
    padding: 0 !important;
  }

  .ant-collapse-arrow {
    display: none !important;
  }
}

.custom-half-progress .ant-progress-text {
  // font-size: 14px;
  font-weight: 700;
}

.dashboard-table tbody tr .ant-table-cell {
  padding: 0 !important;
}

.custom-table .ant-table-thead th.ant-table-column-sort {
  color: #000;
}

/* Custom styles */
.rotate-180 {
  transform: rotate(180deg);
}

/* List reset */
ul {
  list-style: none;
  padding: 0;
}

li {
  list-style: none;
}
</style>
