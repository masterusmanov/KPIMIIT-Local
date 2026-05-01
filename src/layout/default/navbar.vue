<!-- navbar -->
<script lang="ts" setup>
import { ref, reactive, watch, onMounted, computed, nextTick } from "vue";
import { useRegionState } from "../../composables/useRegionState";
// import http from "@/libs/axios";
// import { useDistStore } from "@/stores/district";
// import { useListStore } from "@/stores/list";
// import { useStore } from "@/stores/index.store";
// // ✅ Date store import qilish
// import { useDateStore } from "@/stores/date";

// ✅ TO'G'RI IMPORT - tm funksiyasini ham qo'shamiz
const { t, rt, tm } = useI18n();

type CategoryType = "vazirlik" | "viloyat";

interface RegionOption {
  value: string;
  label: string;
  original: DistData;
}

interface TumanOption {
  value: string;
  label: string;
  original: TumanData;
}

// Qolgan kod...
const router = useRouter();
const route = useRoute();
// const store = useDistStore();
// const listStore = useListStore();
// const indexStore = useStore();
// // ✅ Date store ishlatish
// const dateStore = useDateStore();
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
// const selectedViloyat = ref<string | null>(null);
// const selectedTuman = ref<string | null>(null);
// const tumanOptions = ref<{ value: string; label: string }[]>([]);
const viloyatLoading = ref(false);
const tumanLoading = ref(false);

const {
  selectedViloyat,
  selectedTuman,
  viloyatOptions,
  tumanOptions,
} = useRegionState();

const dateStore = reactive({
  selectedYear: currentYear,
  selectedMonth: new Date().getMonth() + 1,
  years,
  setYear(y: number) {
    dateStore.selectedYear = y;
  },
  setMonth(m: number) {
    dateStore.selectedMonth = m;
  },
  initFromQuery(_q: any) {},
});

