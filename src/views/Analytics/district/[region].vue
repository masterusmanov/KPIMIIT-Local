<script lang="ts" setup>
import http from "@/libs/axios";
import { ChartArea, ChevronsRight } from "lucide-vue-next";
import type { TableColumnsType } from "ant-design-vue";

const router = useRouter();
const route = useRoute();
const store = useStore();

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
      `/district_workers/kpi/region/${route.params.region}?year=${
        route.query.year || new Date().getFullYear()
      }&month=${route.query.month || new Date().getMonth() + 1}`
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

watch(() => route.query, fetchData);
</script>

<template>
  <div class="w-full flex flex-col gap-4">
    <TheBreadcrumb
      home="/efficiency/district"
      :items="[{ label: route.query.region }]"
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
            <div v-if="index != 0" class="text-cBlue font-bold" to="/">
              {{ record.responsible_user_name }}
            </div>
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
    </TheTable>
  </div>
</template>
