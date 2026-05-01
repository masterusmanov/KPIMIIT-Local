<!-- Map.vue -->
<script setup>
import { ref, computed, watch, onMounted } from "vue";
// import { storeToRefs } from "pinia";
// import { useListStore } from "@/stores/list";
// import { useDistStore } from "@/stores/district";
// import { useStore } from "@/stores/index.store";
// import http from "../../libs/axios";
import {
  Republic,
  Andijan,
  Bukhara,
  Djizzakh,
  Kashkadarya,
  Karakalpak,
  Namangan,
  Navoi,
  Samarkand,
  Surkhandarya,
  Syrdarya,
  Tashkent,
  TashkentCity,
  Fergana,
  Khorezm,
} from "./components/maps";
import { useI18n } from "vue-i18n";

import { useRegionState, getMapId } from "@/composables/useRegionState";

// const { selectedViloyat, selectedTuman, selectedViloyatObj } = useRegionState();

// const listStore = useListStore();
// const distStore = useDistStore();
// const indexStore = useStore();
// const { filter } = storeToRefs(listStore);
// const { selectedViloyatObj, selectedTuman } = storeToRefs(distStore);
const { selectedViloyat, selectedTuman, selectedViloyatObj, filter } = useRegionState();
const { locale } = useI18n();
// const filter = ref({ region: 'republic', district: '' });
const salary = ref(null);


const regionComponents = {
  1735: Karakalpak,
  1714: Namangan,
  1703: Andijan,
  1708: Djizzakh,
  1706: Bukhara,
  1710: Kashkadarya,
  1712: Navoi,
  1718: Samarkand,
  1722: Surkhandarya,
  1724: Syrdarya,
  1727: Tashkent,
  1730: Fergana,
  1733: Khorezm,
  1726: TashkentCity,
};

// ✅ Xaritada active viloyatni to'g'ri ko'rsatish uchun
// getRegion computed ni viloyatList ID → xarita ID orqali ishlashini ta'minlaymiz
const getRegion = computed(() => {
  if (!selectedViloyatObj.value) return null;
  const viloyatIdToMapId = {
    14: 1735, 6: 1714, 5: 1703, 12: 1708, 7: 1706,
    8: 1710,  10: 1712, 3: 1718, 9: 1722, 13: 1724,
    2: 1727,  4: 1730,  11: 1733, 1: 1726,
  };
  const mapId = viloyatIdToMapId[selectedViloyatObj.value.id];
  return regionComponents[mapId];
});

// Viloyat nomi
// const getRegionName = computed(() => {
//   if (selectedViloyatObj.value) {
//     return selectedViloyatObj.value.title;
//   }
//   return (
//     listStore.regions.find((region) => region.id == filter.value.region)
//       ?.name ?? ""
//   );
// });

// Tuman nomi
// const getDistrictName = computed(() => {
//   if (selectedTuman.value) {
//     return selectedTuman.value.title;
//   }
//   return (
//     listStore.districts?.find((d) => d.id == filter.value.district)?.name ?? ""
//   );
// });

// Respublika yoki viloyat holatini aniqlash
const isRepublicView = computed(() => {
  return !selectedViloyatObj.value;
});

const formatNumber = (value) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

// const fetchSalary = async () => {
//   try {
//     if (isRepublicView.value) {
//       salary.value = {};

//       // const res = await http.get(`/ip_frs1_2_region`, {
//       //   params: {
//       //     year: filter.value.year,
//       //   },
//       // });

//       salary.value.value = res.data.data ? res.data.data.value : 0;
//       salary.value.measure_unit_name = {
//         ru: "млрд. $",
//         uz: "mlrd. $",
//         en: "billion",
//       };
//       salary.value.name = res.data.data?.name;
//       salary.value.previous_year_value =
//         res.data.data?.previous_year_value ?? 0;
//       return;
//     }

//     const type = selectedTuman.value ? "district" : "region";
//     const id = selectedTuman.value
//       ? selectedTuman.value.id
//       : selectedViloyatObj.value?.id;