// const allDistricts: Record<number, any[]> = {
//   1: [
//     { value: "101", label: "Bektemir tumani" },
//     { value: "102", label: "Chilonzor tumani" },
//     { value: "103", label: "Mirzo Ulug'bek tumani" },
//     { value: "104", label: "Shayxontohur tumani" },
//     { value: "105", label: "Yunusobod tumani" },
//     { value: "106", label: "Uchtepa tumani" },
//     { value: "107", label: "Sergeli tumani" },
//     { value: "108", label: "Olmazar tumani" },
//     { value: "109", label: "Yakkasaroy tumani" },
//     { value: "110", label: "Yashnobod tumani" },
//     { value: "111", label: "Mirobod tumani" },
//   ],
//   2: [
//     { value: "201", label: "Angren tumani" },
//     { value: "202", label: "Bekobod tumani" },
//     { value: "203", label: "Chirchiq tumani" },
//     { value: "204", label: "Qibray tumani" },
//     { value: "205", label: "Zangiota tumani" },
//     { value: "206", label: "Parkent tumani" },
//     { value: "207", label: "Piskent tumani" },
//     { value: "208", label: "Yangiyo'l tumani" },
//     { value: "209", label: "Ohangaron tumani" },
//     { value: "210", label: "Bo'stonliq tumani" },
//   ],
//   3: [
//     { value: "301", label: "Samarqand tumani" },
//     { value: "302", label: "Urgut tumani" },
//     { value: "303", label: "Kattaqo'rg'on tumani" },
//     { value: "304", label: "Bulung'ur tumani" },
//     { value: "305", label: "Ishtixon tumani" },
//     { value: "306", label: "Jomboy tumani" },
//     { value: "307", label: "Narpay tumani" },
//     { value: "308", label: "Payariq tumani" },
//     { value: "309", label: "Pastdarg'om tumani" },
//     { value: "310", label: "Tayloq tumani" },
//   ],
//   4: [
//     { value: "401", label: "Farg'ona tumani" },
//     { value: "402", label: "Beshariq tumani" },
//     { value: "403", label: "Buvayda tumani" },
//     { value: "404", label: "Dang'ara tumani" },
//     { value: "405", label: "Oltiariq tumani" },
//     { value: "406", label: "Quva tumani" },
//     { value: "407", label: "Rishton tumani" },
//     { value: "408", label: "Toshloq tumani" },
//     { value: "409", label: "Uchko'prik tumani" },
//     { value: "410", label: "Yozyovon tumani" },
//   ],
//   5: [
//     { value: "501", label: "Andijon tumani" },
//     { value: "502", label: "Asaka tumani" },
//     { value: "503", label: "Baliqchi tumani" },
//     { value: "504", label: "Buloqboshi tumani" },
//     { value: "505", label: "Izboskan tumani" },
//     { value: "506", label: "Jalaquduq tumani" },
//     { value: "507", label: "Marhamat tumani" },
//     { value: "508", label: "Oltinko'l tumani" },
//     { value: "509", label: "Shahrixon tumani" },
//     { value: "510", label: "Ulug'nor tumani" },
//   ],
//   6: [
//     { value: "601", label: "Namangan tumani" },
//     { value: "602", label: "Chortoq tumani" },
//     { value: "603", label: "Chust tumani" },
//     { value: "604", label: "Kosonsoy tumani" },
//     { value: "605", label: "Mingbuloq tumani" },
//     { value: "606", label: "Norin tumani" },
//     { value: "607", label: "Pop tumani" },
//     { value: "608", label: "To'raqo'rg'on tumani" },
//     { value: "609", label: "Uychi tumani" },
//     { value: "610", label: "Yangiqo'rg'on tumani" },
//   ],
//   7: [
//     { value: "701", label: "Buxoro tumani" },
//     { value: "702", label: "G'ijduvon tumani" },
//     { value: "703", label: "Jondor tumani" },
//     { value: "704", label: "Kogon tumani" },
//     { value: "705", label: "Olot tumani" },
//     { value: "706", label: "Qorakol tumani" },
//     { value: "707", label: "Romitan tumani" },
//     { value: "708", label: "Shofirkon tumani" },
//     { value: "709", label: "Vobkent tumani" },
//   ],
//   8: [
//     { value: "801", label: "Qarshi tumani" },
//     { value: "802", label: "Chiroqchi tumani" },
//     { value: "803", label: "Dehqonobod tumani" },
//     { value: "804", label: "G'uzor tumani" },
//     { value: "805", label: "Kasbi tumani" },
//     { value: "806", label: "Kitob tumani" },
//     { value: "807", label: "Koson tumani" },
//     { value: "808", label: "Muborak tumani" },
//     { value: "809", label: "Nishon tumani" },
//     { value: "810", label: "Shahrisabz tumani" },
//   ],
//   9: [
//     { value: "901", label: "Termiz tumani" },
//     { value: "902", label: "Angor tumani" },
//     { value: "903", label: "Boysun tumani" },
//     { value: "904", label: "Denov tumani" },
//     { value: "905", label: "Jarqo'rg'on tumani" },
//     { value: "906", label: "Muzrabot tumani" },
//     { value: "907", label: "Oltinsoy tumani" },
//     { value: "908", label: "Sherobod tumani" },
//     { value: "909", label: "Shurchi tumani" },
//     { value: "910", label: "Uzun tumani" },
//   ],
//   10: [
//     { value: "1001", label: "Navoiy tumani" },
//     { value: "1002", label: "Karmana tumani" },
//     { value: "1003", label: "Konimex tumani" },
//     { value: "1004", label: "Navbahor tumani" },
//     { value: "1005", label: "Nurota tumani" },
//     { value: "1006", label: "Qiziltepa tumani" },
//     { value: "1007", label: "Tomdi tumani" },
//     { value: "1008", label: "Uchquduq tumani" },
//     { value: "1009", label: "Xatirchi tumani" },
//   ],
//   11: [
//     { value: "1101", label: "Urganch tumani" },
//     { value: "1102", label: "Bog'ot tumani" },
//     { value: "1103", label: "Gurlan tumani" },
//     { value: "1104", label: "Xiva tumani" },
//     { value: "1105", label: "Xonqa tumani" },
//     { value: "1106", label: "Hazorasp tumani" },
//     { value: "1107", label: "Qo'shko'pir tumani" },
//     { value: "1108", label: "Shavot tumani" },
//     { value: "1109", label: "Yangiariq tumani" },
//     { value: "1110", label: "Yangibozor tumani" },
//   ],
//   12: [
//     { value: "1201", label: "Jizzax tumani" },
//     { value: "1202", label: "Arnasoy tumani" },
//     { value: "1203", label: "Baxmal tumani" },
//     { value: "1204", label: "Forish tumani" },
//     { value: "1205", label: "G'allaorol tumani" },
//     { value: "1206", label: "Mirzacho'l tumani" },
//     { value: "1207", label: "Paxtakor tumani" },
//     { value: "1208", label: "Yangiobod tumani" },
//     { value: "1209", label: "Zafarobod tumani" },
//     { value: "1210", label: "Zomin tumani" },
//   ],
//   13: [
//     { value: "1301", label: "Guliston tumani" },
//     { value: "1302", label: "Boyovut tumani" },
//     { value: "1303", label: "Xovos tumani" },
//     { value: "1304", label: "Mirzaobod tumani" },
//     { value: "1305", label: "Oqoltin tumani" },
//     { value: "1306", label: "Sardoba tumani" },
//     { value: "1307", label: "Sayxunobod tumani" },
//     { value: "1308", label: "Sirdaryo tumani" },
//     { value: "1309", label: "Shirin tumani" },
//   ],
//   14: [
//     { value: "1401", label: "Nukus tumani" },
//     { value: "1402", label: "Amudaryo tumani" },
//     { value: "1403", label: "Beruniy tumani" },
//     { value: "1404", label: "Chimboy tumani" },
//     { value: "1405", label: "Ellikqal'a tumani" },
//     { value: "1406", label: "Kegeyli tumani" },
//     { value: "1407", label: "Mo'ynoq tumani" },
//     { value: "1408", label: "Qanliko'l tumani" },
//     { value: "1409", label: "Qo'ng'irot tumani" },
//     { value: "1410", label: "Taxtako'pir tumani" },
//     { value: "1411", label: "To'rtko'l tumani" },
//     { value: "1412", label: "Xo'jayli tumani" },
//   ],
// };

