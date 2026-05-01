<template>
  <div class="flex items-center space-x-7">
    <div class="space-y-3 border-r-2 px-2 border-gray-300">
      <!-- Language Selector -->
      <div class="flex items-center gap-4">
        <a-select
          class="w-22"
          @change="switchLocale"
          v-model:value="i18n.locale.value"
        >
          <a-select-option value="uz" class=""> O'zbekcha </a-select-option>
          <a-select-option value="ru"> Русский </a-select-option>
        </a-select>
      </div>

      <!-- User Profile Dropdown -->
      <div v-if="store.user" class="relative ml-auto gap-2 items-center">
        <a-dropdown trigger="click" placement="bottomRight">
          <div class="cursor-pointer relative">
            <a-avatar
              :size="avatarSize"
              :src="store.user.image_url"
              class="mx-auto"
            >
              <template #icon><UserOutlined /></template>
            </a-avatar>
            <span class="flex items-center justify-center rounded-full absolute bg-white shadow size-5 top-1/2 right-5 -translate-y-1/2 translate-x-1/3">
              <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.72974 1.51352L5.00001 5.08109L8.27028 1.51352" stroke="#6E87BD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span>
          </div>
          <template #overlay>
            <a-menu class="shadow-md shadow-black border border-gray-100">
              <div class="p-2 w-[120px] xl:w-[150px]">
                <p class="text-center font-semibold mt-[10px] text-[10px] xl:text-[12px]">
                  {{ store.user.first_name }} {{ store.user.last_name }}
                </p>
                <div class="flex items-center justify-between text-[14px] font-semibold">
                  <p class="text-[10px] xl:text-[12px]">Rol:</p>
                  <p class="text-[10px] xl:text-[12px]">{{ store.user.role }}</p>
                </div>
              </div>
              <a-menu-item @click="store.logout()">
                <div class="flex items-center justify-between gap-2 text-red-500 font-semibold text-[10px] xl:text-[12px]">
                  Chiqish
                  <LogOut class="size-5" />
                </div>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>

    <!-- Admin Menu Dropdown -->
    <a-dropdown
      v-if="store.canAccess(null, ['ADMIN', 'SUPERADMIN'])"
      trigger="click"
    >
      <MenuOutlined class="ml-2 cursor-pointer text-xl" @click.prevent />
      <template #overlay>
        <a-menu>
          <template v-for="(item, index) in menuItems" :key="index">
            <a-menu-item v-if="item.allow">
              <router-link :to="item.link">
                {{ item.name }}
              </router-link>
            </a-menu-item>
          </template>
          <hr class="mt-2 mb-1" />
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { LogOut } from "lucide-vue-next";
import { UserOutlined, MenuOutlined } from "@ant-design/icons-vue";

const i18n = useI18n();
const store = useStore();

// Avatar size responsive
const avatarSize = ref(50);

const handleResize = () => {
  const width = window.innerWidth;
  if (width < 1440) {
    avatarSize.value = 40;
  } else {
    avatarSize.value = 50; // lg va yuqorisi
  }
};

// Language switching
const switchLocale = (e: any) => {
  localStorage.setItem("i18n_language", e);
  i18n.locale.value = e;
  location.reload();
};

// Menu items for admin dropdown
const menuItems = [
  {
    name: "S1-Mas'ul shahs biriktirish",
    link: "/manage/users",
    allow: store.canAccess(null, ["SUPERADMIN", "HR_MANAGER"]),
  },
  {
    name: "S2- Reja kiritish ",
    link: "/manage/plan",
    allow: store.canAccess(null, ["ADMIN"], false),
  },
  {
    name: "S3-Pog'ona",
    link: "#",
    allow: store.canAccess(null, ["SUPERADMIN"]),
  },
  {
    name: "S4-Investitsiya jarayoni boshqichlari",
    link: "/manage/stages",
    allow: store.canAccess(null, ["SUPERADMIN"]),
  },
  {
    name: "Mezonlar",
    link: "/manage/criteria",
    allow: store.canAccess(null, ["SUPERADMIN"]),
  },
];

// Lifecycle hooks
onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
::v-deep(.ant-select-selection-item) {
  font-size: 12px;
}

@media (min-width: 640px) {
  ::v-deep(.ant-select-selection-item) {
    font-size: 14px;
  }
}

@media (min-width: 768px) {
  ::v-deep(.ant-select-selection-item) {
    font-size: 8px;
  }
}

@media (min-width: 1440px) {
  ::v-deep(.ant-select-selection-item) {
    font-size: 12px;
  }
}
</style>