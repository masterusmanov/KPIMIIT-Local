<template>
  <button 
    ref="toggleButtonRef"
    @click="toggleSidebar"
    class="toggle-btn fixed bg-gradient-to-r from-[#34548C] to-[#052C71] text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-700"
    :style="{ 
      left: isCollapsed ? '6px' : '240px',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 99999
    }"
  >
    <LeftOutlined v-if="!isCollapsed" class="text-[14px]" />
    <RightOutlined v-else class="text-[14px]" />
  </button>

  <div 
    ref="sidebarRef" 
    class="bg-[#052C71] text-white flex flex-col rounded-l-[16px] transition-all duration-700 ease-in-out"
    :class="{ 
      'w-[240px]': !isCollapsed,
      'w-0 opacity-100': isCollapsed 
    }"
    style="height: 100%; overflow: hidden;"
  >
    <!-- Menu Items -->
    <nav class="flex-1 pt-8 pl-8">
      <ul class="space-y-2">
        <li v-for="item in menuItems" :key="item.id">
          <RouterLink 
            :to="item.link"
            class="relative z-30 px-4 py-2 w-[calc(100%-16px)] flex items-center gap-2 rounded-[10px] bg-gradient-to-r from-white/20 to-transparent transition-all duration-300"
            :class="[
              'w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-left',
              selectedItem === item.id 
                ? 'relative z-30 px-4 py-2 w-[calc(100%-16px)] flex items-center gap-2 rounded-[10px] bg-gradient-to-r from-white/20 to-transparent transition-all duration-300' 
                : 'hover:bg-white hover:bg-opacity-10'
            ]" 
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span class="text-[14px] font-medium font-sans">{{ item.label }}</span>
          </RouterLink>
        </li>
      </ul>

      <div
        class="absolute flex-center left-1 min-w-8 -translate-x-2 top-6 !shrink-0 !size-8 bg-gray-100 z-40 shadow-backRoute rounded-md cursor-pointer group duration-200 hover:bg-blue-300"
        @click="router.push('/')"
      >
        <HomeOutlined
          class="text-[#0C0981] text-xl font-bold duration-200 group-hover:text-white"
        />
      </div>

      <div
        class="absolute bg-gray-100 flex-center group duration-200 hover:bg-blue-300 left-1 min-w-8 -translate-x-2 top-16 !shrink-0 !size-8 z-50 shadow-backRoute rounded-md cursor-pointer"
        @click="handleNavigate"
      >
        <LeftOutlined
          class="text-[#0C0981] text-lg font-bold duration-200 group-hover:text-white"
        />
      </div>
    </nav>    
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import {
  SoundOutlined,
  CarryOutOutlined,
  FlagOutlined,
  BookOutlined,
  ExclamationCircleOutlined,
  CustomerServiceOutlined, 
  HomeOutlined,
  UsergroupDeleteOutlined,
  LeftOutlined,
  RightOutlined  
} from "@ant-design/icons-vue";
import { useRoute, useRouter } from "vue-router";

// Menu items type definition
interface MenuItem {
  id: string
  label: string
  icon: any
  link: string
}

const route = useRoute();
const router = useRouter();

const isCollapsed = ref<boolean>(true);
const sidebarRef = ref<HTMLElement | null>(null);
const toggleButtonRef = ref<HTMLElement | null>(null);
const isToggling = ref<boolean>(false); // Debounce uchun flag

// YAXSHILANGAN toggle function
const toggleSidebar = async (event?: Event): Promise<void> => {
  // Debounce: agar toggle jarayonida bo'lsa, ignore qilish
  if (isToggling.value) {
    return;
  }

  // Event'ni to'xtatish (bubbling'ni oldini olish)
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }

  isToggling.value = true;

  try {
    isCollapsed.value = !isCollapsed.value;
    console.log('Sidebar toggled:', isCollapsed.value ? 'closed' : 'opened');
    
    // DOM yangilashini kutish
    await nextTick();
    
    // Kichik delay qo'shish (animation uchun)
    await new Promise(resolve => setTimeout(resolve, 100));
    
  } finally {
    isToggling.value = false;
  }
};

// YAXSHILANGAN click outside function
const handleClickOutside = (event: MouseEvent): void => {
  // Agar toggle jarayonida bo'lsa yoki sidebar yopiq bo'lsa, ignore qilish
  if (isToggling.value || isCollapsed.value) {
    return;
  }

  const target = event.target as Element;
  
  // Null check
  if (!target || !sidebarRef.value || !toggleButtonRef.value) {
    return;
  }

  // Agar click sidebar yoki toggle button ichida bo'lsa, ignore qilish
  const isClickInsideSidebar = sidebarRef.value.contains(target);
  const isClickOnToggleButton = toggleButtonRef.value.contains(target);
  
  if (!isClickInsideSidebar && !isClickOnToggleButton) {
    console.log('Click outside detected, closing sidebar');
    isCollapsed.value = true;
  }
};

const handleNavigate = (): void => {
  router.back();
};

// Menu items data
const menuItems: MenuItem[] = [
  { id: 'home', label: 'Bosh sahifa', icon: HomeOutlined, link: '/' },
  // { id: 'projects', label: 'Loyihalar', icon: CarryOutOutlined, link: '/projects' },
  // { id: 'team', label: 'Hamkorlik', icon: UsergroupDeleteOutlined, link: '/team' },
  // { id: 'news', label: 'Yangiliklar', icon: SoundOutlined, link: '/news' },
  // { id: 'organizations', label: 'Milliy tashkilotlar', icon: FlagOutlined, link: '/organizations' },
  // { id: 'resources', label: 'Resurslar', icon: BookOutlined, link: '/resources' },
  // { id: 'about', label: 'Platforma haqida', icon: ExclamationCircleOutlined, link: '/about' },
  { id: 'contact', label: 'Qayta aloqa', icon: CustomerServiceOutlined, link: 'feedback' }
];

// Reactive variables
const selectedItem = ref<string>('home');
const currentTime = ref<string>('');

// Methods
const selectItem = (id: string): void => {
  selectedItem.value = id;
  console.log('Selected item:', id);
};

const updateTime = (): void => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('uz-UZ', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// Lifecycle hooks
let timeInterval: number | undefined;

onMounted(async (): Promise<void> => {
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
  
  // DOM to'liq yuklanishini kutish
  await nextTick();
  
  // Click outside event listener qo'shish (kichik delay bilan)
  setTimeout(() => {
    document.addEventListener('click', handleClickOutside, true); // capture phase'da ishlash
    console.log('Click outside listener added');
  }, 100);
});

onUnmounted((): void => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
  
  // Event listener'ni olib tashlash
  document.removeEventListener('click', handleClickOutside, true);
  console.log('Click outside listener removed');
});
</script>

<style scoped>
/* Button'ga pointer events qo'shish */
.toggle-btn {
  pointer-events: auto;
  user-select: none;
}

/* Sidebar transition'ni yaxshilash */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Click events'ni yaxshilash */
.toggle-btn:active {
  transform: translateY(-50%) scale(0.95);
}
</style>