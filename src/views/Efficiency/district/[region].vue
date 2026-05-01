// vazirlik faylida
<script lang="ts" setup>
import http from "@/libs/axios";
import { ChartArea, ChevronsRight, ArrowUp, ArrowDown } from "lucide-vue-next"; // ArrowUp, ArrowDown qo'shildi
import type { TableColumnsType } from "ant-design-vue";

const router = useRouter();
const route = useRoute();
const store = useStore();

const districts = ref<District[]>([]);
const table = ref();
const data = ref<any>([]);
const columns = ref<TableColumnsType>([]);

// Yangi ref'lar qo'shildi
const top2: Ref<number[]> = ref([]);
const bottom2: Ref<number[]> = ref([]);
const totalShareSortOrder: Ref<'asc' | 'desc' | null> = ref(null);

const baseColumns: TableColumnsType = [
  { title: "№", key: "index", dataIndex: "index", width: 30, align: "center" },
  {
    title: "Hudud nomi",
    dataIndex: "district_name",
    key: "district_name",
    width: 150,
    align: "center",
  },
  {
    title: "Biriktirilgan hodimlar soni",
    dataIndex: "responsible_users_count",
    key: "responsible_users_count",
    align: "center",
    width: 95,
  },
  {
    title: "Umumiy reytingdagi hissasi (%)",
    dataIndex: "total_share_percentage",
    key: "total_share_percentage",
    align: "center",
    width: 95,
  },
  {
    title: "O'tgan oyning umumiy reytingdagi hissasi (%)",
    dataIndex: "last_month_total_share_percentage",
    key: "last_month_total_share_percentage",
    align: "center",
    width: 110,
  },
  {
    title: "Farqi",
    dataIndex: "share_comparison_between_months",
    key: "share_comparison_between_months",
    align: "center",
    width: 95,
  },
];

// fetch districts & data
const fetchDistricts = async () => {
  try {
    const res = await http.get<Res<District>>(
      `/district/list?regions=${route.params.region}`
    );
    districts.value = [
      {} as District,
      ...(res.data.data.results?.sort((a: any, b: any) => a.order - b.order) ||
        []),
    ];
  } catch (e) {
    console.log(e);
  }
};

