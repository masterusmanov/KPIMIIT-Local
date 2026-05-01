<script lang="ts" setup>
import http from "@/libs/axios";
import { XIcon } from "lucide-vue-next";

const open = defineModel("open");
const props = defineProps<{
  id: number;
}>();

const store = useStore();
const { formatDuration } = useMe();

const user = ref<User | null>(null);
const monthlyProgress = ref<any[]>([]);
const loading = ref(false);

// Progress ma'lumotlarini olish
const fetchMonthlyProgress = async () => {
  try {
    const { data } = await http.get(`/user/${props.id}/monthly-progress`);
    monthlyProgress.value = data.data || [];
  } catch (error) {
    console.error("Monthly progress fetch error:", error);
    // Agar API yo'q bo'lsa, default qiymatlar
    monthlyProgress.value = [
      { month: "Yanvar", percentage: 100, value: "12,2" },
      { month: "Fevral", percentage: 80, value: "12,2" },
      { month: "Mart", percentage: 50, value: "12,2" },
      { month: "Aprel", percentage: 100, value: "12,2" },
    ];
  }
};

const fetchData = async () => {
  if (!props.id) return;
  
  try {
    loading.value = true;
    const { data } = await http.get(`/user/${props.id}`);
    user.value = data.data;
    
    // Progress ma'lumotlarini ham olish
    await fetchMonthlyProgress();
  } catch (error: any) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// Progress rangini aniqlash
const getProgressColor = (percentage: number) => {
  if (percentage >= 90) return "bg-green-500";
  if (percentage >= 70) return "bg-yellow-500";
  if (percentage >= 50) return "bg-orange-500";
  return "bg-red-500";
};

// Foydalanuvchi o'zi haqida ma'lumot ko'ra oladimi?
const canViewOwnDetails = computed(() => {
  return store.user?.role === 'WORKER' && user.value?.id === store.user?.id;
});

// Admin boshqa userlar haqida ko'ra oladimi?
const canViewUserProgress = computed(() => {
  return store.user?.role === 'SUPERADMIN' || store.user?.role === 'HR_MANAGER';
});

watch(() => open.value, (newVal) => {
  if (newVal) {
    fetchData();
  }
}, { immediate: true });
</script>

<template>
  <div class="relative w-full min-w-[580px] flex flex-col gap-4">
    <button
      class="absolute top-0 right-0 p-0.5 bg-slate-50 rounded-sm z-10"
      @click="open = false"
    >
      <XIcon class="size-5" />
    </button>

    <!-- Loading state -->
    <div v-if="loading" class="w-full py-8 flex justify-center">
      <a-spin size="large" />
    </div>

    <div v-else-if="user" class="w-full flex items-start justify-start gap-3">
      <div class="min-w-[140px] w-[140px] flex flex-col">
        <img
          class="w-full h-[170px] object-cover rounded-sm"
          :src="user.image_url || '/avatar-placeholder.png'"
          alt=""
        />
      </div>

      <div class="grow flex flex-col gap-3">
        <div class="pb-2 w-full flex flex-col gap-0.5 border-b">
          <div class="pr-8 text-base font-bold whitespace-nowrap capitalize">
            {{
              `${user.first_name?.toLowerCase()} ${user.last_name?.toLowerCase()} ${
                user.surname?.toLowerCase() || ""
              }`
            }}
          </div>
          <div class="text-sm text-slate-400 font-medium">
            {{ user.position }}
          </div>
        </div>

        <ul class="!mb-0 w-full text-sm flex flex-col gap-2">
          <li class="w-full flex items-center justify-between">
            <span class="font-bold">Tizimda:</span>
            <span class="mt-3 border-b border-dashed grow"></span>
            {{ user.hired_at ? formatDuration(user.hired_at) : "-" }}
          </li>
          <li class="w-full flex items-center justify-between">
            <span class="font-bold">Lavozimda:</span>
            <span class="mt-3 border-b border-dashed grow"></span>
            {{
              user.position_changed_at
                ? formatDuration(user.position_changed_at)
                : "-"
            }}
          </li>
          <li class="w-full flex items-center justify-between">
            <span class="font-bold">O'rtacha oylik:</span>
            <span class="mt-3 border-b border-dashed grow"></span>
            <span>{{ (user as any).average_monthly || "5 mln" }}</span>
          </li>
          <li class="w-full flex items-center justify-between">
            <span class="font-bold">Intizomiy jazo:</span>
            <span class="mt-3 border-b border-dashed grow"></span>
            <span>{{ (user as any).disciplinary_action || "Mavjud emas" }}</span>
          </li>
        </ul>

        <!-- Worker o'zi haqida qo'shimcha ma'lumotlar -->
        <!-- <div v-if="canViewOwnDetails" class="pt-2 border-t">
          <h4 class="text-sm font-bold mb-2 text-slate-600">Shaxsiy ma'lumotlar</h4>
          <ul class="w-full text-sm flex flex-col gap-1.5">
            <li class="w-full flex items-center justify-between">
              <span class="font-medium">PINFL:</span>
              <span class="mt-3 border-b border-dashed grow"></span>
              <span class="font-mono">{{ user.pinfl || "-" }}</span>
            </li>
            <li class="w-full flex items-center justify-between">
              <span class="font-medium">Login:</span>
              <span class="mt-3 border-b border-dashed grow"></span>
              <span>{{ user.login || "-" }}</span>
            </li>
            <li class="w-full flex items-center justify-between">
              <span class="font-medium">Viloyat:</span>
              <span class="mt-3 border-b border-dashed grow"></span>
              <span>{{ user.region_title || "-" }}</span>
            </li>
            <li class="w-full flex items-center justify-between">
              <span class="font-medium">Tuman:</span>
              <span class="mt-3 border-b border-dashed grow"></span>
              <span>{{ user.district_title || "-" }}</span>
            </li>
            <li class="w-full flex items-center justify-between">
              <span class="font-medium">Daraja:</span>
              <span class="mt-3 border-b border-dashed grow"></span>
              <span>{{ user.rank_title || "-" }}</span>
            </li>
            <li class="w-full flex items-center justify-between">
              <span class="font-medium">Departament:</span>
              <span class="mt-3 border-b border-dashed grow"></span>
              <span>{{ user.department_title || "-" }}</span>
            </li>
            <li class="w-full flex items-center justify-between">
              <span class="font-medium">Bo'lim:</span>
              <span class="mt-3 border-b border-dashed grow"></span>
              <span>{{ user.office_unit_title || "-" }}</span>
            </li>
          </ul>
        </div> -->
      </div>
    </div>

    <!-- Oylik natijalar (Admin va Worker o'zi uchun) -->
    <div 
      class="py-1 w-full flex items-stretch justify-start gap-1 border-t overflow-auto"
    >
      <div class="mb-2 w-full">
        <h4 class="text-sm font-bold mb-3 text-slate-600">
          {{ canViewOwnDetails ? 'Mening natijalarim' : 'Oylik natijalar' }}
        </h4>
        <div class="flex items-stretch justify-start gap-1 overflow-auto">
          <div
            v-for="(month, index) in monthlyProgress"
            :key="index"
            class="p-2 min-w-[90px] flex flex-col items-center gap-1.5 transition hover:bg-slate-100 rounded-md"
          >
            <div
              :class="getProgressColor(month.percentage)"
              class="size-12 flex items-center justify-center text-white text-xs rounded-full"
            >
              {{ month.percentage }}%
            </div>
            <div class="text-sm font-bold">{{ month.month }}</div>
            <div class="text-sm font-semibold">{{ month.value }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Ruxsat yo'q holatida -->
    <!-- <div 
      v-else-if="user && !canViewUserProgress && !canViewOwnDetails"
      class="py-4 text-center text-slate-500 border-t"
    >
      <p class="text-sm">Bu ma'lumotlarni ko'rish uchun ruxsatingiz yo'q.</p>
    </div> -->
  </div>
</template>