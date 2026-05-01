<!-- Users/index.vue -->
<script lang="ts" setup>
import http from "@/libs/axios";
import { message } from "ant-design-vue";
import type { TableColumnsType } from "ant-design-vue";
import { UserPlus, Search } from "lucide-vue-next";
import { useDistStore } from "@/stores/district";

const router = useRouter();
const route = useRoute();
const store = useStore();
const distStore = useDistStore();

const data = ref<any>([]);
const total = ref<number>(0);

// Table height ni dinamik hisoblash
const tableHeight = ref(500);

const columns = ref<TableColumnsType>([
  {
    title: "№",
    key: "index",
    dataIndex: "index",
    width: 50,
    align: "center",
  },
  {
    title: "FISH",
    key: "full_name",
    dataIndex: "full_name",
    width: 220,
    customRender: ({ record }: any) =>
      `${record.last_name || ""} ${record.first_name || ""} ${
        record.surname || ""
      }`,
  },
  {
    title: "PINFL",
    key: "pinfl",
    dataIndex: "pinfl",
    width: 120,
  },
  {
    title: "Login",
    key: "login",
    dataIndex: "login",
    width: 120,
  },
  {
    title: "Viloyat",
    key: "region_title",
    dataIndex: "region_title",
    width: 160,
  },
  {
    title: "Tuman",
    key: "district_title",
    dataIndex: "district_title",
    width: 160,
  },
  {
    title: "Daraja",
    key: "rank_id",
    dataIndex: "rank_id",
    width: 120,
    customRender: ({ record }: any) => record.rank_title || "-",
  },
  {
    title: "Departament",
    key: "department_title",
    dataIndex: "department_title",
    width: 160,
    customRender: ({ record }: any) => record.department_title || "-",
  },
  {
    title: "Bo'lim",
    key: "office_unit_title",
    dataIndex: "office_unit_title",
    width: 200,
    customRender: ({ record }: any) => record.office_unit_title || "-",
  },
  {
    title: "Lavozim",
    key: "position",
    dataIndex: "position",
    width: 160,
  },
  {
    title: "Lavozimga tayinlangan sana",
    key: "position_changed_at",
    dataIndex: "position_changed_at",
    width: 120,
  },
  {
    title: "Ishga kirgan sana",
    key: "hired_at",
    dataIndex: "hired_at",
    width: 120,
  },
  {
    title: "Rol",
    key: "role",
    dataIndex: "role",
    width: 100,
  },
  {
    title: "Harakatlar",
    key: "actions",
    dataIndex: "actions",
    width: 80,
    fixed: "right",
  },
]);

const ranks = [{ id: 0, title: "Hammasi" }, ...store.ranks];

const modal = reactive({
  open: false,
  type: "create",
  user: {} as User,
});

const filter = reactive({
  pinfl: route.query.pinfl || "",
  rank_id: route.query.rank_id || null,
  region_id: Array.isArray(route.query.region_id) 
    ? route.query.region_id[0] 
    : route.query.region_id || null,
  district_id: Array.isArray(route.query.district_id) 
    ? route.query.district_id[0] 
    : route.query.district_id || null,
});

// Category state
const selectedCategory = ref<"vazirlik" | "viloyat">("viloyat");

// Viloyat selection
const selectedViloyat = computed({
  get: () => distStore.selectedViloyatValue,
  set: (val: string | null) => {
    if (val) {
      distStore.selectViloyatById(val);
      filter.region_id = val;
      filter.district_id = null;
    } else {
      distStore.setDist(null);
      distStore.clearTuman();
      filter.region_id = null;
      filter.district_id = null;
    }
  },
});

// Tuman selection
const selectedTuman = computed({
  get: () => distStore.selectedTumanValue,
  set: (val: string | null) => {
    if (val) {
      distStore.selectTumanById(val);
      filter.district_id = val;
    } else {
      distStore.setTuman(null);
      filter.district_id = null;
    }
  },
});

// Worker check
const isWorkerWithFixedRegion = computed(() => {
  return (
    store.user?.role === "WORKER" &&
    store.user?.region_id &&
    store.user?.district_id
  );
});

const handleViloyatChange = async (value: string) => {
  selectedViloyat.value = value;
};

const handleTumanChange = (value: string) => {
  selectedTuman.value = value;
};

const fetchUsers = async (): Promise<void> => {
  try {
    // URL querydan pageSize ni olish, default 10
    const pageSize = Number(route.query?.pageSize) || 10;
    const currentPage = Number(route.query?.page) || 1;

    let params: any = {
      page: currentPage,
      limit: pageSize, // pageSize ni limit sifatida yuborish
    };
    if (filter.pinfl) params.pinfl = filter.pinfl;
    if (filter.rank_id && filter.rank_id != "0")
      params.rank_id = filter.rank_id;
    if (filter.region_id) params.region_id = filter.region_id;
    if (filter.district_id) params.district_id = filter.district_id;

    const res = await http.get<Res<User>>("/user/list", { params });
    data.value =
      res.data.data?.results?.map((item: any, index: number) => ({
        ...item,
        index: (currentPage - 1) * pageSize + index + 1,
      })) || [];
    total.value = res.data.data?.count || 0;
  } catch (e) {
    console.error(e);
  }
};

const deleteUser = async (id: number): Promise<void> => {
  try {
    await http.delete(`/user/${id}`);
    message.success("Xodim muvaffaqiyatli o'chirildi!");
    fetchUsers();
  } catch (e) {
    console.error(e);
  }
};

// Search handle function
const handleSearch = () => {
  router.push({
    query: {
      page: 1,
      pageSize: route.query.pageSize || 10,
      pinfl: filter.pinfl || "",
      rank_id: filter.rank_id === "0" ? "" : filter.rank_id || "",
      region_id: filter.region_id || "",
      district_id: filter.district_id || "",
    },
  });
};