//     if (!id) return;

//     const res = await http.get(`/ip/${type}/children/from_statistics_data`, {
//       params: {
//         id: id,
//         code: "IP_FRS",
//         year: filter.value.year,
//       },
//     });

//     salary.value = res.data.data[0]?.children[1];
//     salary.value.measure_unit_name = {
//       ru: salary.value.measure_unit_name.ru.replace("долл.", " $"),
//       uz: salary.value.measure_unit_name.uz.replace("doll.", " $"),
//       en: salary.value.measure_unit_name.en,
//     };
//     salary.value.previous_year_value =
//       res.data.data[0]?.children[1]?.previous_year_value ?? 0;
//   } catch (error) {
//     console.error("Error fetching salary data:", error);
//   }
// };

// ✅ YANGI: Dinamik width class
const getMapWidthClass = computed(() => {
  if (!selectedViloyatObj.value)
    return "w-[80%] xl:w-[60%] mt-[50px] 2xl:mt-5 2xl:w-[60%] mx-auto";

  const regionId = selectedViloyatObj.value.id;

  // 80% width kerak bo'lgan viloyatlar
  const largeRegions = [1703, 1710, 1714, 1718, 1724, 1730, 1726]; // Andijon, Qashqadaryo, Namangan, Samarqand, Sirdaryo, Farg'ona, Toshkent shahri

  // 50% width kerak bo'lgan viloyatlar
  const smallRegions = [1727, 1733, 1722]; // Toshkent viloyati, Xorazm, Surxondaryo

  if (largeRegions.includes(regionId)) {
    return "w-[80%] xl:w-[85%] mt-[50px] 2xl:mt-20 2xl:w-[90%] mx-auto";
  } else if (smallRegions.includes(regionId)) {
    return "w-[50%] xl:w-[50%] mt-[50px] 2xl:mt-5 2xl:w-[55%] mx-auto";
  } else {
    // Qolgan viloyatlar uchun default (60%)
    return "w-[60%] xl:w-[60%] mt-[50px] 2xl:mt-5 2xl:w-[60%] mx-auto";
  }
});

// Back button handler
// const handleBack = () => {
//   console.log("=== MAP: BACK BUTTON BOSILDI ===");

//   if (selectedTuman.value) {
//     // Tumandan viloyatga qaytish
//     console.log("Tumandan viloyatga qaytish");
//     selectedTuman.value = null
//     // ✅ FAQAT filter yangilash, boshqa hech narsa qilmaslik
//     filter.value.district = "region";
//   } else if (selectedViloyatObj.value) {
//     // Viloyatdan respublikaga qaytish
//     console.log("Viloyatdan respublikaga qaytish");
//     selectedViloyat.value = null;
//     // ✅ FAQAT filter yangilash
//     filter.value.region = "republic";
//     filter.value.district = "region";
//   }
// };

const handleBack = () => {
  if (selectedTuman.value) {
    selectedTuman.value = null;
    // filter.value.district = 'region';
  } else if (selectedViloyatObj.value) {
    selectedViloyat.value = null;
    // filter.value.region = 'republic';
    // filter.value.district = 'region';
  }
};

// ✅ ASOSIY XATO - bu yerda refresh bo'ladi
// Viloyat tanlash handler - listStore.fetchDistrict ni olib tashlash
// const handleRegionClick = async (regionId) => {
//   console.log("=== MAP: VILOYAT BOSILDI ===");
//   console.log("Tanlangan viloyat ID:", regionId);

//   try {
//     // ✅ WORKER bo'lsa hech narsa qilmaslik
//     if (indexStore.user?.role === "WORKER") return;

//     // ✅ 1. Faqat store orqali viloyat tanlash
//     await distStore.selectViloyatById(regionId);

//     // ✅ 2. Filter ni yangilash (lekin fetchDistrict ni chaqirmaslik!)
//     filter.value.region = regionId.toString();
//     filter.value.district = "region";

