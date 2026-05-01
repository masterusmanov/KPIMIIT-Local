<script lang="ts" setup>
const props = defineProps<{
  title?: string;
}>();

const { t, tm, rt } = useI18n();
const router = useRouter();
const route = useRoute();

const defaultMonth = computed(() => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-based (0 = January)
  const day = today.getDate();

  // If it's the 1st to 5th of the month, return previous month
  if (day <= 5) {
    return month === 0 ? 12 : month; // Return 12 if January
  } else {
    return month + 1; // Return 1-based month
  }
});

// Year selection
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
const selectedYear = ref<number>(
  route.query && route.query.year
    ? Number(route.query.year as string)
    : currentYear
);

// Month selection
const months = computed(() => tm("date.months"));
const selectedMonth = ref<number>(
  route.query && route.query.month
    ? Number(route.query.month as string)
    : defaultMonth.value
);
</script>
<template>
  <div class="w-full flex items-center gap-2 px-4">
    <!-- Title -->
    <div v-if="title" class="text-lg font-bold">{{ title }}</div>
    

    <!-- Slot -->
    <slot />

    
  </div>
</template>



<!-- <div class="ml-auto flex items-center gap-2">
      <!-- Year Selector -->
      <!-- <a-select
        v-model:value="selectedYear"
        class="the-datepicker"
        @change="
              (e:number) => {
                router.replace({query: {...route.query, year: e}});
              }
            "
      >
        <a-select-option v-for="year in years" :key="year" :value="year">
          {{ year }} {{ t("date.year") }}
        </a-select-option>
      </a-select>

      <!-- Month Selector -->
      <!-- <a-select
        v-model:value="selectedMonth"
        class="the-datepicker min-w-[100px]"
        @change="
              (e:string) => {
                router.replace({query: {...route.query, month: e}});
              }
            "
      >
        <a-select-option
          v-for="(month, index) in months"
          :key="index"
          :value="index + 1"
        >
          {{ rt(month) }}
        </a-select-option>
      </a-select> -->
    <!-- </div> --> 