<!-- Statistics.vue -->
<script setup>
import { ref, computed, watch, onMounted  } from "vue";
import { RightOutlined } from "@ant-design/icons-vue";
import { useI18n } from "vue-i18n";
import { useRegionState } from "@/composables/useRegionState";
// import { storeToRefs } from "pinia";
// import { useListStore } from "@/stores/list";
// import { useDistStore } from '@/stores/district';
// import { useStore } from "@/stores/index.store";
// import http from "@/libs/axios";

const { t, locale } = useI18n();  
// const listStore = useListStore();
// const { filter, loadingStats } = storeToRefs(listStore);
// const store = useDistStore()
// const indexStore = useStore();
// ✅ KPI ma'lumotlari uchun state
const kpiStatistics = ref([]);
const kpiLoading = ref(false);
const districtKpiStatistics = ref([]);
const districtKpiLoading = ref(false);



const {
  selectedViloyat,
  selectedTuman,
  selectedViloyatObj,
  selectedTumanObj,
  viloyatList: viloyatListRef,
  allDistricts,
  filter,
} = useRegionState();

// const {
//   selectedDist,
//   selectedTuman,
//   viloyatList,
//   tumanList,
//   viloyatOptions,
//   tumanOptions,
//   viloyatLoading,
//   tumanLoading
// } = storeToRefs(store)
// const filter = ref({ region: 'republic', district: '' });
const loadingStats = ref(false);
// const selectedDist = ref(null);
// const selectedTuman = ref(null);
// const viloyatList = ref([]);
const tumanList = ref([]);
const viloyatLoading = ref(false);
const tumanLoading = ref(false);


// ✅ API'dan viloyatlarni olish
// const fetchRegions = async () => {
//   try {
//     console.log('=== VILOYATLAR YUKLANMOQDA ===');
//     store.viloyatLoading = true;
//     const response = await http.get("/region/list");
//     console.log("viloyat olish API javob:", response);
//     console.log("viloyat ma'lumotlari:", response?.data?.data?.results);

//     // API dan kelgan ma'lumotlarni formatga o'tkazish
//     store.viloyatOptions = response?.data?.data?.results.map((region) => ({
//       value: String(region.id),
//       label: region.title,
//       original: {
//         id: region.id,
//         title: region.title,
//         short_title: region.short_title,
//         order: region.order,
//         created_at: region.created_at
//       }
//     })) || [];

//     const fullViloyatList = store.viloyatOptions.map(option => option.original);
//     console.log("viloyatOptions yaratildi:", store.viloyatOptions);
//     console.log("fullViloyatList yaratildi:", fullViloyatList);
//     store.setViloyatList(fullViloyatList);

//   } catch (error) {
//     console.error('Viloyatlarni olishda xatolik:', error);
//     store.viloyatOptions = [];
//     store.setViloyatList([]);
//   } finally {
//     store.viloyatLoading = false;
//     console.log('=== VILOYATLAR YUKLASH TUGADI ===');
//   }
// }

// const fetchRegions = async () => {
//   viloyatList.value = [
//     { id: 1, title: "Toshkent shahri", short_title: "Toshkent sh." },
//     { id: 2, title: "Toshkent viloyati", short_title: "Toshkent v." },
//     { id: 3, title: "Samarqand viloyati", short_title: "Samarqand v." },
//     { id: 4, title: "Farg'ona viloyati", short_title: "Farg'ona v." },
//     { id: 5, title: "Andijon viloyati", short_title: "Andijon v." },
//     { id: 6, title: "Namangan viloyati", short_title: "Namangan v." },
//     { id: 7, title: "Buxoro viloyati", short_title: "Buxoro v." },
//     { id: 8, title: "Qashqadaryo viloyati", short_title: "Qashqadaryo v." },
//     { id: 9, title: "Surxondaryo viloyati", short_title: "Surxondaryo v." },
//     { id: 10, title: "Navoiy viloyati", short_title: "Navoiy v." },
//     { id: 11, title: "Xorazm viloyati", short_title: "Xorazm v." },
//     { id: 12, title: "Jizzax viloyati", short_title: "Jizzax v." },
//     { id: 13, title: "Sirdaryo viloyati", short_title: "Sirdaryo v." },
//     { id: 14, title: "Qoraqalpog'iston R.", short_title: "QQR" },
//   ];
// };

// const fetchDistricts = async (regionId) => {
//   try {
//     console.log('=== TUMANLAR YUKLANMOQDA ===');
//     console.log('Region ID:', regionId);
//     store.tumanLoading = true;
//     const response = await http.get(`/district/list`, {
//       params: {
//         regions: regionId
//       }
//     });

//     console.log("tuman olish API javob:", response);
//     console.log("tuman ma'lumotlari:", response.data);

//     // API dan kelgan ma'lumotlarni formatga o'tkazish
//     store.tumanOptions = response?.data?.data?.results?.map((district) => ({
//       value: String(district.id),
//       label: district.title,
//       original: {
//         id: district.id,
//         title: district.title,
//         short_title: district.short_title,
//         order: district.order,
//         region_id: district.region_id,
//         created_at: district.created_at
//       }
//     })) || [];

//     console.log("tumanOptions yaratildi:", store.tumanOptions);
//     const fullTumanList = store.tumanOptions.map(option => option.original);
//     console.log("fullTumanList yaratildi:", fullTumanList);
//     store.setTumanList(fullTumanList);

//   } catch (error) {
//     console.error('Tumanlarni olishda xatolik:', error);
//     store.tumanOptions = [];
//     store.setTumanList([]);
//   } finally {
//     store.tumanLoading = false;
//     console.log('=== TUMANLAR YUKLASH TUGADI ===');
//   }
// }

// ✅ KPI statistikalarini olish uchun yangi API funksiya

