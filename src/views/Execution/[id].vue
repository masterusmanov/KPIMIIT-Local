<script lang="ts" setup>
import http from "@/libs/axios";
import { CircleCheckBig, CirclePlus, CircleX } from "lucide-vue-next";
import { message } from "ant-design-vue";
import { CloseCircleOutlined } from "@ant-design/icons-vue";
import type { TableColumnsType } from "ant-design-vue";
import { useStore } from "@/stores/index.store";

const router = useRouter();
const route = useRoute();
const store = useStore();
const { t } = useI18n();

const columns = ref<any[]>([
  {
    title: t("table.index"),
    width: 50,
    dataIndex: "index",
    key: "index",
    align: "center",
  },
  {
    title: t("attached_documents"),
    dataIndex: "files",
    key: "files",
  },
  {
    title: t("docs"),
    width: 100,
    align: "center",
    dataIndex: "docs",
    key: "docs",
  },
  {
    title: t("status"),
    width: 100,
    align: "center",
    dataIndex: "status",
    key: "status",
  },
  {
    title: t("actions"),
    width: 100,
    align: "center",
    dataIndex: "actions",
    key: "actions",
    hidden: store.user?.role == "SUPERADMIN",
  },
]);
const data = ref<any[]>([]);

const detail = ref<WorkerDetail>();
const cancelModal = reactive<any>({
  open: false,
  text: "",
  record: null,
});

const getColumns = computed(() => {
  return columns.value.filter((column: any) => !column.hidden);
});

const setRowClass = (record: any, index: number): string => {
  if (record.status == "APPROVED") {
    return "!bg-green-50";
  } else if (record.status == "CANCELED") {
    return "!bg-red-50";
  } else {
    return "!bg-white";
  }
};

const fetchData = async (): Promise<void> => {
  try {
    const res = await http.get<any>(`/worker_indicator/${route.params.id}`);

    if (res.data) {
      detail.value = res.data.data;
      data.value = res.data.data?.execution_docs?.map(
        (item: any, index: number) => ({
          index: index + 1,
          ...item,
        })
      );
    }
  } catch (e) {
    console.error(e);
  }
};