const fetchData = async () => {
  try {
    const res = await http.get<Res<any>>(
      `/workers_kpi/region/${route.params.region}`,
      {
        params: {
          year: route.query.year || new Date().getFullYear(),
          month: route.query.month || new Date().getMonth() + 1,
          rank_id: 3,
        },
      }
    );

    // Dastlabki data.value ni yaratish
    data.value = districts.value.map((item: any, index: number) => ({
      ...item,
      index: index === 0 ? "—" : index,
      district_id: item.id,
      district_name: index === 0 ? "Jami" : item.title,
    }));

    const hasChildren = (item: any, index: number) => {
      if (item.children) {
        return item.children.map((child: any) => {
          const baseDataIndex = child.children?.[0]?.dataIndex || "";
          const ratingShareDataIndex = baseDataIndex.replace(
            /_plan_amount$|_execution_amount$|_execution_percent$/,
            "_rating_share_percent"
          );

          return {
            ...child,
            key: "criteria",
            width: 120,
            align: "center",
            hideChildren: true,
            dataIndex:
              child.children.find((c: any) => c.title == "Reja").dataIndex ||
              "",
            children: [
              {
                title: "reytingdagi xissasi (vazn 5%)",
                width: 120,
                align: "center",
                key: "rating_share_percent",
                dataIndex: ratingShareDataIndex,
                customHeaderCell: () => ({
                  class: `group-${index}`,
                }),
              },
            ],
            children1: [
              ...child.children.map((c: any) => ({
                ...c,
                width: 120,
                align: "center",
                customHeaderCell: () => ({
                  class: `group-${index}`,
                }),
              })),
              {
                title: "reytingdagi xissasi (vazn 5%)",
                width: 120,
                align: "center",
                key: "rating_share_percent",
                dataIndex: ratingShareDataIndex,
                customHeaderCell: () => ({
                  class: `group-${index}`,
                }),
              },
            ],
            customHeaderCell: () => ({
              class: `group-${index}`,
            }),
          };
        });
      } else {
        return [];
      }
    };

    columns.value = [
      ...baseColumns,
      ...res.data.data.columns.map((item: any, index: number) => ({
        ...item,
        width: 120,
        align: "center",
        children: hasChildren(item, index),
        customHeaderCell: () => ({
          class: `group-${index}`,
        }),
      })),
    ];

    // Serverdan kelgan ma'lumotlarni data.value bilan birlashtirish
    res.data.data.data?.forEach((serverItem: any) => {
      if (
        !serverItem.region_name ||
        serverItem.region_name === "" ||
        serverItem.region_name === null
      ) {
        // "Jami" qatorini yangilash
        data.value[0] = { ...data.value[0], ...serverItem };
      } else {
        // Hudud ma'lumotlari uchun
        const recordIndex = data.value.findIndex(
          (dataItem: any) => dataItem.title === serverItem.region_name
        );

        if (recordIndex !== -1) {
          data.value[recordIndex] = {
            ...data.value[recordIndex],
            ...serverItem,
          };
        }
      }
    });

    // Saralash logikasi
    const jamiRow = data.value[0];
    let sortableData = data.value.slice(1); // Jami qatoridan keyingi elementlar

    if (totalShareSortOrder.value === 'asc') {
      sortableData.sort((a: any, b: any) => {
        const valA = parseFloat(a.total_share_percentage) || 0;
        const valB = parseFloat(b.total_share_percentage) || 0;
        return valA - valB;
      });
    } else if (totalShareSortOrder.value === 'desc') {
      sortableData.sort((a: any, b: any) => {
        const valA = parseFloat(a.total_share_percentage) || 0;
        const valB = parseFloat(b.total_share_percentage) || 0;
        return valB - valA;
      });
    }

    // Saralangan ma'lumotlarni Jami qatori bilan birlashtiramiz
    data.value = [jamiRow, ...sortableData];

    // Saralashdan so'ng indekslarni yangilaymiz
    data.value.forEach((item: any, index: number) => {
      item.index = index === 0 ? "—" : index;
    });

    // Top 2 va Bottom 2 ni aniqlash
    const percentages = data.value
      .filter(
        (item: any, index: number) =>
          index !== 0 &&
          item.total_share_percentage !== undefined &&
          item.total_share_percentage !== null
      )
      .map((item: any) => parseFloat(item.total_share_percentage));

    if (percentages.length > 0) {
      const sortedUniquePercentages = [...new Set<number>(percentages)].sort((a, b) => a - b);
      bottom2.value = sortedUniquePercentages.slice(0, Math.min(2, sortedUniquePercentages.length));
      top2.value = sortedUniquePercentages.slice(Math.max(0, sortedUniquePercentages.length - 2));
    } else {
      top2.value = [];
      bottom2.value = [];
    }

  } catch (e) {
    console.log(e);
  }
};

onMounted(async () => {
  await fetchDistricts();
  await fetchData();
});

watch(() => route.query, fetchData);
</script>