const fetchDistricts = async (regionId) => {
  const allDistricts = {
    1: [ // Toshkent shahri
      { id: 101, title: "Bektemir tumani", short_title: "Bektemir t.", region_id: 1 },
      { id: 102, title: "Chilonzor tumani", short_title: "Chilonzor t.", region_id: 1 },
      { id: 103, title: "Hamza tumani", short_title: "Hamza t.", region_id: 1 },
      { id: 104, title: "Mirzo Ulug'bek tumani", short_title: "Mirzo Ulug'bek t.", region_id: 1 },
      { id: 105, title: "Mirobod tumani", short_title: "Mirobod t.", region_id: 1 },
      { id: 106, title: "Sergeli tumani", short_title: "Sergeli t.", region_id: 1 },
      { id: 107, title: "Shayxontohur tumani", short_title: "Shayxontohur t.", region_id: 1 },
      { id: 108, title: "Olmazar tumani", short_title: "Olmazar t.", region_id: 1 },
      { id: 109, title: "Uchtepa tumani", short_title: "Uchtepa t.", region_id: 1 },
      { id: 110, title: "Yakkasaroy tumani", short_title: "Yakkasaroy t.", region_id: 1 },
      { id: 111, title: "Yunusobod tumani", short_title: "Yunusobod t.", region_id: 1 },
      { id: 112, title: "Yashnobod tumani", short_title: "Yashnobod t.", region_id: 1 },
    ],
    2: [ // Toshkent viloyati
      { id: 201, title: "Angren tumani", short_title: "Angren t.", region_id: 2 },
      { id: 202, title: "Bekobod tumani", short_title: "Bekobod t.", region_id: 2 },
      { id: 203, title: "Bo'stonliq tumani", short_title: "Bo'stonliq t.", region_id: 2 },
      { id: 204, title: "Bо'ka tumani", short_title: "Bo'ka t.", region_id: 2 },
      { id: 205, title: "Chirchiq tumani", short_title: "Chirchiq t.", region_id: 2 },
      { id: 206, title: "Qibray tumani", short_title: "Qibray t.", region_id: 2 },
      { id: 207, title: "Ohangaron tumani", short_title: "Ohangaron t.", region_id: 2 },
      { id: 208, title: "Oqqo'rg'on tumani", short_title: "Oqqo'rg'on t.", region_id: 2 },
      { id: 209, title: "Parkent tumani", short_title: "Parkent t.", region_id: 2 },
      { id: 210, title: "Piskent tumani", short_title: "Piskent t.", region_id: 2 },
      { id: 211, title: "Yangiyo'l tumani", short_title: "Yangiyo'l t.", region_id: 2 },
      { id: 212, title: "Yuqorichirchiq tumani", short_title: "Yuqorichirchiq t.", region_id: 2 },
      { id: 213, title: "Zangiota tumani", short_title: "Zangiota t.", region_id: 2 },
    ],
    3: [ // Samarqand viloyati
      { id: 301, title: "Samarqand tumani", short_title: "Samarqand t.", region_id: 3 },
      { id: 302, title: "Urgut tumani", short_title: "Urgut t.", region_id: 3 },
      { id: 303, title: "Kattaqo'rg'on tumani", short_title: "Kattaqo'rg'on t.", region_id: 3 },
      { id: 304, title: "Bulung'ur tumani", short_title: "Bulung'ur t.", region_id: 3 },
      { id: 305, title: "Ishtixon tumani", short_title: "Ishtixon t.", region_id: 3 },
      { id: 306, title: "Jomboy tumani", short_title: "Jomboy t.", region_id: 3 },
      { id: 307, title: "Narpay tumani", short_title: "Narpay t.", region_id: 3 },
      { id: 308, title: "Nurobod tumani", short_title: "Nurobod t.", region_id: 3 },
      { id: 309, title: "Oqdaryo tumani", short_title: "Oqdaryo t.", region_id: 3 },
      { id: 310, title: "Payariq tumani", short_title: "Payariq t.", region_id: 3 },
      { id: 311, title: "Pastdarg'om tumani", short_title: "Pastdarg'om t.", region_id: 3 },
      { id: 312, title: "Qo'shrabot tumani", short_title: "Qo'shrabot t.", region_id: 3 },
      { id: 313, title: "Tayloq tumani", short_title: "Tayloq t.", region_id: 3 },
    ],
    4: [ // Farg'ona viloyati
      { id: 401, title: "Beshariq tumani", short_title: "Beshariq t.", region_id: 4 },
      { id: 402, title: "Bog'dod tumani", short_title: "Bog'dod t.", region_id: 4 },
      { id: 403, title: "Buvayda tumani", short_title: "Buvayda t.", region_id: 4 },
      { id: 404, title: "Dang'ara tumani", short_title: "Dang'ara t.", region_id: 4 },
      { id: 405, title: "Farg'ona tumani", short_title: "Farg'ona t.", region_id: 4 },
      { id: 406, title: "Furqat tumani", short_title: "Furqat t.", region_id: 4 },
      { id: 407, title: "Qo'qon tumani", short_title: "Qo'qon t.", region_id: 4 },
      { id: 408, title: "Marg'ilon tumani", short_title: "Marg'ilon t.", region_id: 4 },
      { id: 409, title: "Oltiariq tumani", short_title: "Oltiariq t.", region_id: 4 },
      { id: 410, title: "Quva tumani", short_title: "Quva t.", region_id: 4 },
      { id: 411, title: "Rishton tumani", short_title: "Rishton t.", region_id: 4 },
      { id: 412, title: "So'x tumani", short_title: "So'x t.", region_id: 4 },
      { id: 413, title: "Toshloq tumani", short_title: "Toshloq t.", region_id: 4 },
      { id: 414, title: "Uchko'prik tumani", short_title: "Uchko'prik t.", region_id: 4 },
      { id: 415, title: "O'zbekiston tumani", short_title: "O'zbekiston t.", region_id: 4 },
      { id: 416, title: "Yozyovon tumani", short_title: "Yozyovon t.", region_id: 4 },
    ],
    5: [ // Andijon viloyati
      { id: 501, title: "Andijon tumani", short_title: "Andijon t.", region_id: 5 },
      { id: 502, title: "Asaka tumani", short_title: "Asaka t.", region_id: 5 },
      { id: 503, title: "Baliqchi tumani", short_title: "Baliqchi t.", region_id: 5 },
      { id: 504, title: "Bo'z tumani", short_title: "Bo'z t.", region_id: 5 },
      { id: 505, title: "Buloqboshi tumani", short_title: "Buloqboshi t.", region_id: 5 },
      { id: 506, title: "Izboskan tumani", short_title: "Izboskan t.", region_id: 5 },
      { id: 507, title: "Jalaquduq tumani", short_title: "Jalaquduq t.", region_id: 5 },
      { id: 508, title: "Xo'jaobod tumani", short_title: "Xo'jaobod t.", region_id: 5 },
      { id: 509, title: "Marhamat tumani", short_title: "Marhamat t.", region_id: 5 },
      { id: 510, title: "Oltinko'l tumani", short_title: "Oltinko'l t.", region_id: 5 },
      { id: 511, title: "Paxtaobod tumani", short_title: "Paxtaobod t.", region_id: 5 },
      { id: 512, title: "Qo'rg'ontepa tumani", short_title: "Qo'rg'ontepa t.", region_id: 5 },
      { id: 513, title: "Shahrixon tumani", short_title: "Shahrixon t.", region_id: 5 },
      { id: 514, title: "Ulug'nor tumani", short_title: "Ulug'nor t.", region_id: 5 },
    ],
    6: [ // Namangan viloyati
      { id: 601, title: "Chortoq tumani", short_title: "Chortoq t.", region_id: 6 },
      { id: 602, title: "Chust tumani", short_title: "Chust t.", region_id: 6 },
      { id: 603, title: "Kosonsoy tumani", short_title: "Kosonsoy t.", region_id: 6 },
      { id: 604, title: "Mingbuloq tumani", short_title: "Mingbuloq t.", region_id: 6 },
      { id: 605, title: "Namangan tumani", short_title: "Namangan t.", region_id: 6 },
      { id: 606, title: "Norin tumani", short_title: "Norin t.", region_id: 6 },
      { id: 607, title: "Pop tumani", short_title: "Pop t.", region_id: 6 },
      { id: 608, title: "To'raqo'rg'on tumani", short_title: "To'raqo'rg'on t.", region_id: 6 },
      { id: 609, title: "Uychi tumani", short_title: "Uychi t.", region_id: 6 },
      { id: 610, title: "Yangiqo'rg'on tumani", short_title: "Yangiqo'rg'on t.", region_id: 6 },
    ],
    7: [ // Buxoro viloyati
      { id: 701, title: "Buxoro tumani", short_title: "Buxoro t.", region_id: 7 },
      { id: 702, title: "G'ijduvon tumani", short_title: "G'ijduvon t.", region_id: 7 },
      { id: 703, title: "Jondor tumani", short_title: "Jondor t.", region_id: 7 },
      { id: 704, title: "Kogon tumani", short_title: "Kogon t.", region_id: 7 },
      { id: 705, title: "Olot tumani", short_title: "Olot t.", region_id: 7 },
      { id: 706, title: "Peshku tumani", short_title: "Peshku t.", region_id: 7 },
      { id: 707, title: "Qorakol tumani", short_title: "Qorakol t.", region_id: 7 },
      { id: 708, title: "Qorovulbozor tumani", short_title: "Qorovulbozor t.", region_id: 7 },
      { id: 709, title: "Romitan tumani", short_title: "Romitan t.", region_id: 7 },
      { id: 710, title: "Shofirkon tumani", short_title: "Shofirkon t.", region_id: 7 },
      { id: 711, title: "Vobkent tumani", short_title: "Vobkent t.", region_id: 7 },
    ],
    8: [ // Qashqadaryo viloyati
      { id: 801, title: "Chiroqchi tumani", short_title: "Chiroqchi t.", region_id: 8 },
      { id: 802, title: "Dehqonobod tumani", short_title: "Dehqonobod t.", region_id: 8 },
      { id: 803, title: "G'uzor tumani", short_title: "G'uzor t.", region_id: 8 },
      { id: 804, title: "Kasbi tumani", short_title: "Kasbi t.", region_id: 8 },
      { id: 805, title: "Kitob tumani", short_title: "Kitob t.", region_id: 8 },
      { id: 806, title: "Koson tumani", short_title: "Koson t.", region_id: 8 },
      { id: 807, title: "Mirishkor tumani", short_title: "Mirishkor t.", region_id: 8 },
      { id: 808, title: "Muborak tumani", short_title: "Muborak t.", region_id: 8 },
      { id: 809, title: "Nishon tumani", short_title: "Nishon t.", region_id: 8 },
      { id: 810, title: "Qarshi tumani", short_title: "Qarshi t.", region_id: 8 },
      { id: 811, title: "Qamashi tumani", short_title: "Qamashi t.", region_id: 8 },
      { id: 812, title: "Shahrisabz tumani", short_title: "Shahrisabz t.", region_id: 8 },
      { id: 813, title: "Yakkabog' tumani", short_title: "Yakkabog' t.", region_id: 8 },
    ],
    9: [ // Surxondaryo viloyati
      { id: 901, title: "Angor tumani", short_title: "Angor t.", region_id: 9 },
      { id: 902, title: "Bandixon tumani", short_title: "Bandixon t.", region_id: 9 },
      { id: 903, title: "Boysun tumani", short_title: "Boysun t.", region_id: 9 },
      { id: 904, title: "Denov tumani", short_title: "Denov t.", region_id: 9 },
      { id: 905, title: "Jarqo'rg'on tumani", short_title: "Jarqo'rg'on t.", region_id: 9 },
      { id: 906, title: "Muzrabot tumani", short_title: "Muzrabot t.", region_id: 9 },
      { id: 907, title: "Oltinsoy tumani", short_title: "Oltinsoy t.", region_id: 9 },
      { id: 908, title: "Qiziriq tumani", short_title: "Qiziriq t.", region_id: 9 },
      { id: 909, title: "Qumqo'rg'on tumani", short_title: "Qumqo'rg'on t.", region_id: 9 },
      { id: 910, title: "Sariosiyo tumani", short_title: "Sariosiyo t.", region_id: 9 },
      { id: 911, title: "Sherobod tumani", short_title: "Sherobod t.", region_id: 9 },
      { id: 912, title: "Shurchi tumani", short_title: "Shurchi t.", region_id: 9 },
      { id: 913, title: "Termiz tumani", short_title: "Termiz t.", region_id: 9 },
      { id: 914, title: "Uzun tumani", short_title: "Uzun t.", region_id: 9 },
    ],
    10: [ // Navoiy viloyati
      { id: 1001, title: "Karmana tumani", short_title: "Karmana t.", region_id: 10 },
      { id: 1002, title: "Konimex tumani", short_title: "Konimex t.", region_id: 10 },
      { id: 1003, title: "Navbahor tumani", short_title: "Navbahor t.", region_id: 10 },
      { id: 1004, title: "Nurota tumani", short_title: "Nurota t.", region_id: 10 },
      { id: 1005, title: "Qiziltepa tumani", short_title: "Qiziltepa t.", region_id: 10 },
      { id: 1006, title: "Tomdi tumani", short_title: "Tomdi t.", region_id: 10 },
      { id: 1007, title: "Uchquduq tumani", short_title: "Uchquduq t.", region_id: 10 },
      { id: 1008, title: "Xatirchi tumani", short_title: "Xatirchi t.", region_id: 10 },
    ],
    11: [ // Xorazm viloyati
      { id: 1101, title: "Bog'ot tumani", short_title: "Bog'ot t.", region_id: 11 },
      { id: 1102, title: "Gurlan tumani", short_title: "Gurlan t.", region_id: 11 },
      { id: 1103, title: "Xiva tumani", short_title: "Xiva t.", region_id: 11 },
      { id: 1104, title: "Xonqa tumani", short_title: "Xonqa t.", region_id: 11 },
      { id: 1105, title: "Hazorasp tumani", short_title: "Hazorasp t.", region_id: 11 },
      { id: 1106, title: "Qo'shko'pir tumani", short_title: "Qo'shko'pir t.", region_id: 11 },
      { id: 1107, title: "Mang'it tumani", short_title: "Mang'it t.", region_id: 11 },
      { id: 1108, title: "Pitnak tumani", short_title: "Pitnak t.", region_id: 11 },
      { id: 1109, title: "Shavot tumani", short_title: "Shavot t.", region_id: 11 },
      { id: 1110, title: "Urganch tumani", short_title: "Urganch t.", region_id: 11 },
      { id: 1111, title: "Yangiariq tumani", short_title: "Yangiariq t.", region_id: 11 },
      { id: 1112, title: "Yangibozor tumani", short_title: "Yangibozor t.", region_id: 11 },
    ],
    12: [ // Jizzax viloyati
      { id: 1201, title: "Arnasoy tumani", short_title: "Arnasoy t.", region_id: 12 },
      { id: 1202, title: "Baxmal tumani", short_title: "Baxmal t.", region_id: 12 },
      { id: 1203, title: "Do'stlik tumani", short_title: "Do'stlik t.", region_id: 12 },
      { id: 1204, title: "Forish tumani", short_title: "Forish t.", region_id: 12 },
      { id: 1205, title: "G'allaorol tumani", short_title: "G'allaorol t.", region_id: 12 },
      { id: 1206, title: "Jizzax tumani", short_title: "Jizzax t.", region_id: 12 },
      { id: 1207, title: "Mirzacho'l tumani", short_title: "Mirzacho'l t.", region_id: 12 },
      { id: 1208, title: "Paxtakor tumani", short_title: "Paxtakor t.", region_id: 12 },
      { id: 1209, title: "Yangiobod tumani", short_title: "Yangiobod t.", region_id: 12 },
      { id: 1210, title: "Zarbdor tumani", short_title: "Zarbdor t.", region_id: 12 },
      { id: 1211, title: "Zafarobod tumani", short_title: "Zafarobod t.", region_id: 12 },
      { id: 1212, title: "Zomin tumani", short_title: "Zomin t.", region_id: 12 },
    ],
    13: [ // Sirdaryo viloyati
      { id: 1301, title: "Boyovut tumani", short_title: "Boyovut t.", region_id: 13 },
      { id: 1302, title: "Guliston tumani", short_title: "Guliston t.", region_id: 13 },
      { id: 1303, title: "Xovos tumani", short_title: "Xovos t.", region_id: 13 },
      { id: 1304, title: "Mirzaobod tumani", short_title: "Mirzaobod t.", region_id: 13 },
      { id: 1305, title: "Oqoltin tumani", short_title: "Oqoltin t.", region_id: 13 },
      { id: 1306, title: "Sardoba tumani", short_title: "Sardoba t.", region_id: 13 },
      { id: 1307, title: "Sayxunobod tumani", short_title: "Sayxunobod t.", region_id: 13 },
      { id: 1308, title: "Sirdaryo tumani", short_title: "Sirdaryo t.", region_id: 13 },
      { id: 1309, title: "Shirin tumani", short_title: "Shirin t.", region_id: 13 },
    ],
    14: [ // Qoraqalpog'iston
      { id: 1401, title: "Amudaryo tumani", short_title: "Amudaryo t.", region_id: 14 },
      { id: 1402, title: "Beruniy tumani", short_title: "Beruniy t.", region_id: 14 },
      { id: 1403, title: "Chimboy tumani", short_title: "Chimboy t.", region_id: 14 },
      { id: 1404, title: "Ellikqal'a tumani", short_title: "Ellikqal'a t.", region_id: 14 },
      { id: 1405, title: "Kegeyli tumani", short_title: "Kegeyli t.", region_id: 14 },
      { id: 1406, title: "Mo'ynoq tumani", short_title: "Mo'ynoq t.", region_id: 14 },
      { id: 1407, title: "Nukus tumani", short_title: "Nukus t.", region_id: 14 },
      { id: 1408, title: "Qanliko'l tumani", short_title: "Qanliko'l t.", region_id: 14 },
      { id: 1409, title: "Qo'ng'irot tumani", short_title: "Qo'ng'irot t.", region_id: 14 },
      { id: 1410, title: "Shumanay tumani", short_title: "Shumanay t.", region_id: 14 },
      { id: 1411, title: "Taxtako'pir tumani", short_title: "Taxtako'pir t.", region_id: 14 },
      { id: 1412, title: "To'rtko'l tumani", short_title: "To'rtko'l t.", region_id: 14 },
      { id: 1413, title: "Xo'jayli tumani", short_title: "Xo'jayli t.", region_id: 14 },
    ],
  };
  tumanList.value = allDistricts[regionId] || [];
};

