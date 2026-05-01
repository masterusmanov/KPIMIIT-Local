<script lang="ts" setup>
import http from "@/libs/axios";
import { ChartArea, ChevronsRight } from "lucide-vue-next";
import type { TableColumnsType } from "ant-design-vue";

const router = useRouter();
const route = useRoute();
const store = useStore();

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
          month: route.query.month || new Date().getMonth() + 1,
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

watch(() => route.query, fetchData, { immediate: true });
</script>

<template>
  <div class="mt-2 w-full flex flex-col gap-4" ref="container">
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
            <ChartArea
              v-if="index != 0"
              class="size-5 text-primary cursor-pointer"
              @click="router.push('/analytics')"
            />
          </div>
        </template>

        <template
          v-else-if="
            column.dataIndex &&
            column.dataIndex.includes('plan_amount') &&
            index !== 0
          "
        >
          {{ record[column.dataIndex.split("_")[0]]?.[column.dataIndex] }}
        </template>

        <template
          v-else-if="
            column.dataIndex &&
            column.dataIndex.includes('execution_amount') &&
            index !== 0
          "
        >
          {{ record[column.dataIndex.split("_")[0]]?.[column.dataIndex] }}
        </template>

        <template
          v-else-if="
            column.dataIndex &&
            column.dataIndex.includes('execution_percent') &&
            index == 0
          "
        >
          {{ record[column.dataIndex] }}
        </template>

        <template
          v-else-if="
            column.dataIndex &&
            column.dataIndex.includes('execution_percent') &&
            index != 0
          "
        >
          {{ record[column.dataIndex.split("_")[0]]?.[column.dataIndex] || 0 }}
        </template>

        <template
          v-else-if="
            column.dataIndex &&
            column.dataIndex.includes('rating_share_percent') &&
            index == 0
          "
        >
          {{ record[column.dataIndex] || 0 }}
        </template>

        <template
          v-else-if="
            column.dataIndex &&
            column.dataIndex.includes('rating_share_percent') &&
            index != 0
          "
        >
          {{ record[column.dataIndex.split("_")[0]]?.[column.dataIndex] || 0 }}
        </template>
      </template>
    </TheTable>
  </div>
</template>
