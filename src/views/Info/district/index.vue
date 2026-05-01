<!-- index.vue -->
<script lang="ts" setup>
import type { TableColumnsType } from "ant-design-vue";
import { useRegionState } from "@/composables/useRegionState";

const router = useRouter();
const route = useRoute();
const store = useStore();

// ✅ dateStore o'rniga local reactive
const currentYear = new Date().getFullYear();
const selectedYear = ref(Number(route.query.year) || currentYear);
const selectedMonth = ref(new Date().getMonth() + 1);

const { viloyatList } = useRegionState();

const data = ref<any[]>([]);
const columns = ref<TableColumnsType>([]);

// ✅ Statik ustunlar (API kolonlari o'rniga)
const baseColumns: TableColumnsType = [
  {
    title: "№",
    key: "index",
    dataIndex: "index",
    width: 30,
    align: "center",
  },
  {
    title: "Hudud nomi",
    dataIndex: "region_name",
    key: "region_name",
    width: 160,
    align: "center",
  },
  {
    title: "Biriktirilgan hodimlar soni",
    dataIndex: "responsible_users_count",
    key: "responsible_users_count",
    align: "center",
    width: 95,
  },
];

// ✅ Statik ko'rsatkich ustunlari (rank_id: 3 uchun)
const indicatorColumns: TableColumnsType = [
  {
    title: "Mehnat unumdorligi",
    key: "group_0",
    align: "center",
    customHeaderCell: () => ({ class: "group-0" }),
    children: [
      {
        title: "Reja (mln so'm)",
        dataIndex: "labor_plan",
        key: "labor_plan",
        width: 120,
        align: "center",
        customHeaderCell: () => ({ class: "group-0" }),
      },
      {
        title: "Fakt (mln so'm)",
        dataIndex: "labor_fact",
        key: "labor_fact",
        width: 120,
        align: "center",
        customHeaderCell: () => ({ class: "group-0" }),
      },
    ],
  },
  {
    title: "Eksport hajmi",
    key: "group_1",
    align: "center",
    customHeaderCell: () => ({ class: "group-1" }),
    children: [
      {
        title: "Reja (mln $)",
        dataIndex: "export_plan",
        key: "export_plan",
        width: 120,
        align: "center",
        customHeaderCell: () => ({ class: "group-1" }),
      },
      {
        title: "Fakt (mln $)",
        dataIndex: "export_fact",
        key: "export_fact",
        width: 120,
        align: "center",
        customHeaderCell: () => ({ class: "group-1" }),
      },
    ],
  },
  {
    title: "Investitsiyalar",
    key: "group_2",
    align: "center",
    customHeaderCell: () => ({ class: "group-2" }),
    children: [
      {
        title: "Reja (mlrd so'm)",
        dataIndex: "invest_plan",
        key: "invest_plan",
        width: 120,
        align: "center",
        customHeaderCell: () => ({ class: "group-2" }),
      },
      {
        title: "Fakt (mlrd so'm)",
        dataIndex: "invest_fact",
        key: "invest_fact",
        width: 120,
        align: "center",
        customHeaderCell: () => ({ class: "group-2" }),
      },
    ],
  },
  {
    title: "Yangi ish o'rinlari",
    key: "group_3",
    align: "center",
    customHeaderCell: () => ({ class: "group-3" }),
    children: [
      {
        title: "Reja (ta)",
        dataIndex: "jobs_plan",
        key: "jobs_plan",
        width: 120,
        align: "center",
        customHeaderCell: () => ({ class: "group-3" }),
      },
      {
        title: "Fakt (ta)",
        dataIndex: "jobs_fact",
        key: "jobs_fact",
        width: 120,
        align: "center",
        customHeaderCell: () => ({ class: "group-3" }),
      },
    ],
  },
];

