<!-- layout/default/index.vue -->
<script lang="ts" setup>
import { computed, watch, onMounted  } from "vue";
import { useRoute } from "vue-router";
import Header from "../components/Header.vue";
import Sidebar from "../components/Sidebar.vue";
import Navbar from "./navbar.vue";
import HeaderTwo from "../components/HeaderTwo.vue";
import Navbartwo from "../components/OtherComponents/navbartwo.vue";
// import MainHeader from "../components/MainHeader.vue";
import { useDistStore } from "@/stores/district";

const route = useRoute();
const distStore = useDistStore();

onMounted(() => {
  distStore.fetchViloyatlar();
});

// URL /ministry ga teng yoki yo'qligini tekshirish
const isMinistryPage = computed(() => {
  const result = route.path === '/ministry' || route.path.startsWith('/ministry/');
  console.log('Current path:', route.path);
  console.log('Is ministry page:', result);
  return result;
});

// MainHeader ko'rsatish kerak bo'lgan sahifalarni tekshirish
const shouldShowMainHeader = computed(() => {
  const mainHeaderPaths = [
    '/info/district',
    '/execution/district',
    '/efficiency/district',
    '/analytics/district',
    '/manage/users',
    '/manage/stages',
    '/manage/criteria#',
    '/manage/criteria'
  ];
  
  // Aniq path yoki path bilan boshlanuvchi barcha yo'llarni tekshirish
  const result = mainHeaderPaths.some(path => 
    route.path === path || route.path.startsWith(path + '/')
  );
  
  console.log('Should show MainHeader:', result);
  return result;
});

// Navbar ko'rsatish kerak yoki yo'qligini tekshirish
const shouldShowNavbar = computed(() => {
  // Navbar ko'rsatilmaydigan /manage/ sahifalar ro'yxati
  const managePagesThatHideNavbar = [
    '/manage/users',
    '/manage/stages', 
    '/manage/criteria'
  ];
  
  // Agar /manage/ sahifasi bo'lsa, lekin navbar ko'rsatilmaydigan ro'yxatda bo'lsa
  if (route.path.startsWith('/manage/')) {
    const shouldHide = managePagesThatHideNavbar.some(path => 
      route.path === path || route.path.startsWith(path + '/')
    );
    console.log('Should hide navbar (specific manage page):', shouldHide);
    return !shouldHide; // Ro'yxatda bo'lmasa ko'rsat (/manage/plan kabi)
  }
  
  // Boshqa barcha sahifalar uchun navbar ko'rsat
  return true;
});

// Route o'zgarishini kuzatish
watch(() => route.path, (newPath) => {
  console.log('Route changed to:', newPath);
}, { immediate: true });
</script>

<template>
  <div class="relative flex justify-between p-4 h-screen bg-[#D1DAEC]">
    <!-- Asosiy container -->
    <div class="relative rounded-[16px] w-full overflow-hidden">
      <!-- Main content (sidebar ostida) -->
      <div class="bg-white rounded-[16px] p-4 w-full h-full flex flex-col">
        <!-- Shartli Header ko'rsatish -->
        <Header v-if="!isMinistryPage" />
        <!-- <HeaderStat v-if="!isMinistryPage" /> -->
        <HeaderTwo v-if="isMinistryPage" />
        <!-- <MainHeader v-if="shouldShowMainHeader"/> -->
        
        <!-- Shartli Navbar ko'rsatish - TO'G'RILANGAN -->
        <Navbartwo v-if="isMinistryPage" />
        <Navbar  v-else-if="shouldShowNavbar" />
        
        <main class="flex-1 overflow-y-auto">
          <RouterView />
        </main>
      </div>
      
      <!-- Sidebar overlay qilib qo'yish (main content ustida) -->
      <div class="absolute top-0 left-0 h-full z-50">
        <Sidebar />
      </div>
    </div>
  </div>
</template>

<style>
/* Main container uchun scroll */
main {
  /* Maksimal balandlikni belgilash */
  max-height: calc(100vh - 200px); /* Header va Navbar uchun joy qoldirish */
}

/* Custom scrollbar (ixtiyoriy) */
main::-webkit-scrollbar {
  width: 6px;
}

main::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

main::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

main::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Sidebar overlay stillari */
.sidebar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 50;
  height: 100%;
  transition: transform 0.3s ease-in-out;
}

/* Agar sidebar yopiq bo'lsa, uni chapga siljitish */
.sidebar-hidden {
  transform: translateX(-100%);
}

/* Sidebar ochiq bo'lganda main content'ga shadow qo'shish (ixtiyoriy) */
.content-with-sidebar-overlay::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 40;
  pointer-events: none;
}
</style>