// Pagination va table change handler
const handleTableChange = (pagination: any, filters: any, sorter: any) => {
  router.push({
    query: {
      ...route.query,
      page: pagination.current,
      pageSize: pagination.pageSize,
    },
  });
};

// Table height ni hisoblash
const calculateTableHeight = () => {
  const headerHeight = 180; // Sticky header balandligi
  const footerHeight = 100; // Footer va pagination balandligi
  const windowHeight = window.innerHeight;
  tableHeight.value = windowHeight - headerHeight - footerHeight;
};

onMounted(() => {
  calculateTableHeight();
  window.addEventListener("resize", calculateTableHeight);
});

onMounted(async () => {
  // Viloyatlarni yuklash
  if (distStore.viloyatList.length === 0) {
    await distStore.fetchViloyatlar();
  }
  
  // Query dan restore qilish
  if (filter.region_id) {
    const regionId = Array.isArray(filter.region_id) 
      ? filter.region_id[0] 
      : filter.region_id;
    await distStore.selectViloyatById(regionId);
  }
  if (filter.district_id) {
    const districtId = Array.isArray(filter.district_id) 
      ? filter.district_id[0] 
      : filter.district_id;
    distStore.selectTumanById(districtId);
  }
});

onUnmounted(() => {
  window.removeEventListener("resize", calculateTableHeight);
});


watch(() => route.query, fetchUsers, { immediate: true });
</script>

<template>
  <teleport to="body">
    <UserModal
      v-model:open="modal.open"
      :user="modal.user"
      :type="modal.type"
      @success="fetchUsers"
    />
  </teleport>

  <section class="relative">
    <!-- Sahifa sarlavhasi va filter qismi -->
    <div class="header-section space-y-4 px-4">
      <div class="text-lg font-bold">Ro'yhatdan o'tgan xodimlar</div>

      <div class="flex gap-5">
        <!-- Filter section -->
        <form
          class="w-full flex items-center gap-3"
          @submit.prevent="handleSearch"
        >
          <a-input
            class="the-input max-w-64"
            v-model:value="filter.pinfl"
            placeholder="PINFL"
            :maxlength="14"
            show-count
          />

          <a-select
            class="the-select min-w-64"
            v-model:value="filter.rank_id"
            placeholder="Darajani tanlang"
            :options="
              ranks.map((rank) => ({
                value: rank.id.toString(),
                label: rank.title,
              }))
            "
          />
          
          <div v-if="selectedCategory === 'viloyat'" class="flex space-x-2">
            <a-select
              v-model:value="selectedViloyat"
              placeholder="Viloyatni tanlang"
              style="width: 200px"
              :options="distStore.viloyatOptions"
              :loading="distStore.viloyatLoading"
              :disabled="isWorkerWithFixedRegion"
              allow-clear
              @change="handleViloyatChange"
            />

            <a-select
              v-if="selectedViloyat"
              v-model:value="selectedTuman"
              placeholder="Tumanni tanlang"
              style="width: 200px"
              :options="distStore.tumanOptions"
              :loading="distStore.tumanLoading"
              :disabled="isWorkerWithFixedRegion"
              allow-clear
              @change="handleTumanChange"
            />
          </div>

          <a-button
            class="the-button !flex !items-center gap-1"
              style="border-radius: 8px !important"
            type="primary"
            html-type="submit"
          >
            <Search class="size-4" /> Qidirish
          </a-button>
        </form>

        <a-button
          class="the-button !flex !items-center gap-2"
          style="border-radius: 8px !important"
          type="primary"
          @click="() => {
            modal.open = true
            modal.type = 'create'
            modal.user = {} as User
          }"
        >
          <UserPlus class="size-4" />
          Xodim qo'shish
        </a-button>
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
        pageSize: Number(route.query.pageSize) || 10,
        total: total,
        position: ['bottomCenter'],
        size: 'middle',
        showSizeChanger: true,
        showQuickJumper: false,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: (total: number, range: [number, number]) =>
          `${range[0]}-${range[1]} / ${total}`,
      }"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'actions'">
          <TheActions
            :actions="[
              {
                label: 'edit',
                onClick: () => {
                  modal.open = true;
                  modal.type = 'update';
                  modal.user = { ...record };
                },
              },
              {
                label: 'delete',
                onClick: () => deleteUser(record.id),
              },
            ]"
          />
        </template>
      </template>
    </TheTable>
  </section>
</template>
<style scoped>
/* Sahifa yuqori qismi - oddiy, sticky emas */
.header-section {
  padding: 1rem;
  background-color: white;
  border-bottom: 1px solid #f0f0f0;
}

.table-container {
  margin-top: 0;
}

/* Faqat jadval headerini sticky qilish */
:deep(.ant-table-thead > tr > th) {
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Dark mode uchun */
.dark .header-section {
  background-color: #1a1a1a;
  border-bottom-color: #333;
}

.dark :deep(.ant-table-thead > tr > th) {
  background-color: #262626;
  border-bottom-color: #434343;
}

/* Custom scrollbar */
:deep(.ant-table-body)::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

:deep(.ant-table-body)::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

:deep(.ant-table-body)::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

:deep(.ant-table-body)::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.dark :deep(.ant-table-body)::-webkit-scrollbar-track {
  background: #2a2a2a;
}

.dark :deep(.ant-table-body)::-webkit-scrollbar-thumb {
  background: #555;
}

.dark :deep(.ant-table-body)::-webkit-scrollbar-thumb:hover {
  background: #777;
}

/* Pagination ni pastda qoldirish */
:deep(.ant-pagination) {
  margin-top: 16px;
  margin-bottom: 16px;
  text-align: center;
}
</style>