// ✅ Statik ma'lumotlar generatsiyasi
const generateMockData = () => {
  // Jami qator (index 0)
  const totalRow = {
    index: "—",
    region_id: null,
    region_name: "Jami",
    responsible_users_count: 1240,
    labor_plan: 45200,
    labor_fact: 41800,
    export_plan: 3200,
    export_fact: 2950,
    invest_plan: 87500,
    invest_fact: 79200,
    jobs_plan: 28000,
    jobs_fact: 24600,
  };

  // Viloyatlar qatorlari
  const regionRows = viloyatList.value.map((viloyat, i) => ({
    index: i + 1,
    region_id: viloyat.id,
    region_name: viloyat.title,
    responsible_users_count: Math.floor(50 + Math.random() * 150),
    labor_plan: Math.floor(2000 + Math.random() * 5000),
    labor_fact: Math.floor(1800 + Math.random() * 4500),
    export_plan: Math.floor(100 + Math.random() * 500),
    export_fact: Math.floor(80 + Math.random() * 450),
    invest_plan: Math.floor(3000 + Math.random() * 10000),
    invest_fact: Math.floor(2500 + Math.random() * 9000),
    jobs_plan: Math.floor(800 + Math.random() * 3000),
    jobs_fact: Math.floor(600 + Math.random() * 2800),
  }));

  return [totalRow, ...regionRows];
};

const fetchData = () => {
  columns.value = [...baseColumns, ...indicatorColumns];
  data.value = generateMockData();
};

onMounted(() => {
  fetchData();
});

// Year/month o'zgarganda qayta yuklash
watch([selectedYear, selectedMonth], () => {
  fetchData();
});
</script>

<template>
  <TheTable
    :columns="columns"
    :data-source="data"
    :scroll="{ x: 'max-content', y: 'max-content' }"
    :sticky="{ offsetHeader: 0 }"
    :pagination="false"
    class="px-9 overflow-x-hidden"
  >
    <template #headerCell="{ title, column }">
      <template
        v-if="column.dataIndex && column.dataIndex.includes('plan')"
      >
        {{ title }}
      </template>
    </template>

    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'region_name'">
        <div class="text-left">
          <div
            v-if="index !== 0"
            :class="{
              'text-cBlue font-bold cursor-pointer underline': store.canAccess?.({
                region_id: record.region_id,
              }),
            }"
            @click="() => {
              if (store.canAccess?.({ region_id: record.region_id })) {
                router.push({
                  path: `/info/district/${record.region_id}`,
                  query: {
                    ...route.query,
                    region: record.region_name,
                  },
                });
              }
            }"
          >
            {{
              record.region_name.includes('Respublikasi')
                ? record.region_name.split('Respublikasi')[0] + 'Res'
                : record.region_name
            }}
          </div>
          <span v-if="index === 0">Jami</span>
        </div>
      </template>

      <!-- ✅ Reja/Fakt ustunlari uchun rang ko'rsatish -->
      <template v-else-if="column.dataIndex?.includes('fact')">
        <span
          :style="{
            color: record[column.dataIndex] >= record[column.dataIndex?.replace('fact', 'plan')]
              ? '#10B981'
              : '#EF4444'
          }"
        >
          {{ record[column.dataIndex]?.toLocaleString() }}
        </span>
      </template>

      <template v-else>
        {{ record[column.dataIndex]?.toLocaleString?.() ?? record[column.dataIndex] }}
      </template>
    </template>
  </TheTable>
</template>

<style scoped>
::v-deep(th:nth-child(1)) {
  background-color: #C7D0E2 !important;
}
::v-deep(th:nth-child(2)) {
  background-color: #D1DAEC !important;
}
::v-deep(th:nth-child(3)) {
  background-color: #C7D0E2 !important;
}
::v-deep(th.group-1),
::v-deep(th.group-3),
::v-deep(th.group-5),
::v-deep(th.group-7),
::v-deep(th.group-9) {
  background-color: #C7D0E2 !important;
}
::v-deep(th.group-0),
::v-deep(th.group-2),
::v-deep(th.group-4),
::v-deep(th.group-6),
::v-deep(th.group-8) {
  background-color: #D1DAEC !important;
}
::v-deep(.ant-table-thead > tr > th) {
  position: sticky !important;
  top: 0 !important;
  z-index: 10 !important;
}
</style>