// const fetchKPIStatistics = async () => {
//   try {
//     console.log('=== KPI STATISTIKALARI YUKLANMOQDA ===');
//     const response = await http.get('/statistics/kpi-ranks', {
//       params: {
//         year: new Date().getFullYear(),
//         month: new Date().getMonth() + 1,
//         rank_id: indexStore.user?.rank_id || 2
//       }
//     });

//     console.log("KPI API javob:", response);
//     console.log("KPI ma'lumotlari:", response?.data?.data);

//     return response?.data?.data || [];
//   } catch (error) {
//     console.error('KPI statistikalarni olishda xatolik:', error);
//     return [];
//   }
// };

// const fetchDistrictKPIStatistics = async (regionId) => {
//   try {
//     console.log('=== TUMAN KPI STATISTIKALARI YUKLANMOQDA ===');
//     console.log('Region ID:', regionId);

//     const response = await http.get(`statistics/kpi-ranks/region/${regionId}`, {
//       params: {
//         year: new Date().getFullYear(),
//         month: new Date().getMonth() + 1,
//         rank_id: indexStore.user?.rank_id || 2
//       }
//     });

//     console.log("Tuman KPI API javob:", response);
//     console.log("Tuman KPI ma'lumotlari:", response?.data?.data);

//     return response?.data?.data || [];
//   } catch (error) {
//     console.error('Tuman KPI statistikalarni olishda xatolik:', error);
//     return [];
//   }
// };


