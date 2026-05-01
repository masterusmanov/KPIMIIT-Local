<script lang="ts" setup>
import http from "@/libs/axios";
import { message } from "ant-design-vue";

type Employee = {
  id: number;
  full_name: string;
  children: Employee[];
};

type Criteria = {
  id?: number;
  title: string;
  rank_id: number | string | null;
  stage_id: number | string | null;
  weight_r: number | null;
  weight_r1: number | null;
  weight_r2: number | null;
  weight_v: number | null;
  weight_v1: number | null;
  weight_v2: number | null;
  weight_h: number | null;
  weight_h1: number | null;
  weight_h2: number | null;
  measurement_unit_id: number | string | null;
  allowed_worker_ids: number[] | string[];
  sub_criteria_ids: number[] | string[];
  not_editable_worker_ids: number[] | string[];
  workers_hierarchy: Employee[];
  district_children_ids: number[] | string[];
};

const store = useStore();

const open = defineModel("open");
const props = defineProps<{
  type?: "create" | "update";
  stage: Criteria;
}>();
const emits = defineEmits(["success"]);

const { filterOption } = useMe();

const formState = reactive<Criteria>({
  title: "",
  rank_id: null,
  stage_id: null,
  weight_r: null,
  weight_r1: null,
  weight_r2: null,
  weight_v: null,
  weight_v1: null,
  weight_v2: null,
  weight_h: null,
  weight_h1: null,
  weight_h2: null,
  measurement_unit_id: null,
  allowed_worker_ids: [],
  sub_criteria_ids: [],
  not_editable_worker_ids: [],
  workers_hierarchy: [],
  district_children_ids: [],
});
const workers_hierarchy = ref<string[]>([]);
const formRef = ref();
const users = ref<User[]>([]);
const stages = ref<Stage[]>([]);
const units = ref<MeasurementUnit[]>([]);
const criterias = ref<Criteria[]>([]);

const rules = {
  title: [{ required: true, message: "Nom majburiy!", trigger: "blur" }],
  rank_id: [
    { required: true, message: "Pog'onani tanlang!", trigger: "change" },
  ],
  stage_id: [
    { required: true, message: "Bosqichni tanlang!", trigger: "change" },
  ],
  weight_r: [{ required: true, message: "Vaznni kiriting!", trigger: "blur" }],
  weight_r1: [{ required: true, message: "Vaznni kiriting!", trigger: "blur" }],
  weight_r2: [{ required: true, message: "Vaznni kiriting!", trigger: "blur" }],
  weight_v: [{ required: true, message: "Vaznni kiriting!", trigger: "blur" }],
  weight_v1: [{ required: true, message: "Vaznni kiriting!", trigger: "blur" }],
  weight_v2: [{ required: true, message: "Vaznni kiriting!", trigger: "blur" }],
  weight_h: [{ required: true, message: "Vaznni kiriting!", trigger: "blur" }],
  weight_h1: [{ required: true, message: "Vaznni kiriting!", trigger: "blur" }],
  weight_h2: [{ required: true, message: "Vaznni kiriting!", trigger: "blur" }],
  // not_editable_worker_ids: [
  //   { required: true, message: "O'lchov birligi tanlang!", trigger: "change" },
  // ],
  // measurement_unit_id: [
  //   { required: true, message: "O'lchov birligi tanlang!", trigger: "change" },
  // ],
  // allowed_worker_ids: [
  //   { required: true, message: "Xodimni tanlang!", trigger: "change" },
  // ],
  // sub_criteria_ids: [
  //   { required: true, message: "Xodimni tanlang!", trigger: "change" },
  // ],
  // workers_hierarchy: [
  //   { required: true, message: "Xodimni tanlang!", trigger: "change" },
  // ],
};

const fetchUsers = async (): Promise<void> => {
  try {
    const res = await http.get<Res<User>>(`/user/list`);
    users.value = res.data.data?.results || [];
  } catch (e) {
    console.log(e);
  }
};

