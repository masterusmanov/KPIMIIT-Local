<template>
    <div class=" w-full flex items-start justify-between">
        <div class="w-full mt-0 2xl:mt-0">
            <Chart/>
        </div>
        <div class="w-[40%]">
            <!-- Rating -->
    <div class="flex flex-col gap-4">
  <div class="w-full flex items-center justify-between">
    <!-- <p class="m-0 font-bold text-md">
      Vazirlik bo'yicha biriktirilgan hodimlar reytingi
    </p> -->
  </div>

  <!-- Simple scrollable wrapper -->
  <div style="max-height: 68vh; overflow-y: auto;">
    <a-table
          class="custom-table dashboard-table"
          :columns="columns"
          :data-source="data"
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
            {{ ((Number(route.query.page) || 1) - 1) * (Number(route.query.pageSize) || 10) + index + 1 }}
          </div>
        </template>

        <!-- Xodim ma'lumotlari ustuni -->
        <template v-if="column.key === 'employee'">
          <div class="p-2 w-full flex flex-col items-start gap-2">
            <div
              class="text-sm font-bold"
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
                <a-avatar class="" :size="{ xl: 36, xxl: 40 }">
                  <template #icon>
                    <UserOutlined />
                  </template>
                </a-avatar>
              </div>
              <div class="flex flex-col justify-start gap-1 ml-[10px]">
                <div class="text-xs font-semibold">
                  {{ record.full_name }}
                </div>
                <div class="text-xs">
                  {{ record.region_title }}
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
              class="custom-half-progress relative top-1"
              type="dashboard"
              :percent="Number(record.kpi?.replace(',', '.')) || 0"
              status="active"
              :size="70"
              :strokeWidth="8"
            />
          </div>
        </template>
      </template>
    </a-table>
  </div>
</div>
        </div>
    </div>
</template>

<script setup lang="ts">
// import StatisticcsMinistry from '@/layout/components/StatisticcsMinistry.vue';
import http from "@/libs/axios";
import Chart from "./components/Chart.vue";

// Type definitions
interface StageData {
  id: string;
  title: string;
  totals: string[];
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

interface WorkerKPI {
  id: string;
  full_name: string;
  region_title: string;
  position_title: string;
  kpi: string;
  index: number;
}

const { t, rt, tm } = useI18n();
const router = useRouter();
const route = useRoute();

const activeRank = ref("3");
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

const handleNavigate = () => {
  router.back();
};

const months = computed(() => tm("date.months"));
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
const currentMonth = computed(() => new Date().getMonth() + 1);
const currentQuarter = computed(() => Math.ceil(currentMonth.value / 3));

const defaultMonth = computed(() => {
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

const fetchData = async () => {
  try {
    const params = {
      rank_id: 1,
      // region_title_id: 1703,
      year: selectedYear.value,
      month: selectedMonth.value,
    };

    const [stages_data, users_data] = await Promise.all([
      http.get("/worker_indicator/statistics/plan_amount", { params }),
      http.get("/user/statistics/count", { params }),
      // http.get("/statistics/map", { params }),
    ]);

    stages.value = stages_data.data.data?.stages || [];
    users_count.value = users_data.data.data || null;
    // map.value = map_data.data.data || [];
  } catch (e) {
    console.error(e);
  }
};

const fetchWorkersKPI = async (): Promise<void> => {
  try {
    // URL querydan pageSize ni olish, default 10
    const pageSize = Number(route.query?.pageSize) || 10;
    const currentPage = Number(route.query?.page) || 1;
    
    const res = await http.get("/worker/statistics/kpi", {
      params: {
        rank_id: Number(activeRank.value),
        page: currentPage,
        limit: pageSize, // Bu muhim - pageSize ni limit sifatida yuborish
        sort_kpi_percent: route.query?.order == "ascend" ? "asc" : "desc",
        year: selectedYear.value,
        month: selectedMonth.value,
      },
    });

    data.value =
      res.data.data?.results.map((item: any, idx: number): WorkerKPI => {
        return {
          ...item,
          index: (currentPage - 1) * pageSize + idx + 1,
        };
      }) || [];
    table.total = res.data.data?.count || 10;
  } catch (e) {
    console.error("Fetch workers KPI error:", e);
  }
};

// handleTableChange funksiyasini yangilash
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
const handleCollapseChange = (key: string | string[]) => {
  activeCollapseKey.value = Array.isArray(key) ? key[0] : key;
};

// Watch funksiyasini to'g'rilash
watch(
  () => [activeRank.value, route.query.page, route.query.pageSize, route.query.order],
  () => {
    fetchData();
    fetchWorkersKPI();
  },
  { immediate: true }
);

</script>

<style scoped>

</style>