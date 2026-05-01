<!-- [id].vue -->
<script lang="ts" setup>
import http from "@/libs/axios";
import { ChartArea, ChevronsRight } from "lucide-vue-next";
import type { TableColumnsType } from "ant-design-vue";
import { useDateStore } from '@/stores/date'

const router = useRouter();
const route = useRoute();
const store = useStore();
const dateStore = useDateStore()

const table = ref();
const data = ref<any>([]);
const columns = ref<TableColumnsType>([]);
const baseColumns: TableColumnsType = [
  {
    title: "№",
    key: "index",
    dataIndex: "index",
    width: 30,
    align: "center",
    customRender: ({ index }) => (index === 0 ? "-" : index),
  },
  {
    title: "Biriktirilgan hodimlar F.I.Sh.",
    dataIndex: "responsible_user_name",
    key: "responsible_user_name",
    align: "center",
    width: 180,
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

const container = ref();

// fetch data
const fetchData = async (): Promise<void> => {
  try {
    const res_plan = await http.get<Res<any>>(
      `/workers_kpi/district/${route.params.id}`,
      {
        params: {
          year: route.query.year || new Date().getFullYear(),
          month: dateStore.selectedMonth || new Date().getMonth() + 1,
          rank_id: 3,
        },
      }
    );

    console.log("=== [ID].VUE SERVER MA'LUMOTLARI ===");
    console.log("res_plan.data.data:", res_plan.data.data);
    console.log("res_plan.data.data.data:", res_plan.data.data.data);

    data.value = res_plan.data.data.data.map((item: any, index: number) => ({
      ...item,
      index: index === 0 ? "—" : index,
      responsible_user_name: index === 0 ? "Jami" : item.responsible_user_name,
    }));

    console.log("=== [ID].VUE DATA.VALUE ===");
    console.log("data.value:", data.value);

    const hasChildren = (item: any, index: number) => {
      if (item.children) {
        return item.children.map((child: any) => {
          // Rating share percent uchun dataIndex ni to'g'ri hosil qilish
          const baseDataIndex = child.children?.[0]?.dataIndex || '';
          const ratingShareDataIndex = baseDataIndex.replace(/_plan_amount$|_execution_amount$|_execution_percent$/, '_rating_share_percent');
          
          console.log(`[ID].VUE Child: ${child.title}, baseDataIndex: ${baseDataIndex}, ratingShareDataIndex: ${ratingShareDataIndex}`);
          
          return {
            ...child,
            key: "criteria",
            width: 120,
            align: "center",
            hideChildren: true,
            dataIndex: child.children.find((c: any) => c.title == "Reja").dataIndex || "",
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
      ...res_plan.data.data.columns.map((item: any, index: number) => ({
        ...item,
        width: 120,
        align: "center",
        children: hasChildren(item, index),
        customHeaderCell: () => ({
          class: `group-${index}`,
        }),
      })),
    ];

    console.log("=== [ID].VUE COLUMNS ===");
    console.log("columns.value:", columns.value);

    // Rating share percent qiymatlarini tekshirish
    console.log("=== [ID].VUE BARCHA USTUNLAR TEKSHIRUVI ===");
    data.value.forEach((item: any, index: number) => {
      console.log(`\n[ID].VUE Qator ${index} (${item.responsible_user_name}):`);
      console.log("Item structure:", item);
      Object.keys(item).forEach(key => {
        if (key.includes('rating_share_percent') || key.includes('plan_amount') || key.includes('execution_amount') || key.includes('execution_percent')) {
          console.log(`  ${key}: ${item[key]}`);
        }
      });
      
      // Nested object'larni ham tekshirish
      if (index !== 0) {
        console.log(`  Nested objects:`);
        Object.keys(item).forEach(key => {
          if (typeof item[key] === 'object' && item[key] !== null && !Array.isArray(item[key])) {
            console.log(`    ${key}:`, item[key]);
          }
        });
      }
    });

    // Columns tuzilishini tekshirish
    console.log("=== [ID].VUE COLUMNS TUZILISHI ===");
    columns.value.forEach((col: any, index: number) => {
      if (col.children) {
        console.log(`Column ${index} (${col.title}):`);
        col.children.forEach((child: any, childIndex: number) => {
          console.log(`  Child ${childIndex}:`, {
            title: child.title,
            key: child.key,
            dataIndex: child.dataIndex
          });
        });
      }
    });

  } catch (e) {
    console.log(e);
  }
};

watch(() => [route.query, dateStore.selectedMonth], fetchData, { immediate: true });
</script>

<template>
  <div class="mt-2 w-full flex flex-col gap-4 overflow-x-hidden" ref="container">
    <TheBreadcrumb
      home="/efficiency/district"
      :items="[
        {
          label: route.query.region,
          link: {
            path: `/efficiency/district/${route.params.region}`,
            query: {
              region: route.query.region,
            },
          },
        },
        {
          label: route.query.district,
        },
      ]"
    />

    <TheTable
      ref="table"
      :columns="columns"
      :data-source="data"
      :sticky="{ offsetHeader: 0 }"
      :pagination="false"
      class="px-9"
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
        <template v-else>
          {{ title == "Ijro" ? "Amalda" : title }}
        </template>
      </template>

      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'responsible_user_name'">
          <div class="text-left">
            <div v-if="index != 0">
              <a-popover
                v-if="
                  store.user?.role != 'WORKER' ||
                  (store.user?.role == 'WORKER' &&
                    record.responsible_user_id == store.user?.id)
                "
                v-model:open="record.open"
                trigger="click"
                placement="right"
                :zIndex="3"
                :getPopupContainer="() => container"
              >
                <template #content>
                  <TheUserInfo
                    v-model:open="record.open"
                    :id="record.responsible_user_id"
                  />
                </template>

                <span class="text-cBlue font-bold cursor-pointer">
                  {{ record.responsible_user_name }}
                </span>
              </a-popover>

              <template v-else>
                {{ record.responsible_user_name }}
              </template>
            </div>
            {{ index === 0 ? "Jami" : "" }}
          </div>
        </template>

        <template v-else-if="column.key == 'total_share_percentage'">
          <div class="px-2 flex items-center justify-between gap-1">
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

        <!-- Rating share percent ustuni -->
        <template v-else-if="column.key === 'rating_share_percent'">
  <div class="text-center font-semibold">
    <span>
      {{
        getNestedValue(record, column.dataIndex) !== null
          ? parseFloat(getNestedValue(record, column.dataIndex)).toFixed(1) + '%'
          : '0.0%'
      }}
    </span>
  </div>
</template>

        <!-- Reja ustuni (plan_amount) -->
        <template
          v-else-if="
            column.dataIndex &&
            column.dataIndex.includes('plan_amount')
          "
        >
          <div class="text-center">
            <span v-if="index === 0">
              {{ record[column.dataIndex] || 0 }}
            </span>
            <span v-else>
              {{ getNestedValue(record, column.dataIndex) || 0 }}
            </span>
          </div>
        </template>

        <!-- Amalda ustuni (execution_amount) -->
        <template
          v-else-if="
            column.dataIndex &&
            column.dataIndex.includes('execution_amount')
          "
        >
          <div class="text-center">
            <span v-if="index === 0">
              {{ record[column.dataIndex] || 0 }}
            </span>
            <span v-else>
              {{ getNestedValue(record, column.dataIndex) || 0 }}
            </span>
          </div>
        </template>

        <!-- Ijro % ustuni (execution_percent) -->
        <template
          v-else-if="
            column.dataIndex &&
            column.dataIndex.includes('execution_percent')
          "
        >
          <div class="text-center">
            <span v-if="index === 0">
              {{ record[column.dataIndex] || 0 }}%
            </span>
            <span v-else>
              {{ 
                getNestedValue(record, column.dataIndex) !== null 
                  ? (parseFloat(getNestedValue(record, column.dataIndex)).toFixed(1) + '%')
                  : '0.0%' 
              }}
            </span>
          </div>
        </template>
      </template>
    </TheTable>
  </div>
</template>

<script lang="ts">
// Helper function to get nested values
const getNestedValue = (obj: any, path: string): any => {
  if (!path || !obj) return null;
  
  // path misoli: "malumotlar_bazasi_plan_amount"
  const pathParts = path.split('_');
  
  // Birinchi qismni topish (masalan: "malumotlar")
  const firstPart = pathParts[0];
  
  // Agar obj[firstPart] mavjud bo'lsa, undan qiymat olish
  if (obj[firstPart] && typeof obj[firstPart] === 'object') {
    return obj[firstPart][path];
  }
  
  // Agar to'g'ridan-to'g'ri path mavjud bo'lsa
  if (obj[path] !== undefined) {
    return obj[path];
  }
  
  // Boshqa variant: nested object'larda qidirish
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      if (obj[key][path] !== undefined) {
        return obj[key][path];
      }
    }
  }
  
  return null;
};
</script>

<style scoped>
/* Dastlabki ustunlar uchun */
::v-deep(th:nth-child(1)) {
  background-color: #C7D0E2 !important; /* № ustuni */
}

::v-deep(th:nth-child(2)) {
  background-color: #D1DAEC !important; /* Hudud nomi ustuni */
}

::v-deep(th:nth-child(3)) {
  background-color: #C7D0E2 !important; /* Biriktirilgan hodimlar soni ustuni */
}

::v-deep(th:nth-child(4)) {
  background-color: #D1DAEC !important; /* Umumiy reytingdagi hissasi (%) ustuni */
}

::v-deep(th:nth-child(5)) {
  background-color: #C7D0E2 !important; /* O'tgan oyning umumiy reytingdagi hissasi (%) ustuni */
}

::v-deep(th:nth-child(6)) {
  background-color: #D1DAEC !important; /* Farqi ustuni */
}

/* Dinamik ustunlar uchun (mavjud kod) */
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