// const viloyatOptions = [
//   { value: "1", label: "Toshkent shahri" },
//   { value: "2", label: "Toshkent viloyati" },
//   { value: "3", label: "Samarqand viloyati" },
//   { value: "4", label: "Farg'ona viloyati" },
//   { value: "5", label: "Andijon viloyati" },
//   { value: "6", label: "Namangan viloyati" },
//   { value: "7", label: "Buxoro viloyati" },
//   { value: "8", label: "Qashqadaryo viloyati" },
//   { value: "9", label: "Surxondaryo viloyati" },
//   { value: "10", label: "Navoiy viloyati" },
//   { value: "11", label: "Xorazm viloyati" },
//   { value: "12", label: "Jizzax viloyati" },
//   { value: "13", label: "Sirdaryo viloyati" },
//   { value: "14", label: "Qoraqalpog'iston R." },
// ];

// Route'ga qarab selectedCategory ni o'rnatish
const selectedCategory = computed({
  get() {
    return route.path === "/ministry" ? "vazirlik" : "viloyat";
  },
  set(value: CategoryType) {
    if (value === "vazirlik") {
      router.push("/ministry");
    } else {
      router.push("/");
    }
  },
});

// ✅ ASOSIY MUAMMO - router.replace ni olib tashlaymiz
// const selectedViloyat = computed({
//   get: () => store.selectedViloyatValue,
//   set: (val: string | null) => {
//     console.log('=== SELECTED VILOYAT SET ===', val);
//     if (val) {
//       store.selectViloyatById(val);
//     } else {
//       store.setDist(null);
//       store.clearTuman();
//     }
//   },
// });

// const selectedTuman = computed({
//   get: () => store.selectedTumanValue,
//   set: (val: string | null) => {
//     console.log('=== SELECTED TUMAN SET ===', val);
//     if (val) {
//       store.selectTumanById(val);
//     } else {
//       store.setTuman(null);
//     }
//   },
// });