// Statik ma'lumotlar (fallback uchun)

const fetchKPIStatistics = async () => {
  return viloyatListRef.value.map((v, i) => ({
    title: v.title,
    place: i + 1,
    share_percent: (85 - i * 3).toFixed(2).replace('.', ','),
    difference_share_percent: ((Math.random() - 0.5) * 6).toFixed(2).replace('.', ','),
    previous_month_share_percent: (80 - i * 3).toFixed(2).replace('.', ','),
  }));
};

const fetchDistrictKPIStatistics = async (regionId) => {
  return tumanList.value
    .filter(t => t.region_id === regionId)
    .map((t, i) => ({
      title: t.title,
      place: i + 1,
      share_percent: (75 - i * 5).toFixed(2).replace('.', ','),
      difference_share_percent: ((Math.random() - 0.5) * 4).toFixed(2).replace('.', ','),
      previous_month_share_percent: (70 - i * 5).toFixed(2).replace('.', ','),
    }));
};

const staticFallbackData = [
  {
    id: 1,
    region_id: 1,
    rank: 1,
    value: 85.5,
    difference: 2.3,
    previous_year_value: 83.2,
    region_name: { uz: "Toshkent shahri", ru: "Город Ташкент" },
    district_name: { uz: "Chilonzor tumani", ru: "Чиланзарский район" }
  },
  {
    id: 2,
    region_id: 2,
    rank: 2,
    value: 78.9,
    difference: -1.5,
    previous_year_value: 80.4,
    region_name: { uz: "Samarqand viloyati", ru: "Самаркандская область" },
    district_name: { uz: "Samarqand tumani", ru: "Самаркандский район" }
  },
  {
    id: 3,
    region_id: 3,
    rank: 3,
    value: 72.1,
    difference: 3.8,
    previous_year_value: 68.3,
    region_name: { uz: "Andijon viloyati", ru: "Андижанская область" },
    district_name: { uz: "Andijon tumani", ru: "Андижанский район" }
  },
  {
    id: 4,
    region_id: 4,
    rank: 4,
    value: 69.7,
    difference: 1.2,
    previous_year_value: 68.5,
    region_name: { uz: "Farg'ona viloyati", ru: "Ферганская область" },
    district_name: { uz: "Farg'ona tumani", ru: "Ферганский район" }
  },
  {
    id: 5,
    region_id: 5,
    rank: 5,
    value: 65.3,
    difference: -2.1,
    previous_year_value: 67.4,
    region_name: { uz: "Namangan viloyati", ru: "Наманганская область" },
    district_name: { uz: "Namangan tumani", ru: "Наманганский район" }
  },
  {
    id: 6,
    region_id: 6,
    rank: 6,
    value: 62.8,
    difference: 4.5,
    previous_year_value: 58.3,
    region_name: { uz: "Qashqadaryo viloyati", ru: "Кашкадарьинская область" },
    district_name: { uz: "Qarshi tumani", ru: "Каршинский район" }
  },
  {
    id: 7,
    region_id: 7,
    rank: 7,
    value: 59.4,
    difference: 0.8,
    previous_year_value: 58.6,
    region_name: { uz: "Surxondaryo viloyati", ru: "Сурхандарьинская область" },
    district_name: { uz: "Termiz tumani", ru: "Термезский район" }
  },
  {
    id: 8,
    region_id: 8,
    rank: 8,
    value: 56.7,
    difference: -0.5,
    previous_year_value: 57.2,
    region_name: { uz: "Buxoro viloyati", ru: "Бухарская область" },
    district_name: { uz: "Buxoro tumani", ru: "Бухарский район" }
  },
  {
    id: 9,
    region_id: 9,
    rank: 9,
    value: 54.2,
    difference: 2.7,
    previous_year_value: 51.5,
    region_name: { uz: "Navoiy viloyati", ru: "Навоийская область" },
    district_name: { uz: "Navoiy tumani", ru: "Навоийский район" }
  },
  {
    id: 10,
    region_id: 10,
    rank: 10,
    value: 51.9,
    difference: -1.8,
    previous_year_value: 53.7,
    region_name: { uz: "Jizzax viloyati", ru: "Джизакская область" },
    district_name: { uz: "Jizzax tumani", ru: "Джизакский район" }
  },
  {
    id: 11,
    region_id: 11,
    rank: 11,
    value: 49.6,
    difference: 1.4,
    previous_year_value: 48.2,
    region_name: { uz: "Sirdaryo viloyati", ru: "Сырдарьинская область" },
    district_name: { uz: "Guliston tumani", ru: "Гулистанский район" }
  },
  {
    id: 12,
    region_id: 12,
    rank: 12,
    value: 47.3,
    difference: -0.9,
    previous_year_value: 48.2,
    region_name: { uz: "Xorazm viloyati", ru: "Хорезмская область" },
    district_name: { uz: "Urganch tumani", ru: "Ургенчский район" }
  },
  {
    id: 13,
    region_id: 13,
    rank: 13,
    value: 44.8,
    difference: 3.1,
    previous_year_value: 41.7,
    region_name: { uz: "Qoraqalpog'iston Respublikasi", ru: "Республика Каракалпакстан" },
    district_name: { uz: "Nukus tumani", ru: "Нукусский район" }
  },
  {
    id: 14,
    region_id: 14,
    rank: 14,
    value: 42.1,
    difference: 0.3,
    previous_year_value: 41.8,
    region_name: { uz: "Toshkent viloyati", ru: "Ташкентская область" },
    district_name: { uz: "Chirchiq tumani", ru: "Чирчикский район" }
  }
];

