// src/composables/useRegionState.ts
import { ref } from "vue";

const selectedViloyat = ref<string | null>(null);
const selectedTuman = ref<string | null>(null);
const filter = ref({ region: "republic", district: "region" });

// ✅ Xarita ID lari bilan viloyatList ID lari orasidagi moslik
const mapIdToViloyatId: Record<number, number> = {
  1735: 14, // Qoraqalpog'iston
  1714: 6,  // Namangan
  1703: 5,  // Andijon
  1708: 12, // Jizzax
  1706: 7,  // Buxoro
  1710: 8,  // Qashqadaryo
  1712: 10, // Navoiy
  1718: 3,  // Samarqand
  1722: 9,  // Surxondaryo
  1724: 13, // Sirdaryo
  1727: 2,  // Toshkent viloyati
  1730: 4,  // Farg'ona
  1733: 11, // Xorazm
  1726: 1,  // Toshkent shahri
};

const allDistricts: Record<number, any[]> = {
  1: [
    { value: "101", label: "Bektemir tumani" },
    { value: "102", label: "Chilonzor tumani" },
    { value: "103", label: "Mirzo Ulug'bek tumani" },
    { value: "104", label: "Shayxontohur tumani" },
    { value: "105", label: "Yunusobod tumani" },
    { value: "106", label: "Uchtepa tumani" },
    { value: "107", label: "Sergeli tumani" },
    { value: "108", label: "Olmazar tumani" },
    { value: "109", label: "Yakkasaroy tumani" },
    { value: "110", label: "Yashnobod tumani" },
    { value: "111", label: "Mirobod tumani" },
  ],
  2: [
    { value: "201", label: "Angren tumani" },
    { value: "202", label: "Bekobod tumani" },
    { value: "203", label: "Chirchiq tumani" },
    { value: "204", label: "Qibray tumani" },
    { value: "205", label: "Zangiota tumani" },
    { value: "206", label: "Parkent tumani" },
    { value: "207", label: "Piskent tumani" },
    { value: "208", label: "Yangiyo'l tumani" },
    { value: "209", label: "Ohangaron tumani" },
    { value: "210", label: "Bo'stonliq tumani" },
  ],
  3: [
    { value: "301", label: "Samarqand tumani" },
    { value: "302", label: "Urgut tumani" },
    { value: "303", label: "Kattaqo'rg'on tumani" },
    { value: "304", label: "Bulung'ur tumani" },
    { value: "305", label: "Ishtixon tumani" },
    { value: "306", label: "Jomboy tumani" },
    { value: "307", label: "Narpay tumani" },
    { value: "308", label: "Payariq tumani" },
    { value: "309", label: "Pastdarg'om tumani" },
    { value: "310", label: "Tayloq tumani" },
  ],
  4: [
    { value: "401", label: "Farg'ona tumani" },
    { value: "402", label: "Beshariq tumani" },
    { value: "403", label: "Buvayda tumani" },
    { value: "404", label: "Dang'ara tumani" },
    { value: "405", label: "Oltiariq tumani" },
    { value: "406", label: "Quva tumani" },
    { value: "407", label: "Rishton tumani" },
    { value: "408", label: "Toshloq tumani" },
    { value: "409", label: "Uchko'prik tumani" },
    { value: "410", label: "Yozyovon tumani" },
  ],
  5: [
    { value: "501", label: "Andijon tumani" },
    { value: "502", label: "Asaka tumani" },
    { value: "503", label: "Baliqchi tumani" },
    { value: "504", label: "Buloqboshi tumani" },
    { value: "505", label: "Izboskan tumani" },
    { value: "506", label: "Jalaquduq tumani" },
    { value: "507", label: "Marhamat tumani" },
    { value: "508", label: "Oltinko'l tumani" },
    { value: "509", label: "Shahrixon tumani" },
    { value: "510", label: "Ulug'nor tumani" },
  ],
  6: [
    { value: "601", label: "Namangan tumani" },
    { value: "602", label: "Chortoq tumani" },
    { value: "603", label: "Chust tumani" },
    { value: "604", label: "Kosonsoy tumani" },
    { value: "605", label: "Mingbuloq tumani" },
    { value: "606", label: "Norin tumani" },
    { value: "607", label: "Pop tumani" },
    { value: "608", label: "To'raqo'rg'on tumani" },
    { value: "609", label: "Uychi tumani" },
    { value: "610", label: "Yangiqo'rg'on tumani" },
  ],
  7: [
    { value: "701", label: "Buxoro tumani" },
    { value: "702", label: "G'ijduvon tumani" },
    { value: "703", label: "Jondor tumani" },
    { value: "704", label: "Kogon tumani" },
    { value: "705", label: "Olot tumani" },
    { value: "706", label: "Qorakol tumani" },
    { value: "707", label: "Romitan tumani" },
    { value: "708", label: "Shofirkon tumani" },
    { value: "709", label: "Vobkent tumani" },
  ],
  8: [
    { value: "801", label: "Qarshi tumani" },
    { value: "802", label: "Chiroqchi tumani" },
    { value: "803", label: "Dehqonobod tumani" },
    { value: "804", label: "G'uzor tumani" },
    { value: "805", label: "Kasbi tumani" },
    { value: "806", label: "Kitob tumani" },
    { value: "807", label: "Koson tumani" },
    { value: "808", label: "Muborak tumani" },
    { value: "809", label: "Nishon tumani" },
    { value: "810", label: "Shahrisabz tumani" },
  ],
  9: [
    { value: "901", label: "Termiz tumani" },
    { value: "902", label: "Angor tumani" },
    { value: "903", label: "Boysun tumani" },
    { value: "904", label: "Denov tumani" },
    { value: "905", label: "Jarqo'rg'on tumani" },
    { value: "906", label: "Muzrabot tumani" },
    { value: "907", label: "Oltinsoy tumani" },
    { value: "908", label: "Sherobod tumani" },
    { value: "909", label: "Shurchi tumani" },
    { value: "910", label: "Uzun tumani" },
  ],
  10: [
    { value: "1001", label: "Navoiy tumani" },
    { value: "1002", label: "Karmana tumani" },
    { value: "1003", label: "Konimex tumani" },
    { value: "1004", label: "Navbahor tumani" },
    { value: "1005", label: "Nurota tumani" },
    { value: "1006", label: "Qiziltepa tumani" },
    { value: "1007", label: "Tomdi tumani" },
    { value: "1008", label: "Uchquduq tumani" },
    { value: "1009", label: "Xatirchi tumani" },
  ],
  11: [
    { value: "1101", label: "Urganch tumani" },
    { value: "1102", label: "Bog'ot tumani" },
    { value: "1103", label: "Gurlan tumani" },
    { value: "1104", label: "Xiva tumani" },
    { value: "1105", label: "Xonqa tumani" },
    { value: "1106", label: "Hazorasp tumani" },
    { value: "1107", label: "Qo'shko'pir tumani" },
    { value: "1108", label: "Shavot tumani" },
    { value: "1109", label: "Yangiariq tumani" },
    { value: "1110", label: "Yangibozor tumani" },
  ],
  12: [
    { value: "1201", label: "Jizzax tumani" },
    { value: "1202", label: "Arnasoy tumani" },
    { value: "1203", label: "Baxmal tumani" },
    { value: "1204", label: "Forish tumani" },
    { value: "1205", label: "G'allaorol tumani" },
    { value: "1206", label: "Mirzacho'l tumani" },
    { value: "1207", label: "Paxtakor tumani" },
    { value: "1208", label: "Yangiobod tumani" },
    { value: "1209", label: "Zafarobod tumani" },
    { value: "1210", label: "Zomin tumani" },
  ],
  13: [
    { value: "1301", label: "Guliston tumani" },
    { value: "1302", label: "Boyovut tumani" },
    { value: "1303", label: "Xovos tumani" },
    { value: "1304", label: "Mirzaobod tumani" },
    { value: "1305", label: "Oqoltin tumani" },
    { value: "1306", label: "Sardoba tumani" },
    { value: "1307", label: "Sayxunobod tumani" },
    { value: "1308", label: "Sirdaryo tumani" },
    { value: "1309", label: "Shirin tumani" },
  ],
  14: [
    { value: "1401", label: "Nukus tumani" },
    { value: "1402", label: "Amudaryo tumani" },
    { value: "1403", label: "Beruniy tumani" },
    { value: "1404", label: "Chimboy tumani" },
    { value: "1405", label: "Ellikqal'a tumani" },
    { value: "1406", label: "Kegeyli tumani" },
    { value: "1407", label: "Mo'ynoq tumani" },
    { value: "1408", label: "Qanliko'l tumani" },
    { value: "1409", label: "Qo'ng'irot tumani" },
    { value: "1410", label: "Taxtako'pir tumani" },
    { value: "1411", label: "To'rtko'l tumani" },
    { value: "1412", label: "Xo'jayli tumani" },
  ],
};

