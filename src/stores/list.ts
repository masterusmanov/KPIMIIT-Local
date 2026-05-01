import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";
// import { notification } from "ant-design-vue";
import { useCookie } from "../composables/useCookie";

// Type definitions
interface Filter {
  view: string;
  year: number;
  region: string;
  district: string;
  mode: string;
}

interface Region {
  id: string;
  name: Record<string, string>;
  order: number;
  region_id: string;
  region_name: Record<string, string>;
  region_short_name?: Record<string, string>;
}

interface District {
  id: string;
  name: Record<string, string>;
  region_id: string;
  district_name: Record<string, string>;
  district_short_name?: Record<string, string>;
}

interface StatisticItem {
  id: string;
  rank: number;
  value: number;
  difference: number;
  previous_year_value: number;
  region_id: string;
  region_name: Record<string, string>;
  region_short_name?: Record<string, string>;
  district_name: Record<string, string>;
  district_short_name?: Record<string, string>;
  status?: string;
}

interface RegionStatistic extends StatisticItem {
  districts?: StatisticItem[];
}

interface YearOption {
  value: number;
  label: string;
}

interface Organization {
  id: string;
  name: Record<string, string>;
}

interface APIResponse<T> {
  data: {
    data: {
      results: T;
    };
  };
}

interface ErrorResponse {
  error?: string;
  message?: string;
}

export const useListStore = defineStore("list", () => {
  // Axios default konfiguratsiya
  axios.defaults.baseURL = import.meta.env.VITE_API_URL as string;
  axios.defaults.timeout = 60000;
  axios.defaults.headers.common["Accept-Language"] = "uz";

  const { getCookie } = useCookie();

  // Request interceptor - tokenni getCookie orqali olish
  axios.interceptors.request.use(
    (config: any) => {
      const token: string | null = getCookie("token");

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axios.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
      // notification.error({
      //   message: "Error",
      //   description:
      //     (error.response?.data?.error as string) || "An error occurred",
      // });
      console.error('API Error:', error.response?.data?.error || "An error occurred");
      
      // 2. Yoki return qiling va component da handle qiling
      return Promise.reject(error);
    }
  );

  // State
  const filter = ref<Filter>({
    view: "map",
    // view: "district",  // test
    year: 2022,
    region: "republic",
    // region: "1735", // test
    district: "region",
    mode: "rating",
    // mode: "analitics",
  });

  const regions = ref<Region[]>([]);
  const districts = ref<District[]>([]);
  const loadingStats = ref<boolean>(false);
  const regionStatistics = ref<RegionStatistic[] | null>(null);
  const organizationOptions = ref<Organization[]>([]);
  const currentYear: number = new Date().getFullYear();
  const yearOptions = ref<YearOption[]>(
    Array.from({ length: currentYear - 2020 }, (_, i) => ({
      value: 2021 + i,
      label: String(2021 + i),
    }))
  );
  const sallary = ref<number | undefined>();
  const export_size = ref<number | undefined>();

  // Getters
  const getStatistics = computed<StatisticItem[]>(() => {
    if (filter.value.region == "republic") {
      return (
        regionStatistics.value?.map((item, index, arr) => {
          let status = "normal";
          if (index < 3) status = "good";
          else if (index > arr.length - 4) status = "bad";
          return { ...item, status };
        }) || []
      );
    } else {
      const districtStatistics = regionStatistics.value?.find(
        (region) => region.region_id == filter.value.region
      );

      if (!districtStatistics) return [];
      return (
        districtStatistics.districts?.map((item, index, arr) => {
          let status = "normal";
          if (index < 3) status = "good";
          else if (index > arr.length - 4) status = "bad";
          return { ...item, status };
        }) || []
      );
    }
  });

  // Actions
  const fetchRegions = async (): Promise<void> => {
    try {
      const res: APIResponse<Region[]> = await axios.get("/region/list");
      regions.value = res.data.data.results.sort((a, b) => a.order - b.order);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDistrict = async (filter: Filter): Promise<void> => {
    if (filter.region === "republic") {
      districts.value = [];
      return;
    }

    try {
      const res: APIResponse<District[]> = await axios.get("district/list", {
        params: {
          region_id: filter.region,
        },
      });
      districts.value = res.data.data.results;
    } catch (err) {
      console.error(err);
      districts.value = [];
    }
  };

  const fetchStatisitcs = async (filter: Filter): Promise<void> => {
    loadingStats.value = true;
    try {
      const res: APIResponse<RegionStatistic[]> = await axios.get(
        "/ranks?order=true",
        {
          params: { year: filter.year },
        }
      );
      regionStatistics.value = res.data.data.results;
    } catch (err) {
      console.error(err);
    } finally {
      loadingStats.value = false;
    }
  };

  const fetchOrganization = async (query: string = ""): Promise<void> => {
    try {
      const res: APIResponse<Organization[]> = await axios.get(
        "/organization/list",
        {
          params: { search: query },
        }
      );
      organizationOptions.value = res.data.data.results;
    } catch (err) {
      console.error(err);
    }
  };

  return {
    // State
    filter,
    regions,
    districts,
    loadingStats,
    regionStatistics,
    yearOptions,
    organizationOptions,
    sallary,
    export_size,

    // Getters
    getStatistics,

    // Actions
    fetchRegions,
    fetchDistrict,
    fetchStatisitcs,
    fetchOrganization,
  };
});