// State for show more functionality
const showingMore = ref(false);
const maxVisibleItems = 14;

// ✅ API'dan kelgan viloyat va tuman ma'lumotlarini statik ma'lumotlar bilan birlashtirish
// const enrichedStaticData = computed(() => {
//   return staticFallbackData.map(item => {
//     // viloyatList dan tegishli viloyatni topish
//     const viloyat = viloyatList.value.find(v => v.id === item.region_id);
    
//     // tumanList dan tegishli tumanni topish
//     const tuman = tumanList.value.find(t => t.id === item.id);
    
//     let enrichedItem = { ...item };
    
//     // Viloyat ma'lumotini boyitish
//     if (viloyat) {
//       enrichedItem.region_short_name = {
//         uz: viloyat.short_title || viloyat.title,
//         ru: viloyat.short_title || viloyat.title
//       };
//     } else {
//       enrichedItem.region_short_name = {
//         uz: getName(item.region_name.uz),
//         ru: getName(item.region_name.ru)
//       };
//     }
    
//     // Tuman ma'lumotini boyitish
//     if (tuman) {
//       enrichedItem.district_short_name = {
//         uz: tuman.short_title || tuman.title,
//         ru: tuman.short_title || tuman.title
//       };
//     } else {
//       // Agar API'dan tuman ma'lumoti topilmasa, district_name dan qisqartirish
//       enrichedItem.district_short_name = {
//         uz: getName(item.district_name.uz),
//         ru: getName(item.district_name.ru)
//       };
//     }
    
//     return enrichedItem;
//   });
// });