const fetchUtils = async (): Promise<void> => {
  try {
    const [res_stages, res_measurement, res_users, res_criterias] =
      await Promise.all([
        http.get<Res<Stage>>(`/investment_process_stage/list`),
        http.get<Res<MeasurementUnit>>(`/measurement_unit/list`),
        http.get<Res<User>>(`/user/list`),
        http.get<Res<Criteria>>(`/investment_process_stage_criteria/list`), // Changed type to Criteria
      ]);

    stages.value = res_stages.data.data?.results || [];
    units.value = res_measurement.data.data?.results || [];
    users.value = res_users.data.data?.results || [];
    criterias.value = res_criterias.data.data?.results || [];
  } catch (e) {
    console.log(e);
  }
};

const handleSubmit = async (): Promise<void> => {
  try {
    await formRef.value.validate();

    let res: any = "";
    let data: any = {
      ...formState,
      stage_id: Number(formState.stage_id),
      measurement_unit_id: Number(formState.measurement_unit_id),
      rank_id: Number(formState.rank_id),
      allowed_worker_ids: formState.allowed_worker_ids.map((id) => Number(id)),
      sub_criteria_ids: formState.sub_criteria_ids.map((id) => Number(id)),
      district_children_ids:
        formState.district_children_ids.map((id: string | number) =>
          Number(id)
        ) || [],
      not_editable_worker_ids: formState.not_editable_worker_ids.map((id) =>
        Number(id)
      ),
    };

    if (props.type == "create") {
      res = await http.post(`/investment_process_stage_criteria/create`, data);
    } else {
      res = await http.patch(`/investment_process_stage_criteria/update`, {
        ...data,
        id: props.stage.id,
      });
    }

    if (res) {
      message.success(
        props.type == "create"
          ? "Bosqich muvaffaqiyatli qo'shildi!"
          : "Bosqich muvaffaqiyatli yangilandi!"
      );
      formRef.value.resetFields();
    }

    open.value = false;
    emits("success");
  } catch (error: any) {
    console.error(error);
    error.errorFields && message.error("Iltimos, formani to‘g‘ri to‘ldiring!");
  }
};

onMounted(() => {
  fetchUsers();
  fetchUtils();
});

watch(
  () => open.value,
  () => {
    formState.title = props.stage.title || "";
    formState.rank_id = props.stage.rank_id?.toString() || null;
    formState.stage_id = props.stage.stage_id?.toString() || null;
    formState.weight_r = props.stage.weight_r || null;
    formState.weight_r1 = props.stage.weight_r1 || null;
    formState.weight_r2 = props.stage.weight_r2 || null;
    formState.weight_v = props.stage.weight_v || null;
    formState.weight_v1 = props.stage.weight_v1 || null;
    formState.weight_v2 = props.stage.weight_v2 || null;
    formState.weight_h = props.stage.weight_h || null;
    formState.weight_h1 = props.stage.weight_h1 || null;
    formState.weight_h2 = props.stage.weight_h2 || null;
    formState.measurement_unit_id =
      props.stage.measurement_unit_id?.toString() || null;
    formState.allowed_worker_ids =
      props.stage.allowed_worker_ids?.map((id) => id.toString()) || [];
    formState.sub_criteria_ids =
      props.stage.sub_criteria_ids?.map((id) => id.toString()) || [];
    formState.district_children_ids =
      props.stage.district_children_ids?.map((id: string | number) =>
        id.toString()
      ) || [];
    formState.not_editable_worker_ids =
      props.stage.not_editable_worker_ids?.map((id) => id.toString()) || [];
    formState.workers_hierarchy = props.stage.workers_hierarchy || [];
    workers_hierarchy.value =
      props.stage.workers_hierarchy?.map((item) => item.id.toString()) || [];
  }
);

