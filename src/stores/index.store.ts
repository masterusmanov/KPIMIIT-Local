//index.store.ts
import { defineStore } from "pinia";
import http from "@/libs/axios";

export const useStore = defineStore("index-store", () => {
  const { deleteCookie } = useCookie();
  const router = useRouter();

  const user = ref<User | null>(null);
  const ranks = ref([
    { id: 1, title: "Vazirlik" },
    { id: 2, title: "Viloyat" },
    { id: 3, title: "Tuman" },
  ]);

  /**
   * Gets the current user
   * @returns the current user or null if no user is logged in
   */
  // index.store.ts ga qo'shish
// index.store.ts da getUser funksiyasini o'zgartiring:

const getUser = async (): Promise<User | null> => {
  if (user.value) return user.value;

  try {
    const res = await http.get("/user/me");
    const userData = res.data.data;
    
    // ✅ WORKER yoki ADMIN bo'lganda district va region title larini set qilish
    if ((userData.role === "WORKER" || userData.role === "ADMIN") && 
        userData.region_id && userData.district_id && userData.region && userData.district) {
      
      try {
        // Region va district ma'lumotlarini parse qilish
        const regionData = JSON.parse(userData.region);
        const districtData = JSON.parse(userData.district);
        
        // ✅ User obyektiga title larni qo'shish
        userData.region_title = regionData.uz;
        userData.district_title = districtData.uz;
        
        // District store'ni import qilish va set qilish
        const { useDistStore } = await import("@/stores/district");
        const distStore = useDistStore();
        
        // Store'ga set qilish
        distStore.setDistSilent({
          id: userData.region_id,
          title: regionData.uz,
          short_title: regionData.uz,
          order: 0,
          created_at: ""
        });
        
        distStore.setTumanSilent({
          id: userData.district_id,
          title: districtData.uz,
          short_title: districtData.uz,
          order: 0,
          region_id: userData.region_id,
          created_at: ""
        });
        
        console.log("✅ User data processed:", {
          region_title: userData.region_title,
          district_title: userData.district_title
        });
        
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
      }
    }
    
    user.value = userData;
    return user.value;
  } catch (e) {
    console.log("❌ API error:", e);
    return null;
  }
};

  /**
   * Logs out the user and removes the token cookie
   */
  const logout = (): void => {
    router.push("/auth");
    user.value = null;
    deleteCookie("token");
  };

  /**
   * Checks if the user can access the given route or not
   * @param rules object with rules to check
   * @param roles array of roles to check
   * @returns boolean indicating if the user can access or not
   */
const canAccess = (
  rules: { [key: string]: any } | null,
  roles?: string[],
  superadmin: boolean = true
): boolean => {
  if (!user.value) return false;
  if (user.value.role === "SUPERADMIN" && superadmin) return true;

  const userDetail: any = user.value;

  // Check rules
  const rulesPassed = rules
    ? Object.entries(rules).every(([key, value]) => userDetail[key] == value)
    : true;

  // Check roles
  const rolesPassed = roles ? roles.includes(userDetail.role) : true;

  return rulesPassed && rolesPassed;
};

  return { user, ranks, getUser, logout, canAccess };
});
