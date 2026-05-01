<script lang="ts" setup>
import { ref, computed } from "vue";
import VueApexCharts from "vue3-apexcharts";
import http from "@/libs/axios";
import "apexcharts";

interface MonthData {
  month: number;
  name: string;
  rating_share_percent: string | number;
  execution_percent: string | number;
  dollar_execution_amount: string | number;
  execution_amount: string | number;
  plan_amount: string | number;
}

const { t, rt, tm } = useI18n();
const router = useRouter();
const route = useRoute();

const currentDate = ref(new Date());

const formattedDate = computed(() => {
  const date = currentDate.value;
  return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}.${date.getFullYear()} ${date
    .getHours()
    .toString()
    .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
});

const monthlyData = ref<MonthData[]>([]);

const series = computed(() => [
  {
    name: "Ijro foizi", // "Execution Percent"
    data: monthlyData.value.map((month) => month.execution_percent),
  },
  {
    name: "Reyting ulushi (%)", // "Rating Share Percent"
    data: monthlyData.value.map((month) => month.rating_share_percent),
  },
]);

const chartOptions = computed(() => ({
  chart: {
    type: "bar",
    height: 400,
    toolbar: {
      show: false,
    },
    fontFamily: "Inter, sans-serif",
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "75%", // increased bar width
      endingShape: "rounded",
      dataLabels: {
        position: "top",
      },
      borderRadius: 5, // <-- Add this line for rounded corners
    },
  },
  colors: ["#3b82f6", "#2dd4bf"], // blue-500, teal-400
  dataLabels: {
    enabled: true,
    formatter: function (val: number, opts: any) {
      // Only show label if value is a valid number
      if (isNaN(val)) return "";
      return opts.seriesIndex === 1 ? val.toFixed(1) + "%" : val.toFixed(1);
    },
    offsetY: -20,
    style: {
      fontSize: "12px",
      colors: ["#3b82f6", "#0d9488"], // blue-500, teal-600
    },
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },
  grid: {
    borderColor: "#f3f4f6", // gray-100
    strokeDashArray: 4,
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  xaxis: {
    categories: monthlyData.value.map((month) => month.name),
    labels: {
      style: {
        colors: Array(monthlyData.value.length).fill("#1e293b"),
        fontSize: "12px",
        fontWeight: 600,
      },
      rotate: 0,
      offsetY: 0,
      formatter: function (value: string, index: number) {
        // Only show the month name
        return value;
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    min: 0,
    max: 100,
    tickAmount: 4,
    labels: {
      formatter: function (val: number) {
        return val.toFixed(2);
      },
      style: {
        colors: "#6b7280", // gray-500
        fontSize: "12px",
      },
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: function (val: number) {
        return val.toFixed(1);
      },
    },
  },
  legend: {
    show: false,
  },
}));

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("ru-RU").format(value);
};

const fetchData = async () => {
  try {
    const res = await http.get<any>(`/statistics/kpi/dynamics`, {
      params: {
        year: route.query?.year || new Date().getFullYear(),
      },
    });

    monthlyData.value = res.data.data.months.map((month: MonthData) => ({
      ...month,
      name: tm("date.months")[month.month - 1],
      dollar_execution_amount:
        typeof month.dollar_execution_amount === "string"
          ? parseFloat(month.dollar_execution_amount)
          : month.dollar_execution_amount,
      execution_amount:
        typeof month.execution_amount === "string"
          ? parseFloat(month.execution_amount)
          : month.execution_amount,
      execution_percent:
        typeof month.execution_percent === "string"
          ? parseFloat(month.execution_percent)
          : month.execution_percent,
      plan_amount:
        typeof month.plan_amount === "string"
          ? parseFloat(month.plan_amount)
          : month.plan_amount,
      rating_share_percent:
        typeof month.rating_share_percent === "string"
          ? parseFloat(month.rating_share_percent)
          : month.rating_share_percent,
    }));
  } catch (e) {
    console.error(e);
  }
};

watch(
  () => route.query.year,
  () => fetchData(),
  { immediate: true }
);
</script>

<template>
  <div class="w-full flex items-center justify-between">
    <div class="text-lg font-bold mt-[100px]">
      Tumanlar bo‘yicha dinamika ko‘rsatkichlari
    </div>

    <!-- <div class="flex justify-end items-center text-sm text-gray-600 mb-4">
      <span>Маълумот янгиланган сана:</span>
      <span class="ml-2 text-blue-600 font-medium">{{ formattedDate }}</span>
    </div> -->
  </div>

  <!-- Chart -->
  <div class="w-full h-[450px]">
    <VueApexCharts
      type="bar"
      height="400"
      :options="chartOptions"
      :series="series"
    ></VueApexCharts>
  </div>
</template>
