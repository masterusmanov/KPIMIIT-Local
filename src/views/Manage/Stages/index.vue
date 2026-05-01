<script lang="ts" setup>
import http from "@/libs/axios";
import { message } from "ant-design-vue";
import type { TableColumnsType } from "ant-design-vue";
import locale from "ant-design-vue/es/date-picker/locale/ru_RU";

const router = useRouter();
const route = useRoute();
const store = useStore();

const table = reactive({
  total: 0,
  start_date: null,
  end_date: null,
});
const data = ref<any>([
  // {
  //   id: 97,
  //   title: "test 5",
  //   rank_id: 3,
  //   stage_id: 1,
  //   stage_title: "Loyiha takliflarini shakllantirish",
  //   measurement_unit_id: null,
  //   measurement_unit_title: null,
  //   weight_r: 0,
  //   weight_r1: 0,
  //   weight_r2: 0,
  //   weight_v: 0,
  //   weight_v1: 0,
  //   weight_v2: 0,
  //   weight_h: 0,
  //   weight_h1: 0,
  //   weight_h2: 0,
  //   director_position_id: null,
  //   allowed_worker_ids: [],
  //   children_ids: [],
  //   workers_hierarchy: [
  //     {
  //       id: 2,
  //       name: "Someone Famous",
  //       children: [
  //         {
  //           id: 3,
  //           name: "Famous Someone",
  //         },
  //         {
  //           id: 4,
  //           name: "Famous Someone 2",
  //         },
  //       ],
  //     },
  //     {
  //       id: 5,
  //       name: "Someone Famous 3",
  //       children: [],
  //     },
  //   ],
  //   status: true,
  //   end_date: null,
  //   created_at: "04.04.2025 10:41:21",
  //   created_by: null,
  //   updated_at: null,
  //   updated_by: null,
  // },
]);
const columns = ref<TableColumnsType>([
  {
    title: "№",
    dataIndex: "index",
    key: "index",
    align: "center",
    width: 50,
  },
  {
    title: "Nomi",
    dataIndex: "title",
    key: "title",
    align: "center",
    // width: 220,
    customRender: ({ record }: any) =>
      h("div", { class: "text-left" }, record.title),
  },
  {
    title: "Pog'ona",
    dataIndex: "rank_ids",
    key: "rank_ids",
    align: "center",
    // width: 70,
    customRender: ({ record }: any) =>
      h(
        "div",
        { class: "text-left" },
        record.rank_ids
          .map((id: any) => store.ranks.find((r: any) => r.id === id)?.title)
          .join(", ")
      ),
  },
  {
    title: "Viloyat o'rinbosari",
    dataIndex: "responsible_user_name",
    key: "responsible_user_name",
    align: "center",
    customRender: ({ record }: any) =>
      h("div", { class: "text-left" }, record.responsible_user_name),
  },
  {
    title: "Boshlanish sanasi",
    dataIndex: "created_at",
    key: "created_at",
    align: "center",
    width: 160,
  },
  {
    title: "Tugash sanasi",
    dataIndex: "end_date",
    key: "end_date",
    align: "center",
    width: 160,
  },
  { title: "Harakatlar", align: "center", width: 100, key: "actions" },
]);

const modal = reactive({
  open: false,
  type: "create",
  stage: {} as Stage,
});

const handleDateChange = (date: Date | null, key: string) => {
  if (!date) {
    // If no date is selected, remove the query parameter
    const { [key]: removed, ...newQuery } = route.query;
    router.push({ query: newQuery });
    return;
  }

  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  // Format the date and update the query
  router.push({
    query: { ...route.query, [key]: `${year}-${month}-${day}` },
  });
};

const fetchStages = async (): Promise<void> => {
  try {
    const params: any = { limit: 10, page: route.query.page || 1 };

    if (route.query.start_date) params.start_date = route.query.start_date;
    if (route.query.end_date) params.end_date = route.query.end_date;

    const res = await http.get<Res<Criterion>>(
      `/investment_process_stage/list`,
      { params }
    );

    table.total = res.data.data?.count || 0;
    data.value =
      res.data.data?.results?.map((item: any, index: number) => ({
        ...item,
        index:
          route.query.page && Number(route.query.page) > 1
            ? (Number(route.query.page) - 1) * 10 + index + 1
            : index + 1,
      })) || [];
  } catch (e) {
    console.log(e);
  }
};

const deleteStage = async (id: number): Promise<void> => {
  try {
    await http.delete(`/investment_process_stage/${id}`);
    message.success("Bosqich muvaffaqiyatli o'chirildi!");
    fetchStages();
  } catch (e) {
    console.error(e);
  }
};

watch(() => route.query, fetchStages, { immediate: true });
</script>

<template>
  <teleport to="body">
    <StageModal
      v-model:open="modal.open"
      :type="modal.type"
      :stage="modal.stage"
      @success="fetchStages"
    />
  </teleport>

  <section class="relative">
    <div class="px-4">
      <div class="mt-5 w-full flex items-center justify-between gap-5">
        <div class="text-lg font-bold">
          S4. Investitsiya jarayoni boshqichlari
        </div>

        <div class="w-[360px] flex gap-4">
          <a-date-picker
            v-model:value="table.start_date"
            format="DD/MM/YYYY"
            :locale="locale"
            placeholder="Boshlanish sanasi"
            class="w-full the-datepicker"
            @change="(d: any) => handleDateChange(d, 'start_date')"
          />
          <a-date-picker
            v-model:value="table.end_date"
            format="DD/MM/YYYY"
            :locale="locale"
            placeholder="Tugash sanasi"
            class="w-full the-datepicker"
            @change="(d:any) => handleDateChange(d, 'end_date')"
          />
        </div>
      </div>

      <TheTable
        class="mt-5 the-table-secondary px-8"
        :columns="columns"
        :data-source="data"
        :scroll="{ x: 'max-content', y: 750 }"
        :pagination="{
          current: Number(route.query.page) || 1,
          pageSize: 10,
          total: table.total,
          position: ['bottomCenter'],
          size: 'middle',
        }"
        :top-scrollbar="false"
        @change="
          (data:any) => {
            router.push({query: {...route.query, page: data.current}});
          }
        "
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key == 'actions'">
            <TheActions
              :actions="[
                {
                  label: 'edit',
                  onClick: () => {
                    modal.open = true;
                    modal.type = 'update';
                    modal.stage = { ...record };
                  },
                },
                {
                  label: 'delete',
                  onClick: () => deleteStage(record.id),
                },
              ]"
            />
          </template>
        </template>

        <template #footer>
          <a-button
            class="the-button"
            type="primary"
            @click="() => {
              modal.open = true;
              modal.type = 'create';
              modal.stage = {} as Stage
            }"
          >
            Bosqich qo'shish
          </a-button>
        </template>
      </TheTable>
    </div>
  </section>
</template>