const menus = reactive([
  {
    title: t("layout.main"),
    link: "/",
    icon: '<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#prefix__clip0_5019_18243)"><path d="M10 2.5l-6.667 5v10H7.5v-5.833h5V17.5h4.167v-10L10 2.5z" fill="currentColor"/></g><defs><clipPath id="prefix__clip0_5019_18243"><path fill="currentColor" d="M0 0h20v20H0z"/></clipPath></defs></svg>',
  },
  {
    title: "Ma'lumotlar",
    link: "/info",
    icon: '<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#prefix__clip0_5019_18248)"><path d="M10 1.667A8.336 8.336 0 001.667 10c0 4.6 3.733 8.333 8.333 8.333S18.333 14.6 18.333 10 14.6 1.667 10 1.667zm.833 12.5H9.167v-5h1.666v5zm0-6.667H9.167V5.833h1.666V7.5z" fill="currentColor"/></g><defs><clipPath id="prefix__clip0_5019_18248"><path fill="#fff" d="M0 0h20v20H0z"/></clipPath></defs></svg>',
  },
  {
    title: "Tahlil va ijro",
    link: "/execution",
    icon: '<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#prefix__clip0_5019_18253)" fill="currentColor"><path d="M6.667 7.5H3.333v9.167h3.334V7.5zM16.667 10.833h-3.334v5.834h3.334v-5.834zM11.667 3.333H8.333v13.334h3.334V3.333z"/></g><defs><clipPath id="prefix__clip0_5019_18253"><path fill="#fff" d="M0 0h20v20H0z"/></clipPath></defs></svg>',
  },
  {
    title: "Samaradorlik",
    link: "/efficiency",
    icon: '<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#prefix__clip0_5020_18284)" fill="currentColor"><path d="M15 9.167c1.242 0 2.392.391 3.333 1.05v-3.55A1.66 1.66 0 0016.667 5h-3.334V3.333a1.66 1.66 0 00-1.666-1.666H8.333a1.66 1.66 0 00-1.666 1.666V5H3.333c-.925 0-1.658.742-1.658 1.667l-.008 9.166A1.66 1.66 0 003.333 17.5h6.4A5.83 5.83 0 0115 9.167zM8.333 3.333h3.334V5H8.333V3.333z"/><path d="M15 10.833A4.168 4.168 0 0010.834 15c0 2.3 1.866 4.167 4.166 4.167 2.3 0 4.167-1.867 4.167-4.167S17.3 10.833 15 10.833zm1.375 6.125l-1.791-1.791V12.5h.833v2.325l1.542 1.542-.584.591z"/></g><defs><clipPath id="prefix__clip0_5020_18284"><path fill="#fff" d="M0 0h20v20H0z"/></clipPath></defs></svg>',
  },
  {
    title: "Dinamika",
    link: "/analytics",
    icon: '<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#prefix__clip0_5019_18271)"><path d="M15.893 4.107a8.336 8.336 0 00-11.785 0 8.336 8.336 0 000 11.786 8.337 8.337 0 0011.785 0 8.337 8.337 0 000-11.786zm-5.304 6.482l-2.357 2.357-1.178-1.178L9.41 9.41 7.643 7.643h4.714v4.714l-1.768-1.768z" fill="currentColor"/></g><defs><clipPath id="prefix__clip0_5019_18271"><path fill="#fff" d="M0 0h20v20H0z"/></clipPath></defs></svg>',
  },
]);

// Component yuklanganda viloyatlarni olish
// onMounted(async () => {
//   console.log("=== NAVBAR COMPONENT YUKLANDI ===");

//   // ✅ Date store ni query dan tiklash
//   dateStore.initFromQuery(route.query);

//   // Viloyatlarni yuklash
//   if (store.viloyatList.length === 0) {
//     await store.fetchViloyatlar();
//   }

//   // WORKER va ADMIN uchun faqat viloyat tanlash (tuman emas!)
//   if (
//     (indexStore.user?.role === "WORKER" || indexStore.user?.role === "ADMIN") &&
//     indexStore.user?.region_id
//   ) {
//     console.log("=== WORKER/ADMIN UCHUN FAQAT VILOYAT TANLASH ===");
//     console.log("Region ID:", indexStore.user.region_id);

//     // Faqat viloyat tanlash
//     await store.selectViloyatById(String(indexStore.user.region_id));

//     // Tuman tanlanmasin - tozalash
//     store.setTuman(null);
//   }

//   // URL query dan tiklash (eski kod) - faqat SUPERADMIN uchun
//   if (indexStore.user?.role === "SUPERADMIN") {
//     const regionId = Array.isArray(route.query.region)
//       ? route.query.region[0]
//       : route.query.region;

//     const districtId = Array.isArray(route.query.district)
//       ? route.query.district[0]
//       : route.query.district;

//     if (regionId && regionId !== "republic") {
//       console.log("Query dan viloyat tiklanmoqda:", regionId);
//       await store.selectViloyatById(regionId);
//     }

