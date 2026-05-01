<script lang="ts" setup>
import http from "@/libs/axios";
import { message } from "ant-design-vue";
import type { TableColumnsType } from "ant-design-vue";
import { useDateStore } from '@/stores/date'

const router = useRouter();
const route = useRoute();
const store = useStore();
const dateStore = useDateStore();


const regions = ref<Region[]>([]);
const data = ref<any>([]);
const columns = ref<TableColumnsType>([]);
const baseColumns: TableColumnsType = [
  {
    title: "№",
    key: "index",
    dataIndex: "index",
    width: 35,
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

// fetch regions & data
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
    const res = await http.get<Res<any>>(`/worker_indicator`, {
      params: {
        year: route.query.year || new Date().getFullYear(),
        month: dateStore.selectedMonth || new Date().getMonth() + 1,
        rank_id: 3,
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
        return item.children
          .filter((_item: any) => _item.title != "Ijro")
          .map((child: any) => ({
            ...child,
            width: 120,
            align: "center",
            dataIndex:
              child.children.find((c: any) => c.title == "Reja").dataIndex ||
              null,
            children: [],
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

onMounted(async () => {
  await fetchRegions();
  await fetchData();
});

watch(() => [route.query, dateStore.selectedMonth], fetchData);
</script>

<template>
  <TheTable :columns="columns" :data-source="data" :pagination="false" class="px-8 overflow-x-hidden">
    <template #headerCell="{ title, column }">
      <template
        v-if="column.dataIndex && column.dataIndex.includes('plan_amount')"
      >
        {{ title }} <br />
        <div v-if="column.measurement_unit_title" style="font-weight: 400">
          ({{ column.measurement_unit_title }})
        </div>
      </template>
    </template>

    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'region_name'">
        <div class="text-left">
          <div
            v-if="index != 0"
            :class="{
              'text-cBlue font-bold cursor-pointer underline': store.canAccess({
                region_id: record.region_id,
              }),
            }"
            @click="
              () => {
                if (store.canAccess({ region_id: record.region_id })) {
                  router.push({
                    path: `/manage/plan/${record.region_id}`,
                    query: {
                      ...route.query,
                      region: record.region_name,
                    },
                  });
                }
              }
            "
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
    </template>
  </TheTable>
</template>

<style scoped>
::v-deep(th:nth-child(1)) {
  background-color: #C7D0E2 !important; /* № ustuni */
}

::v-deep(th:nth-child(2)) {
  background-color: #D1DAEC !important; /* Hudud nomi ustuni */
}

::v-deep(th:nth-child(3)) {
  background-color: #C7D0E2 !important; /* Biriktirilgan hodimlar soni ustuni */
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