const viloyatList = ref([
  { id: 1, title: "Toshkent shahri", short_title: "Toshkent sh." },
  { id: 2, title: "Toshkent viloyati", short_title: "Toshkent v." },
  { id: 3, title: "Samarqand viloyati", short_title: "Samarqand v." },
  { id: 4, title: "Farg'ona viloyati", short_title: "Farg'ona v." },
  { id: 5, title: "Andijon viloyati", short_title: "Andijon v." },
  { id: 6, title: "Namangan viloyati", short_title: "Namangan v." },
  { id: 7, title: "Buxoro viloyati", short_title: "Buxoro v." },
  { id: 8, title: "Qashqadaryo viloyati", short_title: "Qashqadaryo v." },
  { id: 9, title: "Surxondaryo viloyati", short_title: "Surxondaryo v." },
  { id: 10, title: "Navoiy viloyati", short_title: "Navoiy v." },
  { id: 11, title: "Xorazm viloyati", short_title: "Xorazm v." },
  { id: 12, title: "Jizzax viloyati", short_title: "Jizzax v." },
  { id: 13, title: "Sirdaryo viloyati", short_title: "Sirdaryo v." },
  { id: 14, title: "Qoraqalpog'iston R.", short_title: "QQR" },
]);

const viloyatOptions = computed(() =>
  viloyatList.value.map((v) => ({
    value: String(v.id),
    label: v.title,
  })),
);

