<script setup lang="ts">
interface Item {
  id: number;
  full_name: string;
  children?: any[];
}

const { filterOption } = useMe();

const items = defineModel<Item[]>("items");
const props = defineProps<{
  worker: Item;
  editable: boolean;
  users?: User[];
}>();

const open = ref<boolean>(false);
const formRef = ref();
const formState = reactive({
  users: [],
});

const rules = {
  users: [{ required: true, message: "Xodimni tanlang!", trigger: "change" }],
};

const selectEmployee = async (): Promise<void> => {
  try {
    await formRef.value.validate();

    props.worker.children = props.worker.children || [];
    props.worker.children?.push();

    formState.users.forEach((item) => {
      const user = props.users?.find((u: User) => u.id == item);
      props.worker.children?.push({
        id: user?.id,
        full_name: `${user?.first_name} ${user?.last_name || ""} ${
          user?.surname || ""
        }`.trim(),
      });
    });

    open.value = false;
    formState.users = [];
  } catch (e) {
    console.error(e);
  }
};
</script>

<template>
  <teleport to="body">
    <a-modal
      v-model:open="open"
      title="Xodim biriktirish"
      :maskClosable="false"
      centered
      cancelText="Bekor qilish"
      okText="Saqlash"
      @ok="selectEmployee"
    >
      <a-form
        class="w-full"
        ref="formRef"
        :model="formState"
        :rules
        layout="vertical"
      >
        <a-form-item label="Xodim" name="users">
          <a-select
            v-model:value="formState.users"
            placeholder="Xodimni tanlang"
            show-search
            mode="multiple"
            :options="
              users?.map((user) => ({
                value: user.id,
                label: `${user.first_name} ${user.last_name || ''} ${
                  user.surname || ''
                }`.trim(),
              }))
            "
            :filter-option="filterOption"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </teleport>

  <div class="w-full">
    <div class="flex items-stretch">
      <div
        class="p-2 w-[250px] text-left flex flex-col items-start justify-center gap-2 border"
      >
        {{ worker.full_name }}

        <div v-if="editable" class="flex gap-2">
          <a-button type="primary" size="small" @click="open = true">
            <div class="flex items-center gap-1">
              <svg
                class="size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>

              <span class="text-xs"> Qo'shish</span>
            </div>
          </a-button>

          <a-button
            type="primary"
            size="small"
            danger
            @click="items = items?.filter((item) => item.id !== worker.id)"
          >
            <div class="flex items-center gap-1">
              <svg
                class="size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>

              <span class="text-xs">O'chirish</span>
            </div>
          </a-button>
        </div>
      </div>
      <div v-if="worker.children && worker.children.length">
        <WorkerHierarchy
          v-for="child in worker.children"
          v-model:items="worker.children"
          :key="child.id"
          :worker="child"
          :editable="editable"
          :users
        />
      </div>
    </div>
  </div>
</template>