//     // ✅ 3. listStore.fetchDistrict ni OLIB TASHLAYMIZ
//     // await listStore.fetchDistrict(filter.value); // ← BU REFRESH QILADI!

//     console.log("Map: Viloyat muvaffaqiyatli tanlandi, refresh bo'lmadi");
//   } catch (error) {
//     console.error("Map: Viloyat tanlashda xatolik:", error);
//   }
// };

const handleRegionClick = async (regionId) => {
  // ✅ Xarita ID sini viloyatList ID ga o'tkazib saqlaymiz
  const mapIdToViloyatId = {
    1735: 14, 1714: 6, 1703: 5, 1708: 12, 1706: 7,
    1710: 8,  1712: 10, 1718: 3, 1722: 9, 1724: 13,
    1727: 2,  1730: 4,  1733: 11, 1726: 1,
  };
  const normalizedId = mapIdToViloyatId[regionId] ?? regionId;
  selectedViloyat.value = String(normalizedId);
};

// Tuman tanlash handler
// const handleDistrictClick = (districtId) => {
//   console.log("=== MAP: TUMAN BOSILDI ===");
//   console.log("Tanlangan tuman ID:", districtId);

//   if (districtId) {
//     // ✅ WORKER bo'lsa hech narsa qilmaslik
//     if (indexStore.user?.role === "WORKER") return;
//     // Tuman tanlash
//     distStore.selectTumanById(districtId);
//     filter.value.district = districtId.toString();
//   } else {
//     // Tuman tozalash
//     selectedTuman.value = null
//     filter.value.district = "region";
//   }
// };

const handleDistrictClick = (districtId) => {
  if (districtId) {
    selectedTuman.value = String(districtId);
    // filter.value.district = String(districtId);
  } else {
    selectedTuman.value = null;
    filter.value.district = 'region';
  }
};

// Store o'zgarishlarini kuzatish
// watch(
//   () => [selectedViloyatObj.value, selectedTuman.value, filter.value.year],
//   () => {
//     console.log("=== MAP: STORE O'ZGARISHI KUZATILDI ===");
//     // fetchSalary();
//     if (
//       !selectedTuman.value &&
//       ["WORKER", "ADMIN"].includes(indexStore.user?.role)
//     ) {
//       filter.value.district = indexStore.user?.district_id?.toString();
//     }
//   },
//   { immediate: true }
// );

// Component yuklanganda viloyatlarni yuklash
// onMounted(async () => {
//   console.log("=== MAP COMPONENT YUKLANDI ===");

//   if (distStore.viloyatList.length === 0) {
//     console.log("Map: Viloyatlar yuklanmoqda...");
//     await distStore.fetchViloyatlar();
//   }
//   // ❗ WORKER yoki ADMIN bo‘lsa district ni user'dan olish
//   if (!selectedTuman.value && ['WORKER', 'ADMIN'].includes(indexStore.user?.role)) {
//     filter.value.district = indexStore.user?.district_id?.toString();
//   }
// });
</script>

