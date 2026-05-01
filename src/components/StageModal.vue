<script lang="ts" setup>
import http from "@/libs/axios";
import { message } from "ant-design-vue";

type Stage = {
  id?: number;
  title: string;
  rank_ids: number[];
  director_id: number | string | null;
  status: boolean;
};

const open = defineModel("open");
const props = defineProps<{
  type?: "create" | "update";
  stage: Stage;
}>();
const emits = defineEmits(["success"]);

const { filterOption } = useMe();
const store = useStore();

const formState = reactive<Stage>({
  title: "",
  rank_ids: [],
  director_id: null,
  status: true,
});
const formRef = ref();
const users = ref<User[]>([]);

const rules = {
  title: [{ required: true, message: "Nom majburiy!", trigger: "blur" }],
  rank_ids: [
    { required: true, message: "Pog'onani tanlang!", trigger: "change" },
  ],
  director_id: [
    { required: true, message: "Pog'onani tanlang!", trigger: "change" },
  ],
};

const fetchUsers = async (): Promise<void> => {
  try {
    const res = await http.get<Res<User>>(`/user/list`);
    users.value = res.data.data?.results || [];
  } catch (e) {
    console.log(e);
  }
};

const handleSubmit = async (): Promise<void> => {
  try {
    await formRef.value.validate();

    let res: any = "";
    if (props.type == "create") {
      res = await http.post(`/investment_process_stage/create`, {
        ...formState,
        director_id: Number(formState.director_id),
      });
    } else {
      res = await http.patch(`/investment_process_stage/update`, {
        ...formState,
        id: props.stage.id,
        director_id: Number(formState.director_id),
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

watch(
  () => open.value,
  () => {
    formState.title = props.stage.title || "";
    formState.rank_ids = props.stage.rank_ids || [];
    formState.director_id = props.stage.director_id?.toString() || null;
    formState.status = props.stage.status || true;
    users.value.length === 0 && fetchUsers();
  }
);
</script>
<template>
  <a-modal
    v-model:open="open"
    :maskClosable="false"
    cancelText="Bekor qilish"
    okText="Saqlash"
    centered
    @ok="handleSubmit"
  >
    <template #title>
      <div class="text-lg">
        {{ type == "create" ? "Bosqich qo'shish" : "Bosqichni tahrirlash" }}
      </div>
    </template>

    <a-form
      class="mt-5 w-full"
      ref="formRef"
      :model="formState"
      :rules
      layout="vertical"
    >
      <a-form-item label="Nomi" name="title">
        <a-textarea
          v-model:value="formState.title"
          class="w-full"
          placeholder="Bosqich nomi"
          :auto-size="{ minRows: 1, maxRows: 5 }"
        />
      </a-form-item>

      <a-form-item label="Pog'ona" name="rank_ids">
        <a-select
          v-model:value="formState.rank_ids"
          class="w-full"
          placeholder="Pog'onani tanlang"
          mode="multiple"
        >
          <a-select-option
            v-for="item in store.ranks"
            :key="item.id"
            :value="item.id"
          >
            {{ item.title }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="Viloyat o'rinbosari" name="director_id">
        <a-select
          v-model:value="formState.director_id"
          class="w-full"
          placeholder="Viloyat o'rinbosarini tanlang"
          show-search
          :filter-option="filterOption"
          :options="
            users.map((user) => ({
              value: user.id.toString(),
              label: `${user.first_name} ${user.last_name || ''} ${
                user.surname || ''
              }`,
            }))
          "
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
