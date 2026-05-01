<template>
  <header
    class="bg-white z-20 2xl:pb-4 border-b border-b-gray-100 sticky top-0 flex"
  >
    <div
      class="flex justify-between space-x-1 relative items-center w-full px-1 2xl:px-4"
    >
      <StatMinistry/>

      <div class="flex items-center space-x-7">
        <div class="space-y-3 border-r-2 px-2 border-gray-300">
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
              <span class="flex items-center justify-center rounded-full absolute bg-white shadow size-5 top-1/2 right-5 -translate-y-1/2 translate-x-1/3"><svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.72974 1.51352L5.00001 5.08109L8.27028 1.51352" stroke="#6E87BD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>
              </div>
              <template #overlay>
                <a-menu class="shadow-md shadow-black border border-gray-100">
                  <div class="p-2 w-[120px] xl:w-[150px]">
                    <p class="text-center font-semibold mt-[10px] text-[10px] xl:text-[12px]">
                      {{ store.user.first_name }} {{ store.user.last_name }}
                    </p>
                    <div
                      class="flex items-center justify-between text-[14px] font-semibold"
                    >
                      <p class="text-[10px] xl:text-[12px]">Rol:</p>
                      <p class="text-[10px] xl:text-[12px]">{{ store.user.role }}</p>
                    </div>
                  </div>
                  <a-menu-item @click="store.logout()">
                    <div
                      class="flex items-center justify-between gap-2 text-red-500 font-semibold text-[10px] xl:text-[12px]"
                    >
                      Chiqish
                      <LogOut class="size-5" />
                    </div>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </div>

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

              <!-- <a-menu-item @click="store.logout()">
                <div class="flex items-center gap-2 text-red-500 font-semibold">
                  <LogOut class="size-5" />
                  Chiqish
                </div>
              </a-menu-item> -->
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { LogOut } from "lucide-vue-next";
// import { DownOutlined } from "@ant-design/icons-vue";
import StatMinistry from "./OtherComponents/StatMinistry.vue";


const i18n = useI18n();

const route = useRoute();
const store = useStore();
const avatarSize = ref(50)


const handleResize = () => {
  const width = window.innerWidth
  if (width < 1440) {
    avatarSize.value = 40
  } else {
    avatarSize.value = 50 // lg va yuqorisi
  }
}

// Region interface
interface Region {
  id: number;
  name: string;
  color: string;
  textColor: string;
  borderClass: string;
  allPercent: number;
  upPercent: number;
  downPercent: number;
}

const menuItems = [
  {
    name: "S1-Mas’ul shahs biriktirish",
    link: "/manage/users",
    allow: store.canAccess(null, ["SUPERADMIN", "HR_MANAGER"]),
  },
  {
    name: "S2- Reja kiritish ",
    link: "/manage/plan",
    allow: store.canAccess(null, ["ADMIN"], false),
  },
  {
    name: "S3-Pog’ona",
    link: "#",
    allow: store.canAccess(null, ["SUPERADMIN"]),
  },
  {
    name: "S4-Investitsiya jarayoni boshqichlari",
    link: "/manage/stages",
    allow: store.canAccess(null, ["SUPERADMIN"]),
  },
  // {
  //   name: "Boshqich doirasidagi vazifalar",
  //   link: "#",
  // },
  {
    name: "Mezonlar",
    link: "/manage/criteria",
    allow: store.canAccess(null, ["SUPERADMIN"]),
  },
];
const switchLocale = (e: any) => {
  localStorage.setItem("i18n_language", e);
  i18n.locale.value = e;
  location.reload();
};

const regions = ref<Region[]>([
  {
    id: 1,
    name: "QQR",
    color: "bg-teal-500",
    textColor: "text-teal-500",
    borderClass: "border border-teal-500",
    allPercent: 40.16,
    upPercent: 6.19,
    downPercent: 43.87,
  },
  {
    id: 2,
    name: "Xorazm",
    color: "bg-blue-500",
    textColor: "text-blue-500",
    borderClass: "border border-blue-500",
    allPercent: 50.25,
    upPercent: 6.19,
    downPercent: 43.87,
  },
  {
    id: 3,
    name: "Navoiy",
    color: "bg-blue-500",
    textColor: "text-blue-500",
    borderClass: "border border-blue-500",
    allPercent: 40.08,
    upPercent: 6.19,
    downPercent: 43.87,
  },
  {
    id: 4,
    name: "Buxoro",
    color: "bg-blue-500",
    textColor: "text-blue-500",
    borderClass: "border border-blue-500",
    allPercent: 40.75,
    upPercent: 6.19,
    downPercent: 43.87,
  },
  {
    id: 5,
    name: "Samarqand",
    color: "bg-blue-500",
    textColor: "text-blue-500",
    borderClass: "border border-blue-500",
    allPercent: 40.96,
    upPercent: 6.19,
    downPercent: 43.87,
  },
  {
    id: 6,
    name: "Qashqadaryo",
    color: "bg-blue-500",
    textColor: "text-blue-500",
    borderClass: "border border-blue-500",
    allPercent: 40.56,
    upPercent: 6.19,
    downPercent: 43.87,
  },
  {
    id: 7,
    name: "Surxondaryo",
    color: "bg-blue-500",
    textColor: "text-blue-500",
    borderClass: "border border-blue-500",
    allPercent: 40.87,
    upPercent: 6.19,
    downPercent: 43.87,
  },
  {
    id: 8,
    name: "Andijon",
    color: "bg-orange-500",
    textColor: "text-orange-500",
    borderClass: "border border-orange-500",
    allPercent: 40.85,
    upPercent: 6.19,
    downPercent: 43.87,
  },
  {
    id: 9,
    name: "Farg'ona",
    color: "bg-orange-500",
    textColor: "text-orange-500",
    borderClass: "border border-orange-500",
    allPercent: 40.44,
    upPercent: 6.19,
    downPercent: 43.87,
  },
  {
    id: 10,
    name: "Toshkent sh.",
    color: "bg-red-500",
    textColor: "text-red-500",
    borderClass: "border border-red-500",
    allPercent: 40.56,
    upPercent: 6.19,
    downPercent: 43.87,
  },
  {
    id: 11,
    name: "Toshkent",
    color: "bg-red-500",
    textColor: "text-red-500",
    borderClass: "border border-red-500",
    allPercent: 40.65,
    upPercent: 6.19,
    downPercent: 43.87,
  },
  {
    id: 12,
    name: "Namangan",
    color: "bg-red-500",
    textColor: "text-red-500",
    borderClass: "border border-red-500",
    allPercent: 40.23,
    upPercent: 6.19,
    downPercent: 43.87,
  },
  {
    id: 13,
    name: "Jizzax",
    color: "bg-red-500",
    textColor: "text-red-500",
    borderClass: "border border-red-500",
    allPercent: 40.36,
    upPercent: 6.19,
    downPercent: 43.87,
  },
  {
    id: 14,
    name: "Sirdaryo",
    color: "bg-red-500",
    textColor: "text-red-500",
    borderClass: "border border-red-500",
    allPercent: 40.71,
    upPercent: 6.19,
    downPercent: 43.87,
  },
]);


onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
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
}</style>
