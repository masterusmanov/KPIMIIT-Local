<script lang="ts" setup>
import http from "@/libs/axios";
import { message } from "ant-design-vue";
import { Search } from "lucide-vue-next";
import type { TableColumnsType } from "ant-design-vue";
import locale from "ant-design-vue/es/date-picker/locale/ru_RU";

const router = useRouter();
const route = useRoute();
const store = useStore();

const table = reactive({
  total: 0,
  start_date: route.query.start_date || null,
  end_date: route.query.end_date || null,
});

// Table height ni dinamik hisoblash
const tableHeight = ref(500);

const data = ref<any>([]);
const columns = ref<TableColumnsType>([
  // ... columnlar o'zgarishsiz
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
    width: 220,
    customRender: ({ record }: any) =>
      h("div", { class: "text-left" }, record.title),
  },
  {
    title: "Pog'ona",
    dataIndex: "rank_id",
    key: "rank_id",
    align: "center",
    width: 70,
    customRender: ({ record }: any) =>
      store.ranks.find((r) => r.id == record.rank_id)?.title,
  },
  {
    title: "Bosqich nomi",
    dataIndex: "stage_title",
    key: "stage_title",
    align: "center",
    width: 180,
    customRender: ({ record }: any) =>
      h("div", { class: "text-left" }, record.stage_title),
  },
  {
    title: "Vazn R",
    dataIndex: "weight_r",
    key: "weight_r",
    align: "center",
    width: 80,
  },
  {
    title: "Vazn R1",
    dataIndex: "weight_r1",
    key: "weight_r1",
    align: "center",
    width: 80,
  },
  {
    title: "Vazn R2",
    dataIndex: "weight_r2",
    key: "weight_r2",
    align: "center",
    width: 80,
  },
  {
    title: "Vazn V",
    dataIndex: "weight_v",
    key: "weight_v",
    align: "center",
    width: 80,
  },
  {
    title: "Vazn V1",
    dataIndex: "weight_v1",
    key: "weight_v1",
    align: "center",
    width: 80,
  },
  {
    title: "Vazn V2",
    dataIndex: "weight_v2",
    key: "weight_v2",
    align: "center",
    width: 80,
  },
  {
    title: "Vazn H",
    dataIndex: "weight_h",
    key: "weight_h",
    align: "center",
    width: 80,
  },
  {
    title: "Vazn H1",
    dataIndex: "weight_h1",
    key: "weight_h1",
    align: "center",
    width: 80,
  },
  {
    title: "Vazn H2",
    dataIndex: "weight_h2",
    key: "weight_h2",
    align: "center",
    width: 80,
  },
  {
    title: "Birlik",
    dataIndex: "measurement_unit_title",
    key: "measurement_unit_title",
    align: "center",
    width: 50,
  },
  {
    title: "Tugash sanasi",
    dataIndex: "end_date",
    key: "end_date",
    align: "center",
    width: 100,
  },
  {
    title: "Xodimlar yig'indisi keladi",
    dataIndex: "not_editable_worker_ids",
    key: "not_editable_worker_ids",
    align: "center",
    width: 160,
    customRender: ({ record }: any) =>
      record.not_editable_worker_ids && record.not_editable_worker_ids.length
        ? record.not_editable_worker_ids.join(", ")
        : "",
  },
  {
    title: "Kriteria shakllanadigan xodimlar",
    dataIndex: "allowed_worker_ids",
    key: "allowed_worker_ids",
    align: "center",
    width: 160,
    customRender: ({ record }: any) =>
      record.allowed_worker_ids && record.allowed_worker_ids.length
        ? record.allowed_worker_ids.join(", ")
        : "",
  },
  {
    title: "S5",
    dataIndex: "sub_criteria_ids",
    key: "sub_criteria_ids",
    align: "center",
    width: 120,
    customRender: ({ record }: any) =>
      record.sub_criteria_ids && record.sub_criteria_ids.length
        ? record.sub_criteria_ids.join(", ")
        : "",
  },
  {
    title: "S5 2",
    dataIndex: "district_children_ids",
    key: "district_children_ids",
    align: "center",
    width: 120,
    customRender: ({ record }: any) =>
      record.district_children_ids && record.district_children_ids.length
        ? record.district_children_ids.join(", ")
        : "",
  },
  {
    title: "Yig'indisi raxbarga boradigan xodimlar",
    dataIndex: "workers_hierarchy",
    key: "workers_hierarchy",
    align: "center",
    width: 160,
    customCell: () => {
      return {
        style: "padding:0 !important;",
      };
    },
  },
  {
    title: "Harakatlar",
    align: "center",
    key: "actions",
    width: 80,
    fixed: "right",
  },
]);

const modal = reactive({
  open: false,
  type: "create",
  criteria: {} as Criterion,
});

const filter = reactive({
  rank_id: route.query.rank_id || null,
});

// Search handle function
const handleSearch = () => {
  router.push({
    query: {
      ...route.query,
      page: 1,
      rank_id: filter.rank_id === '0' ? '' : filter.rank_id || '',
    },
  });
};

// Table change handle function
const handleTableChange = (pagination: any) => {
  router.push({
    query: {
      ...route.query,
      page: pagination.current,
      limit: pagination.pageSize,
    },
  });
};

// Date change function o'zgarishsiz
const handleDateChange = (date: Date | null, key: string) => {
  if (!date) {
    const { [key]: removed, ...newQuery } = route.query;
    router.push({ query: newQuery });
    return;
  }

  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  router.push({
    query: { ...route.query, [key]: `${year}-${month}-${day}` },
  });
};