// ✅ ASOSIY MUAMMO - finalStatistics ni to'g'rilab chiqamiz
const finalStatistics = computed(() => {
  console.log('=== FINAL STATISTICS HISOBLANMOQDA ===');
  console.log('filter.value.region:', filter.value.region);
  console.log('kpiStatistics.value:', kpiStatistics.value);
  console.log('districtKpiStatistics.value:', districtKpiStatistics.value);

  // ✅ Respublika holatida viloyatlarni ko'rsatish
  if (filter.value.region === "republic" || !selectedViloyatObj.value) {
    console.log('Respublika holati - viloyatlar ko\'rsatilmoqda');
    
    return viloyatListRef.value.map((viloyat, index) => {
      // KPI ma'lumotlaridan mos viloyatni topish
      const kpiData = kpiStatistics.value.find(kpi => 
        kpi.title.toLowerCase() === viloyat.title.toLowerCase() ||
        kpi.title.toLowerCase() === viloyat.short_title?.toLowerCase()
      );
      
      return {
        id: viloyat.id,
        rank: kpiData ? kpiData.place : index + 1,
        value: kpiData ? parseFloat(kpiData.share_percent.replace(',', '.')) : Math.random() * 100,
        difference: kpiData ? parseFloat(kpiData.difference_share_percent.replace(',', '.')) : (Math.random() - 0.5) * 10,
        previous_year_value: kpiData ? parseFloat(kpiData.previous_month_share_percent.replace(',', '.')) : Math.random() * 100,
        region_name: {
          uz: viloyat.title,
          ru: viloyat.title
        },
        district_name: {
          uz: "",
          ru: ""
        },
        region_short_name: {
          uz: viloyat.short_title || viloyat.title,
          ru: viloyat.short_title || viloyat.title
        }
      };
    }).sort((a, b) => a.rank - b.rank);
  } 
  
  // ✅ Viloyat tanlangan holatda tumanlarni ko'rsatish (YANGI API BILAN)
  else {
    console.log('Viloyat tanlangan - tumanlar ko\'rsatilmoqda');
    console.log('selectedViloyatObj.value.id:', selectedViloyatObj.value.id);
    
    const regionId = selectedViloyatObj.value.id;
    const filteredTumans = tumanList.value.filter((tuman) => tuman.region_id === regionId);
    
    console.log('Filtrlangan tumanlar:', filteredTumans);
    console.log('districtKpiStatistics.value:', districtKpiStatistics.value);
    
    return filteredTumans.map((tuman) => {
      // ✅ YANGI: API'dan kelgan tuman KPI ma'lumotini topish
      const districtKpiData = districtKpiStatistics.value.find(kpi => {
        const kpiTitle = kpi.title.toLowerCase().trim();
        const tumanTitle = tuman.title.toLowerCase().trim();
        const tumanShortTitle = tuman.short_title?.toLowerCase().trim();
        
        // Turli xil moslik variantlari
        return (
          kpiTitle === tumanTitle ||
          kpiTitle === tumanShortTitle ||
          // "tumani" qo'shimchasini olib tashlash
          kpiTitle.replace(' tumani', '').replace(' t.', '') === tumanTitle.replace(' tumani', '').replace(' t.', '') ||
          // Bo'sh joylarni va maxsus belgilarni e'tiborsiz qoldirish
          kpiTitle.replace(/[^a-zA-Zа-яё0-9]/g, '') === tumanTitle.replace(/[^a-zA-Zа-яё0-9]/g, '') ||
          // Biror qismi mos kelishi
          kpiTitle.includes(tumanTitle.split(' ')[0]) || tumanTitle.includes(kpiTitle.split(' ')[0])
        );
      });
      
      console.log(`Tuman "${tuman.title}" uchun KPI ma'lumoti:`, districtKpiData);
      
      return {
        id: tuman.id,
        rank: districtKpiData ? districtKpiData.place : Math.floor(Math.random() * filteredTumans.length) + 1,
        value: districtKpiData ? parseFloat(districtKpiData.share_percent.replace(',', '.')) : Math.random() * 100,
        difference: districtKpiData ? parseFloat(districtKpiData.difference_share_percent.replace(',', '.')) : (Math.random() - 0.5) * 10,
        previous_year_value: districtKpiData ? parseFloat(districtKpiData.previous_month_share_percent.replace(',', '.')) : Math.random() * 100,
        region_name: {
          uz: selectedViloyatObj.value.title,
          ru: selectedViloyatObj.value.title
        },
        district_name: {
          uz: tuman.title,
          ru: tuman.title
        },
        district_short_name: {
          uz: tuman.short_title || tuman.title,
          ru: tuman.short_title || tuman.title
        }
      };
    }).sort((a, b) => a.rank - b.rank); // Rank bo'yicha tartiblash
  }
});

// Computed property to get visible statistics
const visibleStatistics = computed(() => {
  const stats = finalStatistics.value;
  if (stats.length <= maxVisibleItems) {
    return stats;
  }

  if (showingMore.value) {
    // Show remaining items (from 14th onwards)
    return stats.slice(maxVisibleItems);
  } else {
    // Show first 14 items
    return stats.slice(0, maxVisibleItems);
  }
});

// Computed property to check if show more button should be visible
const shouldShowMoreButton = computed(() => {
  return finalStatistics.value.length > maxVisibleItems;
});

// Function to toggle show more
const toggleShowMore = () => {
  showingMore.value = !showingMore.value;
};

// ✅ Element bosilganda
// const handleItemClick = async (item) => {
//   try {
//     console.log('=== ELEMENT BOSILDI ===');
//     console.log('Bosilgan element:', item);

//     // ✅ YANGI: Tanlangan element qaysi sahifada ekanligini aniqlash
//     const allStats = finalStatistics.value;
//     const selectedIndex = allStats.findIndex(stat => stat.id === item.id);

//     // Agar element 14-dan yuqorida bo'lsa, showingMore ni true qilib qo'yish
//     if (selectedIndex >= maxVisibleItems) {
//       showingMore.value = true;
//     } else {
//       showingMore.value = false;
//     }

//     if (filter.value.region === 'republic' || !selectedViloyatObj.value) {
//       // ✅ Viloyat tanlandi
//       console.log('Viloyat tanlanmoqda, ID:', item.id);

//       // Store orqali viloyat tanlash
//       await store.selectViloyatById(item.id);

//       // Filter ni yangilash
//       filter.value.region = item.id.toString();
//       filter.value.district = 'region';

//     } else {
//       // ✅ Tuman tanlandi
//       console.log('Tuman tanlanmoqda, ID:', item.id);

//       // Store orqali tuman tanlash
//       store.selectTumanById(item.id);

//       // Filter ni yangilash
//       filter.value.district = item.id.toString();
//     }
//   } catch (error) {
//     console.error('Element click xatoligi:', error);
//   }
// };

const handleItemClick = async (item) => {
  if (!selectedViloyatObj.value) {
    await fetchDistricts(item.id);
    districtKpiStatistics.value = await fetchDistrictKPIStatistics(item.id);
    selectedViloyat.value = String(item.id);
  } else {
    selectedTuman.value = String(item.id);
  }
};


// Function to interpolate between two colors
const interpolateColor = (color1, color2, factor) => {
  const hex1 = color1.replace("#", "");
  const hex2 = color2.replace("#", "");

  const r1 = parseInt(hex1.substr(0, 2), 16);
  const g1 = parseInt(hex1.substr(2, 2), 16);
  const b1 = parseInt(hex1.substr(4, 2), 16);

  const r2 = parseInt(hex2.substr(0, 2), 16);
  const g2 = parseInt(hex2.substr(2, 2), 16);
  const b2 = parseInt(hex2.substr(4, 2), 16);

  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));

  return `rgb(${r}, ${g}, ${b})`;
};

// Get gradient color based on position
const getGradientColor = (index, total) => {
  const startColor = "#00C564"; // Green
  const endColor = "#F94449"; // Red
  const factor = total > 1 ? index / (total - 1) : 0;
  return interpolateColor(startColor, endColor, factor);
};

// Simple function to abbreviate names
// const getName = (name) => {
//   if (!name) return "";

//   // Republic
//   if (name.includes("Respublikasi")) {
//     return name.replace("Respublikasi", "R.");
//   } else if (name.includes("Республика")) {
//     return name.replace("Республика", "Р.");
//   } else if (name.includes("Republic of")) {
//     return name.replace("Republic of", "R.");
//   }