const handleFileUpload = async (event: Event, record: any): Promise<void> => {
  const inputElement = event.target as HTMLInputElement;
  if (!inputElement.files || inputElement.files.length === 0) return;

  const uploadedFiles = Array.from(inputElement.files);

  const formData = new FormData();
  uploadedFiles.forEach((file) => {
    formData.append("files", file);
  });

  try {
    const res = await http.post(`/files/create/multiple`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const uploadedData = res.data.data;
    record.files = record.files || [];

    // If API returns multiple file info, map them
    uploadedData.forEach((id: number, index: number) => {
      const file = uploadedFiles[index];
      const type = file.name.split(".").pop()?.toLowerCase();

      record.files.push({
        id: id,
        name: file.name,
        type,
      });
    });
  } catch (error) {
    console.error("Error uploading files:", error);
  }
};

const openFile = (file: any): void => {
  window.open(file.url, "_blank");
};

const deleteFile = (record: any, fileIndex: number): void => {
  record.files.splice(fileIndex, 1);
};

const saveChanges = async () => {
  try {
    const res = await http.patch(
      `/worker_indicator/${route.params.id}/attach_execution_docs`,
      {
        execution_docs: data.value.map((item, index) => {
          return {
            ...item,
            file_ids: Array.isArray(item.files)
              ? item.files.map((f: any) => f.id)
              : [],
          };
        }),
      }
    );

    message.success("Ma'lumotlar saqlandi");
    fetchData();
  } catch (e) {
    console.error(e);
  }
};

const saveStatus = async () => {
  try {
    const res = await http.patch(
      `/worker_indicator/${route.params.id}/update_execution_docs_status`,
      {
        execution_docs: data.value.map((item, index) => {
          return {
            ...item,
            file_ids: Array.isArray(item.files)
              ? item.files.map((f: any) => f.id)
              : [],
          };
        }),
      }
    );

    message.success("Ijro holati o'zgartirildi!");
    fetchData();
  } catch (e) {
    console.error(e);
  }
};

onMounted(() => fetchData());
</script>

<template>
  <teleport to="body">
    <a-modal
      v-model:open="cancelModal.open"
      title="Rad etish sababi"
      centered
      @ok="
        () => {
          if (cancelModal.record) {
            cancelModal.record.status = 'CANCELED';
            cancelModal.record.cancelation_reason = cancelModal.text;
            saveStatus();

            cancelModal.open = false;
            cancelModal.text = '';
            cancelModal.record = null;
          }
        }
      "
      :okButtonProps="{ disabled: !cancelModal.text.trim() }"
      ok-text="Tasdiqlash"
      cancel-text="Bekor qilish"
    >
      <a-textarea
        v-model:value="cancelModal.text"
        rows="4"
        placeholder="Rad etish sababini kiriting"
      />
    </a-modal>
  </teleport>

  <section class="relative">
    <div class="px-4 space-y-5">
      <TheFilter class="mt-5" title="Ijro kiritish">
        <div class="ml-auto flex items-center gap-5">
          <div class="font-medium">
            Reja:
            <strong class="text-primary">{{ detail?.plan_amount }}</strong>
          </div>
          <div class="font-medium">
            Ijro:
            <strong class="text-green-500">
              {{ detail?.execution_amount || 0 }}
            </strong>
          </div>
        </div>
      </TheFilter>
      
      <TheBreadcrumb
        home="/execution/district"
        :items="[
          {
            label: route.query.region,
            link: {
              path: `/execution/district/${route.query.region_id}`,
              query: {
                region: route.query.region,
              },
            },
          },
          {
            label: route.query.district,
            link: {
              path: `/execution/district/${route.query.region_id}/${route.query.district_id}`,
              query: {
                region: route.query.region,
                district: route.query.district,
              },
            },
          },
          {
            label: route.query.criteria?.slice(0, 40) + '...',
          },
          {
            label: route.query.user,
          },
        ]"
      />

     

      <a-table
        class="my-5 custom-table execution-table"
        :columns="getColumns"
        :data-source="data"
        bordered
        size="middle"
        :pagination="false"
        :rowClassName="setRowClass"
      >
        <template #bodyCell="{ column, record }">
          <!-- Files -->
          <template v-if="column.key === 'files'">
            <div class="w-full flex items-stretch justify-between gap-5">
              <div
                v-if="record.files && record.files.length > 0"
                class="flex flex-wrap grow items-stretch justify-start gap-1"
              >
                <div
                  v-for="(file, index) in record.files"
                  :key="`file-${index}`"
                  class="py-1 px-2 min-w-[105px] flex items-center gap-2"
                  :class="[
                    record.index % 2 != 0 ? 'bg-[#F0F0F0]' : 'bg-white',
                    !record.editable ? 'cursor-zoom-in' : '',
                  ]"
                  @click="openFile(file)"
                >
                  <img
                    v-if="file.type === 'xls'"
                    class="w-3"
                    src="/xls-icon.svg"
                    alt=""
                  />
                  <img v-else class="w-3" src="/doc-icon.svg" alt="" />

                  <div class="text-xs">{{ file.name }}</div>

                  <CircleX
                    v-if="record.editable"
                    class="ml-auto size-4 text-slate-300 hover:text-cRed cursor-pointer"
                    @click.prevent="deleteFile(record, index)"
                  />
                </div>
              </div>

              <span v-else>{{ $t("no_files_attached") }}</span>

              <label
                v-if="record.editable"
                :for="`inp-${record.index}`"
                class="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="file"
                  :id="`inp-${record.index}`"
                  multiple
                  class="hidden"
                  @change="($event) => handleFileUpload($event, record)"
                />

                <span class="opacity-50 whitespace-nowrap">
                  {{ $t("upload_file") }}
                </span>

                <CirclePlus class="size-5 text-cGreen" />
              </label>
            </div>
          </template>

          <!-- Docs -->
          <template v-else-if="column.key === 'docs'">
            {{ record.files?.length || 0 }}
          </template>

          <!-- Status -->
          <template v-else-if="column.key === 'status'">
            <div
              class="font-bold"
              :class="{
                'text-green-500': record[column.dataIndex] == 'APPROVED',
                'text-cRed': record[column.dataIndex] == 'CANCELED',
              }"
            >
              <a-popover
                v-if="
                  record.cancelation_reason &&
                  record[column.dataIndex] == 'CANCELED'
                "
                placement="topRight"
                trigger="hover"
                :overlayStyle="{ maxWidth: '340px' }"
              >
                <template #content>
                  {{ record.cancelation_reason }}
                </template>

                {{ $t(`execution.${record[column.dataIndex].toLowerCase()}`) }}
              </a-popover>

              <template v-else>
                {{ $t(`execution.${record[column.dataIndex].toLowerCase()}`) }}
              </template>
            </div>
          </template>

          <!-- Actions -->
          <template v-else-if="column.key === 'actions'">
            <template v-if="store.user?.role == 'WORKER'">
              <TheActions
                :actions="[
                  {
                    show: !!(record.editable && record.status != 'APPROVED'),
                    label: 'save',
                    onClick: () => {
                      record.editable = false;
                      saveChanges();
                    },
                  },
                  {
                    show: !!(!record.editable && record.status != 'APPROVED'),
                    label: 'edit',
                    onClick: () => {
                      record.editable = true;
                    },
                  },
                  {
                    show: !!(record.editable && record.status != 'APPROVED'),
                    label: 'cancel',
                    onClick: () => {
                      record.editable = false;
                      fetchData();
                    },
                  },
                  {
                    show: !!(record.editable && record.status != 'APPROVED'),
                    label: 'delete',
                    onClick: () => {
                      record.files = [];
                      record.editable = false;
                      saveChanges();
                    },
                  },
                ]"
              />
            </template>
            <template v-else>
              <TheActions
                v-if="record.files && record.files.length"
                :actions="[
                  {
                    show: record.status != 'APPROVED',
                    label: 'save',
                    tooltip: 'Tasdiqlash',
                    onClick: () => {
                      record.status = 'APPROVED';
                      saveStatus();
                    },
                  },
                  {
                    show: record.status != 'CANCELED',
                    label: 'delete',
                    icon: CloseCircleOutlined,
                    tooltip: 'Rad etish',
                    onClick: () => {
                      cancelModal.open = true;
                      cancelModal.record = record;
                    },
                  },
                ]"
              />
            </template>
          </template>
        </template>
      </a-table>

      <!-- Footer -->
      <div class="w-full">
        <a-button
          v-if="store.user?.role == 'ADMIN'"
          class="the-button !flex !items-center gap-2"
          type="primary"
        >
          <CircleCheckBig class="size-4" />
          <span>Tugatish</span>
        </a-button>
      </div>
    </div>
  </section>
</template>

<style>
.execution-table tbody tr .ant-table-cell:last-child {
  padding-block: 0 !important;
}
.execution-table tbody tr .ant-table-cell:nth-last-child(2) {
  font-weight: 700;
}
</style>
