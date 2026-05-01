// stores/district.ts
import { defineStore } from "pinia";
import http from "@/libs/axios";

export interface DistData {
  id: number;
  title: string;
  short_title: string;
  order: number;
  created_at: string;
}

export interface TumanData {
  id: number;
  title: string;
  short_title: string;
  order: number;
  region_id: number;
  created_at: string;
}

export interface RegionOption {
  value: string;
  label: string;
  original: DistData;
}

export interface TumanOption {
  value: string;
  label: string;
  original: TumanData;
}

export const useDistStore = defineStore("DistStore", {
  state: () => ({
    selectedDist: null as DistData | null,
    selectedTuman: null as TumanData | null,
    tumanList: [] as TumanData[],
    viloyatList: [] as DistData[],
    viloyatOptions: [] as RegionOption[],
    tumanOptions: [] as TumanOption[],
    viloyatLoading: false,
    tumanLoading: false,
    // ✅ Qo'shimcha state - navigation prevent uchun
    isUpdating: false,
  }),

  getters: {
    selectedViloyatId: (state) => state.selectedDist?.id || null,
    selectedTumanId: (state) => state.selectedTuman?.id || null,
    selectedViloyatValue: (state) =>
      state.selectedDist ? String(state.selectedDist.id) : null,
    selectedTumanValue: (state) =>
      state.selectedTuman ? String(state.selectedTuman.id) : null,
  },

  actions: {
    // ✅ YANGI: WORKER user uchun ma'lumotlarni set qilish
    setWorkerData(userData: User & { region: string; district: string }) {
      console.log("=== WORKER DATA SET QILINYAPTI ===");

      if (userData.region_id && userData.district_id) {
        const regionData = JSON.parse(userData.region);
        const districtData = JSON.parse(userData.district);

        // Viloyat set qilish
        this.setDistSilent({
          id: userData.region_id,
          title: regionData.uz,
          short_title: regionData.uz,
          order: 0,
          created_at: "",
        });

        // Tuman set qilish
        this.setTumanSilent({
          id: userData.district_id,
          title: districtData.uz,
          short_title: districtData.uz,
          order: 0,
          region_id: userData.region_id,
          created_at: "",
        });
      }
    },

    // ✅ OPTIMIZATSIYA: Silent update methodlari
    setDistSilent(data: DistData | null) {
      console.log("=== STORE: SET DIST SILENT ===", data?.title);
      this.isUpdating = true;
      this.selectedDist = data;
      // Viloyat o'zgarsa tumanni tozalash
      if (data) {
        this.clearTumanSilent();
      }
      this.isUpdating = false;
    },

    setTumanSilent(data: TumanData | null) {
      console.log("=== STORE: SET TUMAN SILENT ===", data?.title);
      this.isUpdating = true;
      this.selectedTuman = data;
      this.isUpdating = false;
    },

    clearTumanSilent() {
      console.log("=== STORE: CLEAR TUMAN SILENT ===");
      this.selectedTuman = null;
      // tumanList va tumanOptions ni tozalash kerak emas
      // chunki ular viloyat o'zgarganida yana yuklanadi
    },

    // ✅ ESKI methodlar - backward compatibility uchun
    setDist(data: DistData | null) {
      this.setDistSilent(data);
    },

    setTuman(data: TumanData | null) {
      this.setTumanSilent(data);
    },

    setTumanList(data: TumanData[]) {
      console.log("=== STORE: SET TUMAN LIST ===", data.length, "ta tuman");
      this.tumanList = data;
    },

    setViloyatList(data: DistData[]) {
      console.log("=== STORE: SET VILOYAT LIST ===", data.length, "ta viloyat");
      this.viloyatList = data;
    },

    clearTuman() {
      this.clearTumanSilent();
      this.tumanList = [];
      this.tumanOptions = [];
    },

    clearAll() {
      console.log("=== STORE: CLEAR ALL ===");
      this.selectedDist = null;
      this.selectedTuman = null;
      this.tumanList = [];
      this.viloyatList = [];
      this.viloyatOptions = [];
      this.tumanOptions = [];
    },

    // ✅ OPTIMIZATSIYA: API'dan viloyatlarni olish
    async fetchViloyatlar() {
      // Agar allaqachon yuklanganini tekshirish
      if (this.viloyatList.length > 0 && !this.viloyatLoading) {
        console.log("=== STORE: VILOYATLAR ALLAQACHON MAVJUD ===");
        return;
      }

      try {
        console.log("=== STORE: VILOYATLAR YUKLANMOQDA ===");
        this.viloyatLoading = true;
        const response = await http.get("/region/list");

        this.viloyatOptions =
          response?.data?.data?.results.map((region: any) => ({
            value: String(region.id),
            label: region.title,
            original: {
              id: region.id,
              title: region.title,
              short_title: region.short_title,
              order: region.order,
              created_at: region.created_at,
            },
          })) || [];

        const fullViloyatList = this.viloyatOptions.map(
          (option) => option.original
        );
        this.setViloyatList(fullViloyatList);

        console.log("=== STORE: VILOYATLAR MUVAFFAQIYATLI YUKLANDI ===");
      } catch (error) {
        console.error("STORE: Viloyatlarni olishda xatolik:", error);
        this.viloyatOptions = [];
        this.setViloyatList([]);
      } finally {
        this.viloyatLoading = false;
      }
    },

    // ✅ OPTIMIZATSIYA: API'dan tumanlarni olish
    async fetchTumanlar(regionId: string | number) {
      try {
        console.log("=== STORE: TUMANLAR YUKLANMOQDA ===", regionId);
        this.tumanLoading = true;

        const response = await http.get(`/district/list`, {
          params: {
            regions: String(regionId),
          },
        });

        this.tumanOptions =
          response?.data?.data?.results?.map((district: any) => ({
            value: String(district.id),
            label: district.title,
            original: {
              id: district.id,
              title: district.title,
              short_title: district.short_title,
              order: district.order,
              region_id: district.region_id,
              created_at: district.created_at,
            },
          })) || [];

        const fullTumanList = this.tumanOptions.map(
          (option) => option.original
        );
        this.setTumanList(fullTumanList);

        console.log(
          "=== STORE: TUMANLAR MUVAFFAQIYATLI YUKLANDI ===",
          fullTumanList.length
        );
      } catch (error) {
        console.error("STORE: Tumanlarni olishda xatolik:", error);
        this.tumanOptions = [];
        this.setTumanList([]);
      } finally {
        this.tumanLoading = false;
      }
    },

    // ✅ ASOSIY OPTIMIZATSIYA: Viloyat ID orqali tanlash
    async selectViloyatById(viloyatId: number | string) {
      try {
        console.log("=== STORE: VILOYAT TANLASH BOSHLANDI ===", viloyatId);

        // Agar bir xil viloyat tanlayotgan bo'lsa, hech narsa qilmaslik
        if (this.selectedDist && this.selectedDist.id === Number(viloyatId)) {
          console.log(
            "STORE: Bir xil viloyat tanlandi, hech narsa qilish kerak emas"
          );
          return;
        }

        const viloyat = this.viloyatList.find(
          (v) => v.id === Number(viloyatId)
        );
        if (viloyat) {
          // ✅ Silent update - refresh oldini olish uchun
          this.setDistSilent(viloyat);

          // ✅ Tumanlarni parallel yuklash
          await this.fetchTumanlar(viloyatId);

          console.log(
            "=== STORE: VILOYAT MUVAFFAQIYATLI TANLANDI ===",
            viloyat.title
          );
        } else {
          console.warn("STORE: Viloyat topilmadi:", viloyatId);
          // Agar viloyat topilmasa, uni API dan olishga harakat qilish
          if (this.viloyatList.length === 0) {
            await this.fetchViloyatlar();
            // Qaytadan harakat qilish
            const retryViloyat = this.viloyatList.find(
              (v) => v.id === Number(viloyatId)
            );
            if (retryViloyat) {
              this.setDistSilent(retryViloyat);
              await this.fetchTumanlar(viloyatId);
            }
          }
        }
      } catch (error) {
        console.error("STORE: Viloyat tanlashda xatolik:", error);
      }
    },

    // ✅ Tuman ID orqali tanlash
    selectTumanById(tumanId: number | string) {
      try {
        console.log("=== STORE: TUMAN TANLASH BOSHLANDI ===", tumanId);

        // Agar bir xil tuman tanlayotgan bo'lsa, hech narsa qilmaslik
        if (this.selectedTuman && this.selectedTuman.id === Number(tumanId)) {
          console.log(
            "STORE: Bir xil tuman tanlandi, hech narsa qilish kerak emas"
          );
          return;
        }

        const tuman = this.tumanList.find((t) => t.id === Number(tumanId));
        if (tuman) {
          this.setTumanSilent(tuman);
          console.log(
            "=== STORE: TUMAN MUVAFFAQIYATLI TANLANDI ===",
            tuman.title
          );
        } else {
          console.warn(
            "STORE: Tuman topilmadi:",
            tumanId,
            "Mavjud tumanlar:",
            this.tumanList.length
          );
        }
      } catch (error) {
        console.error("STORE: Tuman tanlashda xatolik:", error);
      }
    },
  },
});