<template>
  <div class="relative py-0 w-full overflow-hidden map">
    <!-- Back to republic/region button -->
    <div
      v-if="
        !isRepublicView"
      class="absolute top-0 z-10 flex items-center gap-3 cursor-pointer"
      @click="handleBack"
    >
      <svg
        width="34"
        height="35"
        viewBox="0 0 34 35"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect y="0.673584" width="34" height="34" rx="17" fill="#F3F3F3" />
        <path
          d="M20.7051 13.0836L16.1251 17.6736L20.7051 22.2636L19.2951 23.6736L13.2951 17.6736L19.2951 11.6736L20.7051 13.0836Z"
          fill="black"
          style="fill: black !important"
        />
      </svg>
    </div>

    <!-- Salary & Export size -->
    <div class="absolute top-0 left-0 flex flex-col gap-3">
      <!-- Salary -->
      <div
        v-if="salary && salary.name"
        class="py-3 px-4 max-w-[235px] flex flex-col gap-1 bg-white shadow-sm border rounded-lg"
      >
        <div class="text-xl text-cBlue-800 font-medium leading-tight">
          {{ salary.name[locale] }}
        </div>

        <div class="w-full flex items-center justify-start gap-2">
          <a-tooltip placement="top">
            <template #title>
              <span>
                {{ salary.previous_year_value }}
                {{ salary.measure_unit_name[locale] }}
              </span>
            </template>
            <svg
              class="size-5"
              :class="{
                'rotate-180': salary.value - salary.previous_year_value < 0,
              }"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.80261 15.2558V8.95404H0.702148L7.99961 0.65979L15.2976 8.95404H10.2016V15.2558H5.80261Z"
                fill="currentColor"
                :style="{
                  fill:
                    salary.value - salary.previous_year_value >= 0
                      ? '#22C55E !important'
                      : '#EF4444 !important',
                }"
              />
            </svg>
          </a-tooltip>

          <div class="text-2xl text-cBlue-500 font-semibold leading-tight">
            {{ locale == "en" ? "$" : "" }}
            {{ salary.value ? formatNumber(salary.value.toFixed(2)) : 0 }}
            <span v-if="salary.measure_unit_name === null"></span>
            <span v-else-if="salary.measure_unit_name">
              {{ salary.measure_unit_name[locale] }}
            </span>
          </div>
        </div>
      </div>

      <!-- Export size -->
      <!-- <div
        
        class="py-3 px-4 flex flex-col gap-1 bg-white shadow-sm border rounded-lg"
      >
        <div class="text-xl text-cBlue-800 font-medium leading-tight">
          {{ $t("export_size") }}
        </div>
        <div class="w-full flex items-center justify-start gap-2">
          <a-tooltip placement="top">
            <template #title>
              <span>
                {{ listStore.export_size.previous_year_value }}
                {{ listStore.export_size.measure_unit }}
              </span>
            </template>
            <svg
              class="size-5"
              :class="{
                'rotate-180':
                  listStore.export_size.value -
                    listStore.export_size.previous_year_value <
                  0,
              }"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.80261 15.2558V8.95404H0.702148L7.99961 0.65979L15.2976 8.95404H10.2016V15.2558H5.80261Z"
                fill="currentColor"
                :style="{
                  fill:
                    listStore.export_size.value -
                      listStore.export_size.previous_year_value >=
                    0
                      ? '#22C55E !important'
                      : '#EF4444 !important',
                }"
              />
            </svg>
          </a-tooltip>

          <div class="text-2xl text-cBlue-500 font-semibold leading-tight">
            {{ locale == "en" ? "$" : "" }}{{ listStore.export_size.value }}
            {{ listStore.export_size.measure_unit }}
          </div>
        </div>
      </div> -->
    </div>

    <!-- Map -->
    <Republic
      v-if="isRepublicView"
      class="xl:mt-[100px] 2xl:mt-0"
      :data="[]"
      @changeRegion="handleRegionClick"
    />
    <component
      v-else
      :is="getRegion"
      :class="getMapWidthClass"
      :data="[]"
      :active="selectedTuman?.id || filter.district"
      @changeDistrict="handleDistrictClick"
    />
  </div>
</template>

<style lang="scss">
.map svg {
  color: #eee;

  path {
    cursor: pointer;
    stroke: #fff !important;
    fill: rgb(158 195 255 / var(--tw-text-opacity, 1)) !important;
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  path:hover {
    fill: rgb(77 103 192 / var(--tw-text-opacity, 1)) !important;
  }

  .active {
    color: #0c0981 !important;
    stroke: #fff !important;
    stroke-width: 2px !important;
    opacity: 1 !important;
  }

  .active-path {
    fill: rgb(77 103 192 / var(--tw-text-opacity, 1)) !important;
    opacity: 1;
  }

  .inactive-path {
    opacity: 1 !important;
  }
}
</style>