// FetchCriteria function ni yangilash
const fetchCriteria = async (): Promise<void> => {
  try {
    const params: any = { 
      limit: Number(route.query.limit) || 10, 
      page: Number(route.query.page) || 1 
    };

    if (route.query.start_date) params.start_date = route.query.start_date;
    if (route.query.end_date) params.end_date = route.query.end_date;
    if (route.query.rank_id) params.rank_id = route.query.rank_id;

    const res = await http.get<Res<Criterion>>(
      `/investment_process_stage_criteria/list`,
      { params }
    );

    table.total = res.data.data?.count || 0;
    data.value =
      res.data.data?.results?.map((item: any, index: number) => ({
        ...item,
        index: (params.page - 1) * params.limit + index + 1,
        children: null,
        allowed_worker_ids: item.allowed_workers
          ? item.allowed_workers.map((u: any) => u.id)
          : [],
        not_editable_worker_ids: item.not_editable_workers
          ? item.not_editable_workers.map((u: any) => u.id)
          : [],
      })) || [];
  } catch (e) {
    console.log(e);
  }
};

// Delete function o'zgarishsiz
const deleteCriteria = async (id: number): Promise<void> => {
  try {
    await http.delete(`/investment_process_stage_criteria/${id}`);
    message.success("Mezon muvaffaqiyatli o'chirildi!");
    fetchCriteria();
  } catch (e) {
    console.error(e);
  }
};

// Table height ni hisoblash
const calculateTableHeight = () => {
  const headerHeight = 200; // Sticky header balandligi
  const footerHeight = 100; // Footer va pagination balandligi
  const windowHeight = window.innerHeight;
  tableHeight.value = windowHeight - headerHeight - footerHeight;
};

onMounted(() => {
  calculateTableHeight();
  window.addEventListener('resize', calculateTableHeight);
});

onUnmounted(() => {
  window.removeEventListener('resize', calculateTableHeight);
});

watch(() => route.query, fetchCriteria, { immediate: true });
</script>

<template>
  <teleport to="body">
    <CriteriaModal
      v-model:open="modal.open"
      :type="modal.type"
      :stage="modal.criteria"
      @success="fetchCriteria"
    />
  </teleport>

  <section class="relative">
    <!-- Sarlavha va filter qismi -->
    <div class="header-section space-y-5 px-4">
      <div class="text-lg font-bold">Mezonlar</div>
     
      <div class="mt-3 w-full flex items-center justify-between gap-5 py-5">
        <form
          class="w-full flex items-center gap-3"
          @submit.prevent="handleSearch"
        >
          <a-select
            class="the-select min-w-48"
            v-model:value="filter.rank_id"
            placeholder="Darajani tanlang"
            :options="[
              { value: '0', label: 'Hammasi' },
              ...store.ranks.map((rank) => ({
                value: rank.id.toString(),
                label: rank.title,
              })),
            ]"
          />

          <a-button
            class="the-button !flex !items-center gap-1"
            type="primary"
            html-type="submit"
          >
            <Search class="size-4" /> Qidirish
          </a-button>
        </form>
        
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
    </div>

    <!-- Jadval qismi -->
    <TheTable
      class="the-table-secondary px-8"
      :columns="columns"
      :data-source="data"
      :scroll="{ x: 'max-content', y: 'max-content' }"
      :sticky="{ offsetHeader: 0 }"
      :pagination="{
        current: Number(route.query.page) || 1,
        pageSize: Number(route.query.limit) || 10,
        total: table.total,
        position: ['bottomCenter'],
        size: 'middle',
        showSizeChanger: true,
        showQuickJumper: false,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: (total: number, range: [number, number]) => `${range[0]}-${range[1]} / ${total}`,
      }"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key == 'workers_hierarchy'">
          <WorkerHierarchy
            v-for="item in record[column.dataIndex]"
            v-model:items="record[column.dataIndex]"
            :key="item.id"
            :worker="item"
            :editable="false"
          />
        </template>

        <template v-else-if="column.key == 'actions'">
          <TheActions
            :actions="[
              {
                label: 'edit',
                onClick: () => {
                  modal.open = true;
                  modal.type = 'update';
                  modal.criteria = { ...record };
                },
              },
              {
                label: 'delete',
                onClick: () => deleteCriteria(record.id),
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
            modal.criteria = {} as Criterion;
          }"
        >
          Mezon qo'shish
        </a-button>
      </template>
    </TheTable>
  </section>
</template><style scoped>
.sticky-header {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 100;
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.table-container {
  margin-top: 0;
}

/* Ant Design table header ni sticky qilish */
:deep(.ant-table-thead > tr > th) {
  position: sticky;
  top: 140px; /* Sticky header balandligiga qarab sozlang */
  z-index: 99;
}

/* Dark mode uchun */
.dark .sticky-header {
  background-color: #1a1a1a;
  border-bottom-color: #333;
}

.dark :deep(.ant-table-thead > tr > th) {
  background-color: #1a1a1a;
}

/* Table scroll area */
:deep(.ant-table-body) {
  overflow-y: auto;
}

/* Pagination sticky qilish (ixtiyoriy) */
:deep(.ant-pagination) {
  bottom: 0;
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
  z-index: 98;
}

.dark :deep(.ant-pagination) {
  background-color: #1a1a1a;
  border-top-color: #333;
}
</style>