//   // Replace viloyat/область/областы with v./обл.
//   else if (name.includes("viloyati")) {
//     return name.replace("viloyati", "v.");
//   } else if (name.includes("область")) {
//     return name.replace("область", "обл.");
//   } else if (name.includes("областы")) {
//     return name.replace("областы", "обл.");
//   }
//   // Replace tuman/район/районы with t./р-н
//   else if (name.includes("tumani")) {
//     return name.replace("tumani", "t.");
//   } else if (name.includes("район")) {
//     return name.replace("район", "р-н");
//   } else if (name.includes("районы")) {
//     return name.replace("районы", "р-ны");
//   }
//   // Replace shahri/город with sh./г.
//   else if (name.includes("shahri")) {
//     return name.replace("shahri", "sh.");
//   } else if (name.includes("город")) {
//     return name.replace("город", "г.");
//   }

//   return name;
// };

// ✅ ASOSIY WATCH - bu reactivity muammosini hal qiladi
// watch(
//   () => [selectedDist.value, selectedTuman.value, viloyatList.value, tumanList.value],
//   ([newDist, newTuman, newViloyatList, newTumanList], [oldDist, oldTuman]) => {
//     console.log('=== STORE O\'ZGARISHLARI KUZATILDI ===');
//     console.log('newDist:', newDist);
//     console.log('newTuman:', newTuman);
    
//     // ✅ FAQAT viloyat yoki respublika o'zgarishida showingMore ni reset qilish
//     // Tuman tanlaganda reset qilmaslik
//     if (newDist?.id !== oldDist?.id) {
//       console.log('Viloyat o\'zgardi, showingMore reset qilinyapti');
//       showingMore.value = false;
//     }
//   },
//   { 
//     immediate: false,
//     deep: true
//   }
// );

// Watch for region/district changes to reset showingMore state
// ✅ 3. Filter watch'ini ham o'zgartiring
// watch(
//   () => filter.value.region,
//   (newRegion, oldRegion) => {
//     console.log('=== FILTER REGION O\'ZGARDI ===');
    
//     // Faqat region o'zgarishida reset qilish
//     if (newRegion !== oldRegion) {
//       showingMore.value = false;
//     }
//   }
// );

// ✅ 4. Alohida watch district uchun - showingMore ni saqlab qolish
// watch(
//   () => filter.value.district,
//   (newDistrict, oldDistrict) => {
//     console.log('=== FILTER DISTRICT O\'ZGARDI ===');
//     // District o'zgarishida showingMore holatini o'zgartirmaslik
//   }
// );

// ✅ Soddalashtirilgan onMounted
// onMounted(async () => {
//   console.log('=== STATISTICS COMPONENT YUKLANDI ===');

//   try {
//     console.log('Hozirgi viloyatlar soni:', viloyatList.value.length);

//     if (indexStore.user?.role === "WORKER" || indexStore.user?.role === "ADMIN") {
//       console.log('WORKER user aniqlandi, avtomatik selection...');
//       filter.value.region = String(indexStore.user.region_id);
//       filter.value.district = String(indexStore.user.district_id);
//       return;
//     }

//     // Parallel ravishda viloyat va KPI ma'lumotlarini yuklash
//     const promises = [];

//     if (viloyatList.value.length === 0) {
//       console.log('Viloyatlar yuklanmoqda...');
//       promises.push(fetchRegions());
//     }

//     // KPI statistikalarni yuklash
//     console.log('KPI statistikalari yuklanmoqda...');
//     kpiLoading.value = true;
//     promises.push(fetchKPIStatistics().then(data => {
//       kpiStatistics.value = data;
//       kpiLoading.value = false;
//     }));

//     await Promise.all(promises);

//     console.log('=== BOSHLANG\'ICH YUKLASH TUGADI ===');
//   } catch (error) {
//     console.error('Yuklanishda xatolik:', error);
//     kpiLoading.value = false;
//   }
// });
watch(selectedViloyat, async (newVal, oldVal) => {
  if (newVal && newVal !== oldVal) {
    // ✅ Navbardan yoki xaritadan viloyat tanlanganda tumanlarni yuklash
    showingMore.value = false;
    districtKpiLoading.value = true;
    await fetchDistricts(Number(newVal));
    districtKpiStatistics.value = await fetchDistrictKPIStatistics(Number(newVal));
    districtKpiLoading.value = false;
  } else if (!newVal) {
    // Respublikaga qaytganda tozalash
    tumanList.value = [];
    districtKpiStatistics.value = [];
    showingMore.value = false;
  }
});

onMounted(async () => {
  // await fetchRegions();
  kpiLoading.value = true;
  kpiStatistics.value = await fetchKPIStatistics();
  kpiLoading.value = false;
});



// ✅ Viloyat tanlanganda tumanlarni yuklash
// watch(selectedDist, async (newViloyat, oldViloyat) => {
//   console.log('=== SELECTED DIST O\'ZGARDI ===');
//   console.log('Eski viloyat:', oldViloyat);
//   console.log('Yangi viloyat:', newViloyat);
  
//   if (newViloyat && newViloyat.id !== oldViloyat?.id) {
//     console.log('Yangi viloyat uchun tumanlar va KPI ma\'lumotlari yuklanmoqda...');
    
//     try {
//       // ✅ Parallel ravishda tumanlar va tuman KPI'larini yuklash
//       districtKpiLoading.value = true;
      
//       const [districtsResult, kpiResult] = await Promise.allSettled([
//         fetchDistricts(String(newViloyat.id)),
//         fetchDistrictKPIStatistics(newViloyat.id)
//       ]);
      
//       if (kpiResult.status === 'fulfilled') {
//         districtKpiStatistics.value = kpiResult.value;
//         console.log('Tuman KPI ma\'lumotlari muvaffaqiyatli yuklandi:', kpiResult.value);
//       } else {
//         console.error('Tuman KPI yuklashda xatolik:', kpiResult.reason);
//         districtKpiStatistics.value = [];
//       }
      
//       if (districtsResult.status === 'fulfilled') {
//         console.log('Tumanlar muvaffaqiyatli yuklandi');
//       } else {
//         console.error('Tumanlar yuklashda xatolik:', districtsResult.reason);
//       }
      
//     } catch (error) {
//       console.error('Viloyat o\'zgarishida xatolik:', error);
//       districtKpiStatistics.value = [];
//     } finally {
//       districtKpiLoading.value = false;
//     }
//   }
// }, { immediate: false });

// watch(selectedDist, async (newViloyat) => {
//   if (newViloyat) {
//     await fetchDistricts(newViloyat.id);
//     districtKpiStatistics.value = await fetchDistrictKPIStatistics(newViloyat.id);
//   }
// });
// ✅ Filter.region o'zgarishini kuzatish (fallback data uchun)
// watch(() => filter.value.region, async (newRegionId, oldRegionId) => {
//   console.log('=== FILTER REGION O\'ZGARDI ===');
//   console.log('Eski region ID:', oldRegionId);
//   console.log('Yangi region ID:', newRegionId);
  
//   if (newRegionId && newRegionId !== 'republic' && newRegionId !== oldRegionId) {
//     try {
//       // Agar tumanlar yuklanmagan bo'lsa yoki boshqa viloyat tanlangan bo'lsa
//       const currentTumanRegionId = tumanList.value.length > 0 ? tumanList.value[0]?.region_id : null;
//       if (currentTumanRegionId !== parseInt(newRegionId)) {
//         console.log('Filter orqali yangi viloyat uchun tumanlar va KPI ma\'lumotlari yuklanmoqda...');
        