//     if (districtId && districtId !== "region") {
//       console.log("Query dan tuman tiklanmoqda:", districtId);
//       store.selectTumanById(districtId);
//     }
//   }
// });

onMounted(() => {
  dateStore.initFromQuery(route.query);
  // Qolgan store chaqiruvlarini O'CHIRING
});

// Watch for category changes
// watch(selectedCategory, (newValue: CategoryType) => {
//   console.log("=== CATEGORY O'ZGARDI ===", newValue);

//   if (newValue === "vazirlik") {
//     // Faqat store'ni tozalash, router.replace ni ishlatmaslik
//     store.setDist(null);
//     store.clearTuman();

//     listStore.filter.region = "republic";
//     listStore.filter.district = "region";
//   }
// });

// ✅ ROUTER.REPLACE ni olib tashlash
// Watch for viloyat changes - faqat store va filter yangilash
// watch(
//   selectedViloyat,
//   async (newValue: string | null, oldValue: string | null) => {
//     console.log("=== NAVBAR: VILOYAT O'ZGARDI ===");
//     console.log("Eski qiymat:", oldValue);
//     console.log("Yangi qiymat:", newValue);

//     // Faqat agar qiymat haqiqatdan o'zgargan bo'lsa
//     if (newValue !== oldValue) {
//       // Tuman selectionni tozalash
//       store.setTuman(null);

//       // ✅ MUHIM: faqat filter yangilash, router.replace ni ishlatmaslik
//       if (newValue) {
//         console.log("Yangi viloyat tanlandi, filter yangilanmoqda...");
//         listStore.filter.region = newValue;
//         listStore.filter.district = "region";

//         // Tumanlarni yuklash
//         try {
//           await store.fetchTumanlar(newValue);
//         } catch (error) {
//           console.error("Tumanlarni yuklashda xatolik:", error);
//         }
//       } else {
//         console.log("Viloyat tozalandi, respublikaga qaytish...");
//         listStore.filter.region = "republic";
//         listStore.filter.district = "region";
//       }
//     }
//   },
// );

// ✅ Tuman tanlanganda ham faqat filter yangilash
// watch(selectedTuman, (newValue: string | null, oldValue: string | null) => {
//   console.log("=== NAVBAR: TUMAN O'ZGARDI ===");
//   console.log("Eski qiymat:", oldValue);
//   console.log("Yangi tuman:", newValue);

//   // Faqat agar qiymat haqiqatdan o'zgargan bo'lsa
//   if (newValue !== oldValue) {
//     if (newValue) {
//       listStore.filter.district = newValue;
//     } else {
//       listStore.filter.district = "region";
//     }
//   }
// });

// ✅ Date store o'zgarishlarini kuzatish va URL yangilash
watch(
  () => [dateStore.selectedYear, dateStore.selectedMonth],
  ([newYear, newMonth], [oldYear, oldMonth]) => {
    console.log("=== DATE STORE O'ZGARDI ===", {
      newYear,
      newMonth,
      oldYear,
      oldMonth,
    });

    // Faqat agar qiymatlar haqiqatdan o'zgargan bo'lsa URL yangilash
    if (newYear !== oldYear || newMonth !== oldMonth) {
      const newQuery = {
        ...route.query,
        year: newYear,
        month: newMonth,
      };

      router.replace({ query: newQuery });
    }
  },
);

// TO'G'RILANGAN: Active menu aniqlash funksiyasi
const isActiveMenu = (menuLink: string) => {
  const currentPath = route.path;

  // Aniq mos kelishi
  if (currentPath === menuLink) {
    return true;
  }

  // Sub-sahifalar uchun: faqat to'liq path bilan boshlansin va asosiy sahifa bo'lmasin
  if (menuLink !== "/" && currentPath.startsWith(menuLink + "/")) {
    return true;
  }

  return false;
};

// ✅ ASOSIY XATO - bu methodlar router.replace ishlatayotgan edi
// Methods - router.replace ni olib tashlaymiz
const handleViloyatChange = async (value: string) => {
  console.log("=== HANDLE VILOYAT CHANGE ===");
  console.log("Tanlangan viloyat:", value);

  // Faqat selectedViloyat ni yangilash, router.replace ni ishlatmaslik
  selectedViloyat.value = value;
};