<template>
  <div class="w-full flex flex-col gap-4 overflow-x-hidden">
    <TheBreadcrumb
      home="/efficiency/district"
      :items="[{ label: route.query.region }]"
    />

    <TheTable
      class="px-9"
      ref="table"
      :columns="columns"
      :data-source="data"
      :pagination="false"
    >
      <template #headerCell="{ title, column }">
        <template v-if="column.dataIndex && column.dataIndex.includes('plan_amount')">
          {{ title }} <br />
          <span v-if="column.measurement_unit_title" style="font-weight: 400">
            ({{ column.measurement_unit_title }})
          </span>

          <button
            v-if="column.key === 'criteria'"
            class="absolute top-1 right-1 w-4 h-4 bg-white"
            :class="{
              'rotate-180': !column.hideChildren,
            }"
            @click="
              () => {
                column.hideChildren = !column.hideChildren;
                if (column.hideChildren) {
                  column.children1 = [...column.children];
                  column.children = [column.children1[3]];
                } else {
                  column.children = [...column.children1];
                }

                table.updateScrollbar();
              }
            "
          >
            <ChevronsRight class="size-4" />
          </button>
        </template>

        <template v-else-if="column.key === 'total_share_percentage'">
          <div class="flex flex-col items-center">
            <div class="flex w-full gap-4 justify-end">
              <button
                v-if="totalShareSortOrder"
                @click="totalShareSortOrder = null; fetchData();"
                class="text-[16px] font-bold text-red-500 hover:underline mt-1"
              >
                &times;
              </button>
            </div>
            <div class="flex items-center gap-2">
              <span>{{ title }}</span>
              <div class="w-full">
                <button
                  @click="totalShareSortOrder = 'desc'; fetchData();"
                  :class="{ 'text-blue-500': totalShareSortOrder === 'desc' }"
                  class="mx-auto flex items-center justify-center rounded-sm text-[#8A8A8A] hover:text-gray-700"
                >
                  ▲
                </button>
                <button
                  @click="totalShareSortOrder = 'asc'; fetchData();"
                  :class="{ 'text-blue-500': totalShareSortOrder === 'asc' }"
                  class="mx-auto flex items-center justify-center rounded-sm text-[#8A8A8A] hover:text-gray-700"
                >
                  ▼
                </button>
              </div>
            </div>
          </div>
        </template>
      </template>

      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'district_name'">
          <div class="text-left">
            <div
              v-if="index != 0"
              :class="{
                'text-cBlue font-bold cursor-pointer underline':
                  store.canAccess({
                    region_id: route.params.region,
                    district_id: record.district_id,
                  }),
              }"
              @click="
                () => {
                  if (
                    store.canAccess({
                      region_id: route.params.region,
                      district_id: record.district_id,
                    })
                  ) {
                    router.push({
                      path: `/efficiency/district/${route.params.region}/${record.district_id}`,
                      query: {
                        ...route.query,
                        region: route.query.region,
                        district: record.district_name,
                      },
                    });
                  }
                }
              "
            >
              {{ record.district_name }}
            </div>
            {{ index === 0 ? "Jami" : "" }}
          </div>
        </template>

        <template v-else-if="column.key === 'responsible_user_name'">
          <div class="text-left">
            <div v-if="index != 0" class="text-cBlue font-bold" to="/" :class="{ italic: index === 0 }">
              {{ record.responsible_user_name }}
            </div>
          </div>
        </template>

        <template v-else-if="column.key == 'total_share_percentage'" >
          <div class="px-2 flex items-center justify-between gap-1" :class="{
                'bg-[#00C564] text-white': index !== 0 && top2.includes(parseFloat(record[column.dataIndex])),
                'bg-[#D8554D] text-white': index !== 0 && bottom2.includes(parseFloat(record[column.dataIndex])),
              }">
            <span class="grow text-center font-semibold">
              {{ record[column.dataIndex] || 0 }}
            </span>
            <img
              src="/chart.svg"
              alt="chart"
              v-if="index != 0"
              class="size-5 text-primary cursor-pointer"
              @click="router.push('/analytics')"
            />
          </div>
        </template>

        <template v-else-if="column.key === 'rating_share_percent'">
          <div class="text-center font-semibold" :class="{ italic: index === 0 }">
            <span>
              {{
                record[column.dataIndex] !== undefined &&
                record[column.dataIndex] !== null
                  ? parseFloat(record[column.dataIndex]).toFixed(1) + "%"
                  : "—"
              }}
            </span>
          </div>
        </template>
      </template>
    </TheTable>
  </div>
</template>

/* vazirlik faylida */
<style scoped>
/* Dastlabki ustunlar uchun */
::v-deep(th:nth-child(1)) {
  background-color: #c7d0e2 !important; /* № ustuni */
}

::v-deep(th:nth-child(2)) {
  background-color: #d1daec !important; /* Hudud nomi ustuni */
}

::v-deep(th:nth-child(3)) {
  background-color: #c7d0e2 !important; /* Biriktirilgan hodimlar soni ustuni */
}

::v-deep(th:nth-child(4)) {
  background-color: #d1daec !important; /* Umumiy reytingdagi hissasi (%) ustuni */
}

::v-deep(th:nth-child(5)) {
  background-color: #c7d0e2 !important; /* O'tgan oyning umumiy reytingdagi hissasi (%) ustuni */
}

::v-deep(th:nth-child(6)) {
  background-color: #d1daec !important; /* Farqi ustuni */
}

/* Dinamik ustunlar uchun (mavjud kod) */
::v-deep(th.group-1),
::v-deep(th.group-3),
::v-deep(th.group-5),
::v-deep(th.group-7),
::v-deep(th.group-9) {
  background-color: #c7d0e2 !important;
}

::v-deep(th.group-0),
::v-deep(th.group-2),
::v-deep(th.group-4),
::v-deep(th.group-6),
::v-deep(th.group-8) {
  background-color: #d1daec !important;
}

::v-deep(.ant-table-thead > tr > th) {
  position: sticky !important;
  top: 0 !important;
  z-index: 10 !important;
}

/* Yangi stil qoidalari: Jami qatoridagi matnni kursiv qilish */
/* Ant Design Table uchun eng samarali variant */
:deep(.ant-table-tbody tr:first-child td:nth-child(n + 3):nth-child(-n + 6)) {
  font-style: italic !important;
}
:deep(.ant-table-tbody tr:first-child td .text-left div) {
    font-style: italic !important;
}
</style>