watch(
  () => workers_hierarchy.value,
  () => {
    formState.workers_hierarchy = workers_hierarchy.value.map((id) => {
      const user = users.value.find((u: User) => u.id === Number(id));
      const item = formState.workers_hierarchy.find(
        (u: Employee) => u.id === Number(id)
      );

      return {
        id: Number(id),
        full_name: `${user?.first_name ?? ""} ${user?.last_name ?? ""} ${
          user?.surname ?? ""
        }`.trim(),
        children: item?.children || [],
      };
    });
  }
);
</script>
<template>
  <a-modal
    v-model:open="open"
    :maskClosable="false"
    :width="1220"
    cancelText="Bekor qilish"
    okText="Saqlash"
    centered
    @ok="handleSubmit"
  >
    <template #title>
      <div class="text-lg">
        {{ type == "create" ? "Mezon qo'shish" : "Mezonni tahrirlash" }}
      </div>
    </template>

    <a-form
      class="mt-5 w-full"
      ref="formRef"
      :model="formState"
      :rules
      layout="vertical"
    >
      <div class="w-full grid grid-cols-3 gap-x-4">
        <a-form-item label="Nomi" name="title">
          <a-textarea
            v-model:value="formState.title"
            class="w-full"
            placeholder="Bosqich nomi"
            :auto-size="{ minRows: 1, maxRows: 5 }"
          />
        </a-form-item>

        <a-form-item label="Pog'ona" name="rank_id">
          <a-select
            v-model:value="formState.rank_id"
            class="w-full"
            placeholder="Pog'onani tanlang"
          >
            <a-select-option
              v-for="item in store.ranks"
              :key="item.id"
              :value="item.id.toString()"
            >
              {{ item.title }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="Bosqich" name="stage_id">
          <a-select
            v-model:value="formState.stage_id"
            class="min-w-[120px] w-full"
            placeholder="Bosqichni tanlang"
            show-search
            :filterOption="filterOption"
            :options="
              stages.map((stage) => ({
                value: stage.id.toString(),
                label: stage.title,
              }))
            "
          />
        </a-form-item>

        <div class="w-full col-span-3 grid grid-cols-4 gap-x-3">
          <template v-if="formState.rank_id == 1">
            <a-form-item label="Vazn R" name="weight_r">
              <a-input-number
                v-model:value="formState.weight_r"
                class="w-full"
                placeholder="Vaznni kiriting"
              />
            </a-form-item>
            <a-form-item label="Vazn R1" name="weight_r1">
              <a-input-number
                v-model:value="formState.weight_r1"
                class="w-full"
                placeholder="Vaznni kiriting"
              />
            </a-form-item>
            <a-form-item label="Vazn R2" name="weight_r2">
              <a-input-number
                v-model:value="formState.weight_r2"
                class="w-full"
                placeholder="Vaznni kiriting"
              />
            </a-form-item>
          </template>
          <template v-else-if="formState.rank_id == 2">
            <a-form-item label="Vazn V" name="weight_v">
              <a-input-number
                v-model:value="formState.weight_v"
                class="w-full"
                placeholder="Vaznni kiriting"
              />
            </a-form-item>
            <a-form-item label="Vazn V1" name="weight_v1">
              <a-input-number
                v-model:value="formState.weight_v1"
                class="w-full"
                placeholder="Vaznni kiriting"
              />
            </a-form-item>
            <a-form-item label="Vazn V2" name="weight_v2">
              <a-input-number
                v-model:value="formState.weight_v2"
                class="w-full"
                placeholder="Vaznni kiriting"
              />
            </a-form-item>
          </template>
          <template v-else>
            <a-form-item label="Vazn H" name="weight_h">
              <a-input-number
                v-model:value="formState.weight_h"
                class="w-full"
                placeholder="Vaznni kiriting"
              />
            </a-form-item>
            <a-form-item label="Vazn H1" name="weight_h1">
              <a-input-number
                v-model:value="formState.weight_h1"
                class="w-full"
                placeholder="Vaznni kiriting"
              />
            </a-form-item>
            <a-form-item label="Vazn H2" name="weight_h2">
              <a-input-number
                v-model:value="formState.weight_h2"
                class="w-full"
                placeholder="Vaznni kiriting"
              />
            </a-form-item>
          </template>

          <a-form-item label="Birlik" name="measurement_unit_id">
            <a-select
              v-model:value="formState.measurement_unit_id"
              class="min-w-[120px] w-full"
              placeholder="Birlikni tanlang"
              show-search
              :filterOption="filterOption"
              :options="
                units.map((item) => ({
                  value: item.id.toString(),
                  label: item.title,
                }))
              "
            />
          </a-form-item>

          <a-form-item
            label="Xodimlar yig'indisi keladi"
            name="not_editable_worker_ids"
          >
            <a-select
              v-model:value="formState.not_editable_worker_ids"
              class="min-w-[120px] w-full"
              placeholder="Xodimlarni tanlang"
              mode="multiple"
              show-search
              :filterOption="filterOption"
              :options="
                users.map((user) => ({
                  value: user.id.toString(),
                  label: `${user.first_name} ${user.last_name || ''} ${
                    user.surname || ''
                  }`.trim(),
                }))
              "
            />
          </a-form-item>

          <a-form-item
            label="Kriteria shakllanadigan xodimlar"
            name="allowed_worker_ids"
          >
            <a-select
              v-model:value="formState.allowed_worker_ids"
              class="min-w-[120px] w-full"
              placeholder="Xodimlarni tanlang"
              mode="multiple"
              show-search
              :filterOption="filterOption"
              :options="
                users.map((user) => ({
                  value: user.id.toString(),
                  label: `${user.first_name} ${user.last_name || ''} ${
                    user.surname || ''
                  }`.trim(),
                }))
              "
            />
          </a-form-item>

          <a-form-item label="S5" name="sub_criteria_ids">
            <a-select
              v-model:value="formState.sub_criteria_ids"
              class="min-w-[120px] w-full"
              placeholder="Kriterialarni tanlang"
              mode="multiple"
              show-search
              :filterOption="filterOption"
              :options="
                criterias.map((item) => ({
                  value: item.id?.toString() || '',
                  label: item.title,
                }))
              "
            />
          </a-form-item>

          <a-form-item label="S5 2" name="district_children_ids">
            <a-select
              v-model:value="formState.district_children_ids"
              class="min-w-[120px] w-full"
              placeholder="Kriterialarni tanlang"
              mode="multiple"
              show-search
              :filterOption="filterOption"
              :options="
                criterias.map((item) => ({
                  value: item.id?.toString() || '',
                  label: item.title,
                }))
              "
            />
          </a-form-item>

          <a-form-item
            class="col-span-4"
            label="Yig'indisi rahbarga boradi"
            name="workers_hierarchy"
          >
            <a-select
              v-model:value="workers_hierarchy"
              class="min-w-[120px] w-full"
              placeholder="Xodimlarni tanlang"
              mode="multiple"
              show-search
              :filterOption="filterOption"
              :options="
                users.map((user) => ({
                  value: user.id.toString(),
                  label: `${user.first_name} ${user.last_name || ''} ${
                    user.surname || ''
                  }`.trim(),
                }))
              "
            />
          </a-form-item>
        </div>

        <div
          v-if="
            formState.workers_hierarchy &&
            formState.workers_hierarchy.length > 0
          "
          class="w-full col-span-3 overflow-auto"
        >
          <div class="mb-3 text-sm">Rahbarlarga xodim biriktirish</div>
          <WorkerHierarchy
            v-for="(item, index) in formState.workers_hierarchy"
            v-model:items="formState.workers_hierarchy"
            :key="`user-${index}`"
            :worker="item"
            :editable="true"
            :users
          />
        </div>
      </div>
    </a-form>
  </a-modal>
</template>