//         // ✅ Bu yerda ham tuman KPI'larini yuklash
//         districtKpiLoading.value = true;
        
//         const [districtsResult, kpiResult] = await Promise.allSettled([
//           fetchDistricts(newRegionId),
//           fetchDistrictKPIStatistics(parseInt(newRegionId))
//         ]);
        
//         if (kpiResult.status === 'fulfilled') {
//           districtKpiStatistics.value = kpiResult.value;
//           console.log('Filter orqali tuman KPI ma\'lumotlari yuklandi:', kpiResult.value);
//         } else {
//           console.error('Filter orqali tuman KPI yuklashda xatolik:', kpiResult.reason);
//           districtKpiStatistics.value = [];
//         }
        
//         districtKpiLoading.value = false;
//       }
//     } catch (error) {
//       console.error('Filter region o\'zgarishida xatolik:', error);
//       districtKpiStatistics.value = [];
//       districtKpiLoading.value = false;
//     }
//   }
// });

// watch(selectedTuman, (newTuman) => {
//   if (newTuman) {
//     console.log('=== YANGI TUMAN TANLANDI ===');
//     console.log('Tuman ma\'lumoti:', newTuman);
//   }
// });
</script>

<template>
  <div class="relative flex-grow grid grid-cols-7 gap-2 3xl:gap-3 px-3">
    <!-- Skeleton Loading State -->
    <template v-if="loadingStats || viloyatLoading || tumanLoading || kpiLoading || districtKpiLoading">
      <div
        v-for="index in 7"
        :key="`skeleton-${index}`"
        class="relative w-full h-[60px] flex items-center gap-3"
      >
        <!-- Skeleton Number and Percentage -->
        <div
          class="relative min-w-12 w-12 h-full border border-gray-200 rounded-lg shadow-md overflow-hidden animate-pulse"
        >
          <div
            class="w-full h-1/2 flex items-center justify-center bg-gray-200"
          >
            <div class="w-6 h-6 bg-gray-300 rounded"></div>
          </div>
          <div class="bg-gray-300 h-1/2 flex items-center justify-center">
            <div class="w-8 h-3 bg-gray-400 rounded"></div>
          </div>
        </div>

        <!-- Skeleton Name and Difference -->
        <div class="relative flex flex-col gap-1.5 flex-grow">
          <div class="bg-gray-300 h-5 rounded animate-pulse"></div>
          <div class="flex items-center gap-2.5">
            <div class="bg-gray-200 h-4 w-16 rounded animate-pulse"></div>
            <div class="bg-gray-200 h-4 w-12 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
      
    </template>

    <!-- Actual Data -->
    <template v-else v-for="(item, index) in visibleStatistics" :key="`${item.id}-${selectedViloyatObj?.id || 'republic'}`">
      <div
        class="relative w-full h-[50px] 3xl:h-[60px] flex items-center gap-1.5 3xl:gap-3 cursor-pointer group" 
        :style="{
          color: getGradientColor(
            showingMore ? index + maxVisibleItems : index,
            finalStatistics.length
          ),
        }"
        @click="handleItemClick(item)"
      >
        <!-- Bg -->
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#f5f5f5] rounded-lg group-hover:opacity-100 transition-all duration-300"
          :class="{
            'opacity-100': filter.district == item.id,
          }"
        ></div>

        <!-- Number and Percentage -->
        <div
          class="relative lg:min-w-8 3xl:min-w-12 3xl:w-12 h-full text-xs border border-current rounded-lg shadow-md overflow-hidden"
          :class="[locale == 'ru' ? 'min-w-9 w-9' : 'min-w-10 w-10']"
        >
          <div class="w-full h-1/2 flex items-center justify-center">
            <span class="text-md xl:text-lg 3xl:text-xl font-bold">
              {{ item.rank }}
            </span>
          </div>

          <div class="bg-current h-1/2 flex items-center justify-center">
            <span
              class="text-white lg:text-[8px] xl:text-[10px] 3xl:text-xs"
              :class="[locale == 'ru' ? 'text-[9px]' : 'text-[10px]']"
            >
              {{ (item.value ?? 0).toFixed(2) }}%
            </span>
          </div>
        </div>

        <!-- Name and Difference -->
        <div class="relative py-2 h-full flex flex-col justify-between">
          <div
            class="lg:text-[7px] xl:text-[10px] 2xl:text-sm 3xl:text-base text-cBlue-800 font-bold"
            style="color: #0C0981 !important"
          > 
            {{
              filter.region == "republic" || !selectedViloyatObj
                ? item.region_short_name
                  ? item.region_short_name[locale]
                  : item.region_name[locale]
                : item.district_short_name
                ? item.district_short_name[locale]
                : item.district_name[locale]
            }}
          </div>

          <div
            class="flex items-center gap-0.5 xl:gap-1.5 3xl:gap-2.5 text-[9px] 2xl:text-sm 3xl:text-base font-medium leading-none whitespace-nowrap"
          >
            <span
              class="flex items-center gap-1 text-[7px] xl:text-[10px] 2xl:text-[14px]"
              :style="{
                color: (item.difference ?? 0) >= 0 ? '#10B981' : '#EF4444'
              }"
            >
              <svg
                class="size-2"
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                :style="{
                  transform:
                    (item.difference ?? 0) < 0 ? 'rotate(180deg)' : 'none',
                }"
              >
                <path
                  d="M0 5.0578L5 0.0578003L10 5.0578H0Z"
                  fill="currentColor"
                />
              </svg>

              {{ Math.abs(item.difference ?? 0).toFixed(2) }}%
            </span>
            <span class="text-cBlue-500 text-[7px] xl:text-[10px] 2xl:text-[14px]" style="color: #3B82F6 !important;">
              {{ (item.previous_year_value ?? 0).toFixed(2) }}%
            </span>
          </div>
        </div>
      </div>
    </template>

    <!-- Show more btn -->
    <div
      v-if="shouldShowMoreButton"
      class="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 z-40 size-8 bg-white flex-center group duration-200 hover:bg-cDarktext-cDarkBlue shadow-md rounded-md cursor-pointer hover:bg-cDarkBlue"
      @click.stop="toggleShowMore"
    >
      <RightOutlined
        class="text-cDarkBlue text-lg font-bold duration-200 group-hover:text-white transition-transform"
        :style="{
          transform: showingMore ? 'rotate(180deg)' : 'none',
        }"
      />
    </div>
  

 <div
        class=" absolute right-0 bg-gray-100 flex-center group duration-200 hover:bg-blue-300 min-w-8 -translate-x-2 top-16 !shrink-0 !size-8 z-50 shadow-backRoute rounded-md cursor-pointer"
        v-if="selectedViloyatObj" @click="selectedViloyat  = null; filter.region = 'republic'"
      >
        <LeftOutlined
          class="text-[#0C0981] text-lg font-bold duration-200 group-hover:text-white"
        />
      </div>
  </div>
</template>