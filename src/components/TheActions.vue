<script lang="ts" setup>
import {
  EyeFilled,
  CheckOutlined,
  EditOutlined,
  CloseOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import type { FunctionalComponent } from "vue";

interface Action {
  show?: boolean;
  label: string;
  tooltip: string;
  icon: FunctionalComponent;
  onClick: () => void;
  class?: string;
  type?: "text" | "primary" | "danger" | "default"; // button type
  disabled?: boolean;
}

const props = defineProps({
  actions: {
    type: Array as PropType<Action[]>,
    required: true,
  },
});

const baseActions = [
  {
    label: "show",
    tooltip: "Ko'rish",
    icon: EyeFilled,
    class: "text-cBlue",
  },
  {
    label: "save",
    tooltip: "Saqlash",
    icon: CheckOutlined,
    class: "text-cBlue",
  },
  {
    label: "edit",
    tooltip: "Tahrirlash",
    icon: EditOutlined,
    class: "text-cBlue",
  },
  {
    label: "cancel",
    tooltip: "Bekor qilish",
    icon: CloseOutlined,
    class: "text-cRed",
  },
  {
    label: "delete",
    tooltip: "O'chirish",
    icon: DeleteOutlined,
    class: "text-cRed",
  },
];

const getActions = computed(() => {
  return props.actions.map((action) => {
    let isExists = baseActions.find(
      (baseAction) => baseAction.label === action.label
    );

    if (isExists) {
      return {
        ...isExists,
        ...action,
      };
    }

    return action;
  });
});
</script>

<template>
  <div class="w-full flex justify-center items-center gap-3">
    <template v-for="(action, index) in getActions" :key="index">
      <template v-if="action.show ?? true">
        <!-- Delete with confirmation -->
        <a-popconfirm
          v-if="action.label === 'delete'"
          title="Ishonchingiz komilmi?"
          ok-text="Ha"
          cancel-text="Yo‘q"
          placement="topRight"
          @confirm="action.onClick"
        >
          <a-popover placement="top" trigger="hover">
            <template #content>
              {{ action.tooltip }}
            </template>

            <button
              class="text-base"
              :class="action.class ?? ''"
              type="button"
              :danger="action.label === 'delete'"
              :disabled="action.disabled"
            >
              <component :is="action.icon" />
            </button>
          </a-popover>
        </a-popconfirm>

        <!-- Other actions -->
        <a-popover v-else placement="top" trigger="hover">
          <template #content>
            {{ action.tooltip }}
          </template>

          <button
            class="text-base"
            :class="action.class ?? ''"
            type="button"
            :disabled="action.disabled"
            @click="action.onClick"
          >
            <component :is="action.icon" />
          </button>
        </a-popover>
      </template>
    </template>
  </div>
</template>
