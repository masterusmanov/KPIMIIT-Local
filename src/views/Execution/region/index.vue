<script lang="ts" setup>
import http from "@/libs/axios";
import type { TableColumnsType } from "ant-design-vue";

const router = useRouter();
const route = useRoute();
const store = useStore();

const regions = ref<Region[]>([]);
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
];

// fetch data & regions
const fetchRegions = async () => {
  try {
    const res = await http.get<Res<Region>>("/region/list");
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
    const res = await http.get<Res<any>>("/worker_indicator", {
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
          width: 100,
          align: "center",
          children: hasChildren(child, index),
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
        width: 100,
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

watch(() => route.query, fetchData);
</script>

<template>
  <TheTable
    :columns="columns"
    :data-source="data"
    :scroll="{ x: 'max-content', y: 'max-content' }"
    :pagination="false"
  >
    <template #headerCell="{ title, column }">
      <template v-if="title == 'Ijro'">Amalda</template>
      <template v-else>
        {{ title }}
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

      <template
        v-else-if="
          column.dataIndex && column.dataIndex.includes('execution_amount')
        "
      >
        {{ record[column.dataIndex] }}
      </template>
    </template>
  </TheTable>
</template>