const handleTumanChange = (value: string) => {
  console.log("=== HANDLE TUMAN CHANGE ===");
  console.log("Tanlangan tuman:", value);

  // Faqat selectedTuman ni yangilash
  selectedTuman.value = value;
};

// ✅ Date handling methods
const handleYearChange = (year: number) => {
  console.log("=== HANDLE YEAR CHANGE ===", year);
  dateStore.setYear(year);
};

const handleMonthChange = (month: number) => {
  console.log("=== HANDLE MONTH CHANGE ===", month);
  dateStore.setMonth(month);
};

const activeRank = ref("3");

const columns = ref([
  { title: "Xodim", dataIndex: "employee", key: "employee" },
  {
    title: "KPI",
    dataIndex: "kpi",
    field: "kpi",
    key: "kpi",
    sorter: true,
    align: "center",
    width: 120,
  },
]);

// Missing interfaces - qo'shamiz
interface WorkerKPI {
  id: string;
  full_name: string;
  region_title: string;
  position_title: string;
  kpi: string;
  index: number;
}

interface StageData {
  id: string;
  title: string;
  totals: number;
  quarters: QuarterData[];
}

interface QuarterData {
  number: number;
  totals: number;
  months: MonthData[];
}

interface MonthData {
  month: number;
  values: number;
}

interface UsersCount {
  total: number;
}

interface MapData {
  id: string;
  name: string;
  value: number;
}

const data = ref<WorkerKPI[]>([]);
const table = reactive({
  total: 10,
  sort: "desc",
});

const stages = ref<StageData[]>([]);
const users_count = ref<UsersCount | null>(null);
const map = ref<MapData[]>([]);

// ✅ TO'G'RILANGAN: tm funksiyasini ishlatish
const months = computed(() => {
  try {
    return (
      tm("date.months") || [
        "Yanvar",
        "Fevral",
        "Mart",
        "Aprel",
        "May",
        "Iyun",
        "Iyul",
        "Avgust",
        "Sentabr",
        "Oktabr",
        "Noyabr",
        "Dekabr",
      ]
    );
  } catch (error) {
    console.warn("tm funksiyasi ishlamadi, default qiymatlar ishlatilmoqda");
    return [
      "Yanvar",
      "Fevral",
      "Mart",
      "Aprel",
      "May",
      "Iyun",
      "Iyul",
      "Avgust",
      "Sentabr",
      "Oktabr",
      "Noyabr",
      "Dekabr",
    ];
  }
});

const currentMonth = new Date().getMonth() + 1; // 1-12 oralig'ida

const visibleMonths = computed(() => {
  return months.value.slice(0, currentMonth);
});

  // function selectDist(distdata: DistData) {
  //   console.log("viloyatlar++++++", distdata);
  //   store.setDist(distdata);
  // }

// const isWorkerWithFixedRegion = computed(() => {
//   const user = indexStore.user;
//   console.log('=== DEBUG isWorkerWithFixedRegion ===', {
//     user_role: user?.role,
//     region_id: user?.region_id,
//     district_id: user?.district_id,
//     is_worker_or_admin: user?.role === "WORKER" || user?.role === "ADMIN",
//     has_region_district: !!(user?.region_id && user?.district_id),
//     final_result: user &&
//                   (user.role === "WORKER" || user.role === "ADMIN") &&
//                   user.region_id &&
//                   user.district_id
//   });

//   return user &&
//          (user.role === "WORKER" || user.role === "ADMIN") &&
//          user.region_id &&
//          user.district_id;
// });

// watch(selectedViloyat, (newVal) => {
//   selectedTuman.value = null;
//   tumanOptions.value = newVal ? allDistricts[Number(newVal)] || [] : [];
// });

const isWorkerWithFixedRegion = computed(() => false);
watch(
  () => [activeRank.value, route.query],
  () => {
    // fetchData();
    // fetchWorkersKPI();
  },
  { immediate: true },
);

// const tumanPlaceholder = computed(() => {
//   const user = indexStore.user;

//   // WORKER va ADMIN uchun district_title ni ko'rsatish
//   if (
//     (user?.role === "WORKER" || user?.role === "ADMIN") &&
//     user?.district_title
//   ) {
//     return user.district_title;
//   }

//   // ✅ Agar getUser hali ishlamagan bo'lsa, real-time parse qilish
//   if ((user?.role === "WORKER" || user?.role === "ADMIN") && user?.district) {
//     try {
//       const districtData = JSON.parse(user.district);
//       return districtData.uz;
//     } catch (e) {
//       console.error("District parse error in computed:", e);
//     }
//   }

