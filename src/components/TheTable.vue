<script lang="ts" setup>
import type { TableProps } from "ant-design-vue";

interface Props {
  scroll?: TableProps["scroll"];
  columns: TableProps["columns"];
  dataSource: TableProps["dataSource"];
  topScrollbar?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  scroll: () => ({ x: "max-content", y: 450 }),
  dataSource: () => [],
  topScrollbar: true,
});

const { dataSource } = toRefs(props);

const tableRef = ref<InstanceType<
  typeof import("ant-design-vue")["Table"]
> | null>(null);

const addCustomScrollbar = () => {
  if (props.topScrollbar) {
    nextTick(() => {
      const tableEl = tableRef.value?.$el as HTMLElement | null;
      if (!tableEl) return;

      const container = tableEl.querySelector(
        ".ant-table-container"
      ) as HTMLElement | null;
      const header = container?.querySelector(
        ".ant-table-header"
      ) as HTMLElement | null;
      const body = container?.querySelector(
        ".ant-table-body"
      ) as HTMLElement | null;

      if (!container || !header || !body) return;

      // Delay to allow body width to update
      setTimeout(() => {
        // ✅ Move check inside timeout to avoid race condition
        if (container.querySelector(".custom-table-scrollbar")) return;

        const scrollbar = document.createElement("div");
        scrollbar.className = "custom-table-scrollbar";
        scrollbar.style.overflowX = "auto";
        scrollbar.style.overflowY = "scroll";
        scrollbar.style.height = "16px";

        const inner = document.createElement("div");
        inner.style.height = "1px";
        inner.style.width = body.scrollWidth + "px";

        scrollbar.appendChild(inner);
        header.after(scrollbar);

        // Sync scroll
        scrollbar.onscroll = () => {
          body.scrollLeft = scrollbar.scrollLeft;
        };
        body.onscroll = () => {
          scrollbar.scrollLeft = body.scrollLeft;
        };
      }, 300); // Adjust delay if needed
    });
  }
};

const updateScrollbar = () => {
  nextTick(() => {
    const tableEl = tableRef.value?.$el as HTMLElement | null;
    if (!tableEl) return;

    const container = tableEl.querySelector(
      ".ant-table-container"
    ) as HTMLElement | null;
    const body = container?.querySelector(
      ".ant-table-body"
    ) as HTMLElement | null;
    const scrollbar = container?.querySelector(
      ".custom-table-scrollbar"
    ) as HTMLElement | null;

    if (!container || !body || !scrollbar) return;

    const inner = scrollbar.firstElementChild as HTMLElement | null;
    if (inner) {
      inner.style.width = body.scrollWidth + "px";
    }

    // Optional: resync scroll positions
    scrollbar.scrollLeft = body.scrollLeft;
  });
};

onMounted(() => {
  addCustomScrollbar();
});

watch(dataSource, () => {
  addCustomScrollbar();
});

defineExpose({
  updateScrollbar,
});
</script>

<template>
  <div class="relative">
    <a-table
      ref="tableRef"
      class="the-table"
      v-bind="$attrs"
      v-on="$attrs"
      :scroll="props.scroll"
      :data-source="props.dataSource"
      :columns="props.columns"
      bordered
    >
      <template v-for="(_, name) in $slots" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps" />
      </template>
    </a-table>
  </div>
</template>
