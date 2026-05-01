<script lang="ts" setup>
import http from "@/libs/axios";
import { ChartArea, ChevronsRight } from "lucide-vue-next";
import type { TableColumnsType } from "ant-design-vue";

const router = useRouter();
const route = useRoute();
const store = useStore();

const regions = ref<Region[]>([]);
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
const columnsVisible = ref<boolean>(false);

// fetch data & regions
const fetchRegions = async () => {
  try {
    const res = await http.get<Res<Region>>(`/region/list`);
    regions.value = [
      {} as Region,
      ...(res.data.data.results?.sort((a: any, b: any) => a.order - b.order) ||
        []),
    ];
  } catch (e) {
    console.log(e);
  }
};

const fetchData = async () => {
  try {
    const res = await http.get<Res<any>>(`/workers_kpi`, {
      params: {
        year: route.query.year || new Date().getFullYear(),
        month: route.query.month || new Date().getMonth() + 1,
        rank_id: 2,
      },
    });

    data.value = regions.value.map((item: any, index: number) => ({
      ...item,
      index: index === 0 ? "—" : index,
      region_id: item.id,
      region_name: index === 0 ? "Jami" : item.title,
    }));

    const hasChildren = (item: any, index: number) => {
      if (item.children) {
        return item.children.map((child: any) => ({
          ...child,
          key: "criteria",
          width: 120,
          align: "center",
          hideChildren: true,
          dataIndex:
            child.children.find((c: any) => c.title == "Reja").dataIndex || "",
          children: [
            {
              title: "reytingdagi xissasi (vazn 5%)",
              width: 120,
              align: "center",
              key: "rating_share_percent",
              dataIndex: `${
                child.children[0].dataIndex.split("_")[0]
              }_rating_share_percent`,
              customHeaderCell: () => ({
                class: `group-${index}`,
              }),
            },
          ],
          childrenBackup: [
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
              dataIndex: `${
                child.children[0].dataIndex.split("_")[0]
              }_rating_share_percent`,
              customHeaderCell: () => ({
                class: `group-${index}`,
              }),
            },
          ],
          customHeaderCell: () => ({
            class: `group-${index}`,
          }),
        }));
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

    res.data.data.data?.forEach((item: any, index: number) => {
      if (!item.region_name) {
        data.value[0] = { ...data.value[0], ...item };
        return;
      }

      if (index != 0) {
        const recordIndex = data.value.findIndex(
          (r: any) => r.region_name === item.region_name
        );

        if (recordIndex) {
          data.value[recordIndex] = { ...data.value[recordIndex], ...item };
        }
      }
    });
  } catch (e) {
    console.log(e);
  }
};

// const toggleCollapseTable = () => {
//   columnsVisible.value = !columnsVisible.value;

//   columns.value.forEach((col: any) => {
//     col.children?.forEach((child: any) => {
//       if (child.key === "criteria") {
//         child.hideChildren = columnsVisible.value;

//         if (child.hideChildren) {
//           child.childrenBackup = [...child.children];
//           child.children = [child.childrenBackup[3] ?? child.childrenBackup[0]];
//         } else {
//           child.children = [...child.childrenBackup];
//         }
//       }
//     });
//   });

//   table.value.updateScrollbar?.();
// };

onMounted(async () => {
  await fetchRegions();
  await fetchData();
});

watch(() => route.query, fetchData);
</script>

<template>
  <TheTable
    ref="table"
    :columns="columns"
    :data-source="data"
    :scroll="{ x: 'max-content', y: 'max-content' }"
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
                column.childrenBackup = [...column.children];
                column.children = [
                  column.childrenBackup[3] ?? column.childrenBackup[0],
                ];
              } else {
                column.children = [...column.childrenBackup];
              }

              table.updateScrollbar?.();
            }
          "
        >
          <ChevronsRight class="size-4" />
        </button>
      </template>
    </template>

    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'region_name'">
        <div class="text-left">
          <div
            v-if="index != 0"
            :class="{
              'text-cBlue font-bold ': store.canAccess({
                region_id: record.region_id,
              }),
            }"
          >
            {{
              record.region_name.includes("Respublikasi")
                ? record.region_name.split("Respublikasi")[0] + "Res"
                : record.region_name
            }}
          </div>
          {{ index === 0 ? "Jami" : "" }}
        </div>
      </template>

      <template v-else-if="column.key == 'total_share_percentage'">
        <div class="px-2 flex items-center justify-between gap-1">
          <span class="grow text-center font-semibold">
            {{ record[column.dataIndex] || 0 }}
          </span>
          <ChartArea
            v-if="index != 0"
            class="size-5 text-primary cursor-pointer"
            @click="router.push('/analytics')"
          />
        </div>
      </template>
    </template>

    <!-- <template #footer>
      <a-button class="the-button" type="primary" @click="toggleCollapseTable">
        {{ columnsVisible ? "Yopish" : "Yoyish" }}
      </a-button>
    </template> -->
  </TheTable>
</template>