//   return "Tumanni tanlang";
// });

const tumanPlaceholder = computed(() => "Tumanni tanlang");                                             

const isHomePage = computed(() => {
  return route.path === "/";
});
</script>

<template>
  <div class="p-4 flex items-center justify-between">
    <div class="flex space-x-2">
      <a-radio-group
        v-model:value="selectedCategory"
        v-if="!isWorkerWithFixedRegion"
        class="flex"
      >
        <a-radio-button value="vazirlik">Vazirlik</a-radio-button>
        <a-radio-button value="viloyat">Viloyat</a-radio-button>
      </a-radio-group>

      <!-- Viloyat selection - faqat viloyat tanlaganda ko'rinadi -->
      <div v-if="selectedCategory === 'viloyat'" class="flex space-x-2">
        <!-- <a-select
          v-model:value="selectedViloyat"
          placeholder="O'zbekiston Respublikasi"
          style="width: 200px"
          :options="store.viloyatOptions"
          :loading="store.viloyatLoading"
          :disabled="isWorkerWithFixedRegion"
          allow-clear
          @change="handleViloyatChange"
        /> -->

        <a-select
          v-model:value="selectedViloyat"
          placeholder="O'zbekiston Respublikasi"
          style="width: 200px"
          :options="viloyatOptions"
          :loading="viloyatLoading"
          allow-clear
        />

        <!-- <a-select
          v-if="selectedViloyat"
          v-model:value="selectedTuman"
          :placeholder="tumanPlaceholder"
          style="width: 200px"
          :options="store.tumanOptions"
          :loading="store.tumanLoading"
          :disabled="isWorkerWithFixedRegion"
          allow-clear
          @change="handleTumanChange"
        /> -->

        <a-select
          v-if="selectedViloyat"
          v-model:value="selectedTuman"
          placeholder="Tumanni tanlang"
          style="width: 200px"
          :options="tumanOptions"
          :loading="tumanLoading"
          allow-clear
        />
      </div>
    </div>

    <nav class="flex items-center space-x-2">
      <!-- ✅ Date store dan qiymatlarni olish -->
      <a-select
        :value="dateStore.selectedYear"
        class="the-datepicker"
        @change="handleYearChange"
      >
        <a-select-option
          v-for="year in dateStore.years"
          :key="year"
          :value="year"
        >
          {{ year }}
        </a-select-option>
      </a-select>

      <a-select
        :value="dateStore.selectedMonth"
        style="min-width: 100px; width: auto"
        class="the-datepicker"
        :disabled="isHomePage"
        @change="handleMonthChange"
      >
        <a-select-option
          v-for="(month, index) in visibleMonths"
          :key="index"
          :value="index + 1"
        >
          {{ rt(month) }}
        </a-select-option>
      </a-select>

      <ul class="mb-0 flex items-center bg-[#F1F1F1]">
        <li
          v-for="menu in menus"
          :key="menu.link"
          class="text-sm duration-200 py-2 px-2"
          :class="{
            'active-link': isActiveMenu(menu.link),
          }"
        >
          <RouterLink
            class="font-normal flex w-max duration-200 items-center justify-center gap-2"
            :class="[
              isActiveMenu(menu.link)
                ? 'text-white'
                : 'text-[#2E4F93] hover:text-blue-500',
            ]"
            :style="{ color: isActiveMenu(menu.link) ? 'white' : '' }"
            :to="menu.link"
          >
            <i
              class="size-5 flex items-center justify-center"
              :class="[
                isActiveMenu(menu.link) ? 'text-white' : 'text-[#2E4F93]',
              ]"
              v-html="menu.icon"
            ></i>
            {{ menu.title }}
          </RouterLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style>
.active-link {
  background-color: #2e4f93 !important;
  color: white !important;
  border-radius: 8px;
}

.active-link * {
  color: white !important;
}

.active-link svg {
  color: white !important;
}

.active-link svg path {
  fill: white !important;
}

.ant-select .ant-select-selector {
  border-radius: 8px !important;
}

/* Yoki faqat the-datepicker klassi bor elementlar uchun */
.the-datepicker .ant-select-selector {
  border-radius: 8px !important;
}
</style>
