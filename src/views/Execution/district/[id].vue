<script lang="ts" setup>
import http from "@/libs/axios";
import type { TableColumnsType } from "ant-design-vue";
import { useDateStore } from '@/stores/date'

const router = useRouter();
const route = useRoute();
const store = useStore();
const dateStore = useDateStore()

const data = ref<any>([]);
const columns = ref<TableColumnsType>([]);
const baseColumns: TableColumnsType = [
  {
    title: "№",
    key: "index",
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
];

const container = ref();

const fetchData = async (): Promise<void> => {
  try {
    const res_plan = await http.get<Res<any>>(
      `/worker_indicator/district/${route.params.id}`,
      {
        params: {
          year: route.query.year || new Date().getFullYear(),
          month: dateStore.selectedMonth || new Date().getMonth() + 1,
          rank_id: 3,
        },
      }
    );

    data.value = res_plan.data.data.data.map((item: any, index: number) => ({
      ...item,
      responsible_user_name: index === 0 ? "Jami" : item.responsible_user_name,
    }));

    const hasChildren = (item: any, index: number) => {
      if (item.children) {
        return item.children.map((child: any) => ({
          ...child,
          width: 120,
          align: "center",
          parent_title: item.title,
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
  } catch (e) {
    console.log(e);
  }
};

const getValue = (record: any, column: any, columnKey?: string) => {
  if (!column?.dataIndex) return "";
  const dataIndex = Array.isArray(column.dataIndex)
    ? column.dataIndex.join(".")
    : column.dataIndex;

  if (columnKey) {
    return record?.[dataIndex]?.[columnKey] ?? "";
  }

  if (record?.[dataIndex] !== undefined) {
    return record[dataIndex];
  }

  const [keyName, keyId] = dataIndex.split("_");
  const key = `${keyName}_${keyId}`;
  return record?.[key]?.[dataIndex] ?? "";
};

watch(() => [route.query, dateStore.selectedMonth], fetchData, { immediate: true });
</script>

<template>
  <div class="w-full flex flex-col gap-4 overflow-x-hidden" ref="container">
    <TheBreadcrumb
      home="/execution/district"
      :items="[
        {
          label: route.query.region,
          link: {
            path: `/execution/district/${route.params.region}`,
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

        <template
          v-else-if="
            column.dataIndex &&
            column.dataIndex.includes('execution_amount') &&
            record[
              column.dataIndex.split('_')[0] +
                '_' +
                column.dataIndex.split('_')[1]
            ] &&
            index !== 0
          "
        >
          <div
            :class="{
              'text-red-500':
                getValue(record, column, 'docs_status') == 'CANCELED',
              'text-green-500':
                getValue(record, column, 'docs_status') == 'APPROVED',
              'text-cBlue font-bold cursor-pointer underline':
                store.user?.role != 'WORKER' ||
                (store.user?.role == 'WORKER' &&
                  record.responsible_user_id == store.user?.id),
              'text-current':
                store.user?.role == 'WORKER' &&
                record.responsible_user_id !== store.user?.id,
            }"
            @click="
              () => {
                if (
                  store.user?.role != 'WORKER' ||
                  (store.user?.role == 'WORKER' &&
                    record.responsible_user_id == store.user?.id)
                ) {
                  router.push({
                    path: `/execution/${
                      record[
                        column.dataIndex.split('_')[0] +
                          '_' +
                          column.dataIndex.split('_')[1]
                      ]?.id
                    }`,
                    query: {
                      ...route.query,
                      region_id: route.params.region,
                      district_id: route.params.id,
                      user: record.responsible_user_name,
                      criteria: column.parent_title,
                    },
                  });
                }
              }
            "
          >
            {{ getValue(record, column) || 0 }}
          </div>
        </template>

        <template
          v-else-if="
            column.dataIndex &&
            column.dataIndex.includes('plan_amount') &&
            index !== 0
          "
        >
          {{ getValue(record, column) }}
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