// Computed: tanlangan viloyat obyekti
const selectedViloyatObj = computed(() =>
  selectedViloyat.value
    ? viloyatList.value.find((v) => v.id === Number(selectedViloyat.value)) ||
      null
    : null,
);

// Computed: tanlangan tumanning options ro'yxati
const tumanOptions = computed(() =>
  selectedViloyat.value
    ? allDistricts[Number(selectedViloyat.value)] || []
    : [],
);

// Computed: tanlangan tuman obyekti
const selectedTumanObj = computed(() =>
  selectedTuman.value && selectedViloyat.value
    ? tumanOptions.value.find((t) => t.value === selectedTuman.value) || null
    : null,
);

// Viloyat tanlaganda tumanni tozalash
watch(selectedViloyat, (newVal) => {
  selectedTuman.value = null;
  filter.value.district = "region";
  filter.value.region = newVal ?? "republic";
});

// ✅ selectedTuman o'zgarganda filter.district yangilansin
watch(selectedTuman, (newVal) => {
  filter.value.district = newVal ?? "region";
});


// ==================================================================
// Teskari mapping: viloyatList ID → xarita ID
const viloyatIdToMapId: Record<number, number> = Object.fromEntries(
  Object.entries(mapIdToViloyatId).map(([mapId, viloyatId]) => [viloyatId, Number(mapId)])
);

// ... (allDistricts, viloyatList o'zgarishsiz)

// ✅ selectedViloyat doim viloyatList ID sini saqlaydi (1-14)
// Xaritadan kelgan mapId ni normallashtirish
function normalizeViloyatId(id: string | null): string | null {
  if (!id) return null;
  const numId = Number(id);
  // Agar xarita ID si bo'lsa, viloyatList ID ga o'tkazamiz
  if (mapIdToViloyatId[numId] !== undefined) {
    return String(mapIdToViloyatId[numId]);
  }
  return id;
}

// viloyatList ID dan xarita ID sini olish
export function getMapId(viloyatListId: string | null): number | null {
  if (!viloyatListId) return null;
  return viloyatIdToMapId[Number(viloyatListId)] ?? null;
}
//===================================================================


export function useRegionState() {
  return {
    selectedViloyat,
    selectedTuman,
    selectedViloyatObj,
    selectedTumanObj,
    viloyatOptions,
    tumanOptions,
    viloyatList,
    allDistricts,
    filter,
  };
}
