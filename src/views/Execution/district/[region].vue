<script lang="ts" setup>
import http from "@/libs/axios";
import type { TableColumnsType } from "ant-design-vue";
import { useDateStore } from '@/stores/date'


const router = useRouter();
const route = useRoute();
const store = useStore();
const dateStore = useDateStore()

const districts = ref<District[]>([]);
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
      `/worker_indicator/region/${route.params.region}`,
      {
        params: {
          year: route.query.year || new Date().getFullYear(),
          month: dateStore.selectedMonth || new Date().getMonth() + 1,
          rank_id: 3,
        },
      }
    );

    data.value = districts.value.map((item: any, index: number) => ({
      ...item,
      index: index === 0 ? "—" : index,
      district_id: item.id,
      district_name: index === 0 ? "Jami" : item.title,
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
          (r: any) => r.district_name === item.region_name
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
  await fetchDistricts();
  await fetchData();
});

watch(() => [route.query, dateStore.selectedMonth], fetchData);
</script>

<template>
  <div class="w-full flex flex-col gap-4 overflow-x-hidden">
    <TheBreadcrumb
      home="/execution/district"
      :items="[
        {
          label: route.query.region,
        },
      ]"
    />

    <TheTable :columns="columns" :data-source="data" :sticky="{ offsetHeader: 0 }" :pagination="false" class="px-9">
      <template #headerCell="{ title, column }">
        <template v-if="title == 'Ijro'">Ijro</template>
        <template v-else>
          {{ title }}
          <div v-if="column.measurement_unit_title" style="font-weight: 400">
            ({{ column.measurement_unit_title }})
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
                      path: `/execution/district/${route.params.region}/${record.district_id}`,
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
            <div v-if="index != 0" class="text-cBlue font-bold" to="/">
              {{ record.responsible_user_name }}
            </div>
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
  </div>
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