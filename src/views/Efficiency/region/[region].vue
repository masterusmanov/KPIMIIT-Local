<!-- [region].vue -->
<script lang="ts" setup>
import http from "@/libs/axios";
import { ChartArea, ChevronsRight, ArrowUp, ArrowDown } from "lucide-vue-next";
import type { TableColumnsType } from "ant-design-vue";
import { useDateStore } from "@/stores/date";

const router = useRouter();
const route = useRoute();
const store = useStore();
const dateStore = useDateStore();
const top2: Ref<number[]> = ref([]);
const bottom2: Ref<number[]> = ref([]);
const totalShareSortOrder: Ref<"asc" | "desc" | null> = ref(null);

const districts = ref<District[]>([]);
const table = ref();
const data = ref<any>([]);
const columns = ref<TableColumnsType>([]);
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
    width: 100,
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
          month: dateStore.selectedMonth || new Date().getMonth() + 1,
          rank_id: 3,
        },
      }
    );

    console.log("=== SERVER MA'LUMOTLARI ===");
    console.log("res.data.data:", res.data.data);
    console.log("res.data.data.data:", res.data.data.data);

    console.log("=== DISTRICTS MA'LUMOTLARI ===");
    console.log("districts.value:", districts.value);

    data.value = districts.value.map((item: any, index: number) => ({
      ...item,
      index: index === 0 ? "—" : index,
      district_id: item.id,
      district_name: index === 0 ? "Jami" : item.title,
    }));

    console.log("=== DASTLABKI DATA.VALUE ===");
    console.log("data.value:", data.value);

    const hasChildren = (item: any, index: number) => {
      if (item.children) {
        return item.children.map((child: any) => {
          // Rating share percent uchun dataIndex ni to'g'ri hosil qilish
          const baseDataIndex = child.children?.[0]?.dataIndex || "";
          const ratingShareDataIndex = baseDataIndex.replace(
            /_plan_amount$|_execution_amount$|_execution_percent$/,
            "_rating_share_percent"
          );

          console.log(
            `Child: ${child.title}, baseDataIndex: ${baseDataIndex}, ratingShareDataIndex: ${ratingShareDataIndex}`
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
                width: 60,
                align: "center",
                customHeaderCell: () => ({
                  class: `group-${index}`,
                }),
              })),
              {
                title: "",
                width: 80,
                align: "center",
                key: "rating_share_percent",
                dataIndex: ratingShareDataIndex,
                customHeaderCell: () => ({
                  style: {
                    padding: "8px 4px",
                  },
                  class: `group-${index}`,
                  innerHTML: `
                    <div style="display: flex; flex-direction: column; align-items: center;">
                      <span>reytingdagi xissasi</span>
                      <span style="font-size: 0.9em">(vazn 5%)</span>
                    </div>
                  `,
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

    console.log("=== SERVER MA'LUMOTLARINI BIRLASHTIRISH ===");

    // Barcha server ma'lumotlarini ko'rish
    console.log("Barcha server ma'lumotlari:");
    (res.data.data.data as any[])?.forEach((item, index) => {
      console.log(`Item ${index}:`, {
        region_name: item.region_name,
        hasRegionName: !!item.region_name,
        keys: Object.keys(item).length,
      });
    });

    // "Jami" qatorini topish (region_name bo'sh yoki undefined bo'lgan)
    const jamiData = res.data.data.data?.find(
      (item: any) =>
        !item.region_name ||
        item.region_name === "" ||
        item.region_name === null
    );
    console.log("Jami ma'lumoti topildimi?", !!jamiData);
    console.log("Jami ma'lumoti:", jamiData);

    // Asosiy birlashtirish jarayoni
    res.data.data.data?.forEach((serverItem: any, index: number) => {
      if (
        !serverItem.region_name ||
        serverItem.region_name === "" ||
        serverItem.region_name === null
      ) {
        console.log(`\n=== JAMI QATORI YANGILANMOQDA (Item ${index}) ===`);
        console.log("Serverdan kelgan Jami ma'lumoti:", serverItem);

        // Jami qatorini yangilash
        console.log("Avvalgi data.value[0]:", data.value[0]);
        data.value[0] = { ...data.value[0], ...serverItem };
        console.log("Yangilangan data.value[0]:", data.value[0]);

        // Rating qiymatlarini ko'rish
        console.log("Jami qatoridagi rating_share_percent qiymatlari:");
        Object.keys(serverItem).forEach((key) => {
          if (key.includes("rating_share_percent")) {
            console.log(`${key}: ${serverItem[key]}`);
          }
        });
      } else {
        // Region ma'lumotlari uchun
        const recordIndex = data.value.findIndex(
          (dataItem: any) => dataItem.title === serverItem.region_name
        );

        if (recordIndex !== -1) {
          console.log(
            `Region "${serverItem.region_name}" yangilanmoqda, index: ${recordIndex}`
          );
          data.value[recordIndex] = {
            ...data.value[recordIndex],
            ...serverItem,
          };

          // Bu region uchun rating_share_percent qiymatlarini ko'rish
          console.log(
            `"${serverItem.region_name}" ning rating_share_percent qiymatlari:`
          );
          Object.keys(serverItem).forEach((key) => {
            if (key.includes("rating_share_percent")) {
              console.log(`${key}: ${serverItem[key]}`);
            }
          });
        } else {
          console.log(
            `Region "${serverItem.region_name}" data.value da topilmadi`
          );
        }
      }
    });

    const jamiRow = data.value[0];
    let sortableData = data.value.slice(1); // Jami qatoridan keyingi elementlar

    if (totalShareSortOrder.value === "asc") {
      sortableData.sort((a: any, b: any) => {
        const valA = parseFloat(a.total_share_percentage) || 0;
        const valB = parseFloat(b.total_share_percentage) || 0;
        return valA - valB;
      });
    } else if (totalShareSortOrder.value === "desc") {
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

    // --- BU YERGA QO'YISH KERAK! ---
    // data.value massivi to'ldirilgandan va birlashtirilgandan keyin quyidagi kodni qo'shing
    const percentages = data.value
      .filter(
        (item: any, index: number) =>
          index !== 0 &&
          item.total_share_percentage !== undefined &&
          item.total_share_percentage !== null
      )
      .map((item: any) => parseFloat(item.total_share_percentage));

    if (percentages.length > 0) {
      // Eng yaxshi yechim - Set uchun generic tipni belgilash
      const sortedUniquePercentages = [...new Set<number>(percentages)].sort(
        (a, b) => a - b
      );

      bottom2.value = sortedUniquePercentages.slice(
        0,
        Math.min(2, sortedUniquePercentages.length)
      );
      top2.value = sortedUniquePercentages.slice(
        Math.max(0, sortedUniquePercentages.length - 2)
      );
    } else {
      top2.value = [];
      bottom2.value = [];
    }
    // --- SHU YERDA TUGAYDI! ---

    console.log("=== YAKUNIY TEKSHIRUV ===");
    console.log("Final data.value[0] (Jami qatori):", data.value[0]);
    console.log("Jami qatoridagi rating_share_percent qiymatlari:");
    Object.keys(data.value[0]).forEach((key) => {
      if (key.includes("rating_share_percent")) {
        console.log(`${key}: ${data.value[0][key]}`);
      }
    });

    // Barcha qatorlardagi rating_share_percent qiymatlarini tekshirish
    console.log("=== BARCHA QATORLAR TEKSHIRUVI ===");
    data.value.forEach((item: any, index: number) => {
      console.log(`\nQator ${index} (${item.district_name}):`);
      Object.keys(item).forEach((key) => {
        if (key.includes("rating_share_percent")) {
          console.log(`   ${key}: ${item[key]}`);
        }
      });
    });

    // Columns dan rating_share_percent ustunlarini tekshirish
    console.log("=== COLUMNS TEKSHIRUVI ===");
    columns.value.forEach((col: any, index: number) => {
      if (col.children) {
        col.children.forEach((child: any) => {
          if (child.key === "rating_share_percent") {
            console.log(`Column ${index}, Child dataIndex: ${child.dataIndex}`);
          }
        });
      }
    });

    console.log("=== YAKUNIY NATIJA ===");
    console.log("Final data.value:", data.value);
  } catch (e) {
    console.log(e);
  }
};

onMounted(async () => {
  await fetchDistricts();
  await fetchData();
});

watch(() => [route.query, dateStore.selectedMonth], fetchData);
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
        <template
          v-if="column.dataIndex && column.dataIndex.includes('plan_amount')"
        >
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
                @click="
                  totalShareSortOrder = null;
                  fetchData();
                "
                class="text-[16px] font-bold text-red-500 hover:underline mt-1"
              >
                ⨉
              </button>
            </div>
            <div class="flex items-center gap-2">
              <span>{{ title }}</span>
              <div class="w-full">
                <button
                  @click="
                    totalShareSortOrder = 'desc';
                    fetchData();
                  "
                  :class="{ 'text-blue-500': totalShareSortOrder === 'desc' }"
                  class="mx-auto flex items-center justify-center rounded-sm text-[#8A8A8A] hover:text-gray-700"
                >
                  ▲
                </button>
                <button
                  @click="
                    totalShareSortOrder = 'asc';
                    fetchData();
                  "
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
            <div
              v-if="index != 0"
              class="text-cBlue font-bold"
              to="/"
              :class="{ italic: index === 0 }"
            >
              {{ record.responsible_user_name }}
            </div>
          </div>
        </template>

        <template v-else-if="column.key == 'total_share_percentage'">
          <div
            class="px-2 flex items-center justify-between gap-1"
            :class="{
              'bg-[#00C564] text-white':
                index !== 0 &&
                top2.includes(parseFloat(record[column.dataIndex])),
              'bg-[#D8554D] text-white':
                index !== 0 &&
                bottom2.includes(parseFloat(record[column.dataIndex])),
            }"
          >
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
          <div
            class="text-center font-semibold"
            :class="{ italic: index === 0 }"
          >
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
/* VARIANT 1: Ant Design Table uchun */
.ant-table-tbody tr.total-row td:nth-child(3),
.ant-table-tbody tr.total-row td:nth-child(4),
.ant-table-tbody tr.total-row td:nth-child(5),
.ant-table-tbody tr.total-row td:nth-child(6) {
  font-style: italic !important;
}

/* VARIANT 2: Umumiy jadval uchun */
table tbody tr.total-row td:nth-child(n + 3):nth-child(-n + 6) {
  font-style: italic;
}

/* VARIANT 3: Jami qator va 3-6 ustunlar */
.table-total-row .col-3,
.table-total-row .col-4,
.table-total-row .col-5,
.table-total-row .col-6 {
  font-style: italic;
}

/* VARIANT 4: CSS-in-JS yoki Vue style binding uchun */
.total-row-italic {
  font-style: italic;
}

/* VARIANT 5: Ant Design Table customRow bilan */
.ant-table-row-total .ant-table-cell:nth-child(3),
.ant-table-row-total .ant-table-cell:nth-child(4),
.ant-table-row-total .ant-table-cell:nth-child(5),
.ant-table-row-total .ant-table-cell:nth-child(6) {
  font-style: italic;
}

/* VARIANT 6: Scoped CSS bilan (Vue component ichida) */
::v-deep(.ant-table-tbody tr.total-row td:nth-child(n + 3):nth-child(-n + 6)) {
  font-style: italic;
}

/* VARIANT 7: Modern Vue 3 deep selector */
:deep(.ant-table-tbody tr.total-row td:nth-child(n + 3):nth-child(-n + 6)) {
  font-style: italic;
}
</style>
