<script lang="ts" setup>
import http from "@/libs/axios";
import { message } from "ant-design-vue";
import type { TableColumnsType } from "ant-design-vue";
import { useDateStore } from '@/stores/date'

const route = useRoute();
const store = useStore();
const dateStore = useDateStore();


const data = ref<any>([]);
const columns = ref<TableColumnsType>([]);
const baseColumns: TableColumnsType = [
  { title: "№", key: "index", dataIndex: "index", width: 30, align: "center" },
  {
    title: "Biriktirilgan hodimlar F.I.Sh.",
    dataIndex: "responsible_user_name",
    key: "responsible_user_name",
    align: "center",
    width: 180,
  },
];

const editableRow = ref<string | null>(null);
const container = ref();

const getValue = (record: any, column: any) => {
  if (!column?.dataIndex) return "";
  const [keyName, keyId] = column.dataIndex.split("_");
  const key = `${keyName}_${keyId}`;
  return record[key]?.[column.dataIndex] ?? "";
};

// fetch data
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
      index: index === 0 ? "—" : index,
      responsible_user_name: index === 0 ? "Jami" : item.responsible_user_name,
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
              "",
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

// save row new data
const saveEdit = async (
  event: Event,
  record: any,
  column: any
): Promise<void> => {
  try {
    const target = event.target as HTMLInputElement;

    const res = await http.put("/worker_indicator/upsert", {
      type: "DISTRICT", // DISTRICT/REGION
      district_id: Number(route.params.id),
      responsible_user_id: record.responsible_user_id,
      criteria_id: column.id,
      year: Number(route.query.year) || new Date().getFullYear(),
      month: Number(route.query.month) || new Date().getMonth() + 1,
      plan_amount: Number(target.value) || 0,
    });

    await fetchData();
    message.success("Reja saqlandi");
    editableRow.value = null;
  } catch (error) {
    console.error("Error saving data:", error);
    message.error("Rejani saqlashda xatolik");
  }
};

watch(() => [route.query, dateStore.selectedMonth], fetchData, { immediate: true });
</script>

<template>
  <TheBreadcrumb
    home="/manage/plan"
    :items="[
      {
        label: route.query.region,
        link: {
          path: `/manage/plan/${route.params.region}`,
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

  <div ref="container">
    <TheTable :columns="columns" :data-source="data" :pagination="false">
      <template #headerCell="{ title, column }">
        <template v-if="column.measurement_unit_title">
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
            column.dataIndex.includes('plan_amount') &&
            index !== 0
          "
        >
          <div v-if="editableRow == record.responsible_user_name + column.id">
            <a-input-number
              :value="getValue(record, column)"
              @keydown.enter=" ($event:Event) => saveEdit($event, record, column) "
              @blur="editableRow = null"
            />
          </div>
          <div
            v-else
            class="cursor-pointer"
            @click="editableRow = record.responsible_user_name + column.id"
          >
            {{ getValue(record, column) || 0 }}
          </div>
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