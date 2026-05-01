<script lang="ts" setup>
import http from "@/libs/axios";
import { message } from "ant-design-vue";
import { ImageUp, Trash } from "lucide-vue-next";
import locale from "ant-design-vue/es/date-picker/locale/ru_RU";

const open = defineModel("open");
const props = defineProps<{
  type?: "create" | "update";
  user: User;
}>();
const emits = defineEmits(["success"]);

const { debounce, filterOption, formatDate } = useMe();
const router = useRouter();
const store = useStore();

const formState = reactive<User>({
  pinfl: "",
  first_name: "",
  last_name: "",
  surname: "",
  login: "",
  region_id: null,
  district_id: null,
  department_id: null,
  office_id: null,
  office_unit_id: null,
  position_id: null,
  rank_id: null,
  role: null,
  image_id: null,
  hired_at: null,
  position_changed_at: null,
} as User);
const formRef = ref();
const avatar = ref();
const regions = ref<Region[]>([]);
const districts = ref<District[]>([]);
const departments = ref<Department[]>([]);
const offices = ref<Office[]>([]);
const office_units = ref<OfficeUnit[]>([]);
const positions = ref<Position[]>([]);
const roles = ref<string[]>(["ADMIN", "WORKER", "HR_MANAGER"]);

const rules = {
  pinfl: [
    { required: true, message: "PINFL majburiy!", trigger: "blur" },
    {
      pattern: /^[0-9]{14}$/,
      message: "PINFL faqat 14 ta raqamdan iborat bo‘lishi kerak!",
      trigger: "blur",
    },
  ],
  first_name: [{ required: true, message: "FISh majburiy!", trigger: "blur" }],
  login: [{ required: true, message: "Login majburiy!", trigger: "blur" }],
  region_id: [
    { required: true, message: "Viloyatni tanlang!", trigger: "change" },
  ],
  district_id: [
    { required: true, message: "Tumanni tanlang!", trigger: "change" },
  ],
  // department: [
  //   { required: true, message: "Departamentni tanlang!", trigger: "change" },
  // ],
  // office: [
  //   { required: true, message: "Boshqarmani tanlang!", trigger: "change" },
  // ],
  // office_unit_id: [
  //   { required: true, message: "Bo'limni tanlang!", trigger: "change" },
  // ],
  // position_id: [
  //   { required: true, message: "Lavozimni tanlang!", trigger: "change" },
  // ],
  rank_id: [
    { required: true, message: "Darajani tanlang!", trigger: "change" },
  ],
  role: [{ required: true, message: "Rolni tanlang!", trigger: "change" }],
  image_url: [{ required: false }],
  hired_at: [
    {
      required: true,
      message: "Tizimga kirgan sanani belgilang",
      trigger: "blur",
    },
  ],
  position_changed_at: [
    {
      required: true,
      message: "Lavozimga tayinlangan sanani belgilang",
      trigger: "blur",
    },
  ],
};

const fetchUserData = async () => {
  if (formState.pinfl && formState.pinfl.length !== 14) return;
  try {
    let currentYear = new Date().getFullYear();
    let day = formState.pinfl.slice(1, 3);
    let month = formState.pinfl.slice(3, 5);
    let year = formState.pinfl.slice(5, 7);

    if (parseInt(year) >= +String(currentYear).slice(-2)) year = "19" + year;
    else year = "20" + year;

    let birth_date = `${year}-${month}-${day}`;

    const res = await http.get<any>(
      `/user/egov/get-fullname?pinfl=${formState.pinfl}&birthday=${birth_date}`
    );
    formState.first_name = res.data.data.first_name;
    formState.last_name = res.data.data.last_name;
    formState.surname = res.data.data.surname;
  } catch (e) {
    console.log(e);
  }
};
const debouncedFetchUserData = debounce(fetchUserData, 300);

const fetchRegions = async (): Promise<void> => {
  try {
    const res = await http.get<Res<Region>>(`/region/list`);
    regions.value =
      res.data.data.results?.sort((a: any, b: any) => a.order - b.order) || [];
  } catch (e) {
    console.log(e);
  }
};

const fetchDistricts = async (): Promise<void> => {
  if (!formState.region_id) return;
  try {
    const res = await http.get<Res<District>>(
      `/district/list?regions=${formState.region_id}`
    );
    districts.value =
      res.data.data.results?.sort((a: any, b: any) => a.order - b.order) || [];

       if (districts.value.length > 0 && !formState.district_id) {
      formState.district_id = districts.value[0].id;
    }
  } catch (e) {
    console.log(e);
  }
};

// const fetchDepartments = async (): Promise<void> => {
//   if (!formState.district) return;
//   try {
//     const res = await http.get<Res<Department>>(`/department/list`);
//     departments.value = res.data.data?.results || [];
//   } catch (e) {
//     console.log(e);
//   }
// };

// const fetchOffices = async (): Promise<void> => {
//   if (!formState.department) return;
//   try {
//     const res = await http.get<Res<Office>>(`/office/list`);
//     offices.value = res.data.data?.results || [];
//   } catch (e) {
//     console.log(e);
//   }
// };

const fetchOfficeUnits = async (): Promise<void> => {
  try {
    const res = await http.get<Res<OfficeUnit>>(`/office_unit/list`);
    office_units.value = res.data.data?.results || [];
  } catch (e) {
    console.log(e);
  }
};

const fetchPositions = async (): Promise<void> => {
  try {
    const res = await http.get<any>(`/position/list`);
    positions.value = (res.data.data?.results?.positions as Position[]) || [];
  } catch (e) {
    console.log(e);
  }
};

const deletePassword = async (): Promise<void> => {
  try {
    const res = await http.patch(`/user/update`, {
      id: props.user.id,
      password: "null",
    });

    message.success("Parol muvaffaqiyatli o'chirildi!");
  } catch (e) {
    console.log(e);
  }
};

const handleBeforeUpload = async (event: Event) => {
  try {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0] as File;

    avatar.value = file;

    const formData = new FormData();
    formData.append("file", file);

    const res = await http.post(`/files/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    formState.image_id = res.data.data.id;
  } catch (e) {
    console.error(e);
  }
};

const handleSubmit = async (): Promise<void> => {
  try {
    await formRef.value.validate();
    
    // For HR_MANAGER, ensure region_id is set to their own region_id
    if (store.user?.role === "HR_MANAGER" && store.user?.region_id) {
      formState.region_id = store.user.region_id;
    }

    let res: any = "";
    if (props.type == "create") {
      res = await http.post(`/user/create`, formState);
    } else {
      res = await http.patch(`/user/update`, {
        ...formState,
        id: props.user.id,
      });
    }

    if (res) {
      message.success(
        props.type == "create"
          ? "Xodim muvaffaqiyatli qo'shildi!"
          : "Xodim muvaffaqiyatli yangilandi!"
      );
      formRef.value.resetFields();
    }

    open.value = false;
    emits("success");
  } catch (error: any) {
    console.error(error);
    error.errorFields && message.error("Iltimos, formani to'g'ri to'ldiring!");
  }
};

onMounted(() => {
  fetchRegions();
  fetchOfficeUnits();
  fetchPositions();
  
  // Set region_id from current HR_MANAGER user
  if (store.user?.role === "HR_MANAGER" && store.user?.region_id) {
    formState.region_id = store.user.region_id;
    fetchDistricts();
  }
});

// watch(() => formState.first_name, fetchRegions);
watch(() => formState.region_id, fetchDistricts);
// watch(() => formState.district, fetchDepartments);
// watch(() => formState.department, fetchOffices);
// watch(() => formState.office, fetchOfficeUnits);
// watch(() => formState.office_unit, fetchPositions);

watch(
  () => props.user,
  () => {
    formState.pinfl = props.user.pinfl || "";
    formState.first_name = props.user.first_name || "";
    formState.last_name = props.user.last_name || "";
    formState.surname = props.user.surname || "";
    formState.login = props.user.login || "";
    
    // For HR_MANAGER, set region_id to their own region_id
    if (store.user?.role === "HR_MANAGER" && store.user?.region_id) {
      formState.region_id = store.user.region_id;
    } else {
      formState.region_id = props.user.region_id || null;
    }
    
    formState.district_id = props.user.district_id || null;
    formState.department_id = props.user.department_id || null;
    formState.office_id = props.user.office_id || null;
    formState.office_unit_id = props.user.office_unit_id || null;
    formState.position_id = props.user.position_id || null;
    formState.rank_id = props.user.rank_id || null;
    formState.role = props.user.role || null;
    formState.image_url = props.user.image_url || null;
    formState.hired_at = formatDate(props.user.hired_at) as any;
    formState.position_changed_at = formatDate(
      props.user.position_changed_at
    ) as any;

    if (formState.image_url) {
      avatar.value = {
        name: formState.image_url,
      };
    }
    
    // Make sure to fetch districts after setting region_id
    if (formState.region_id) {
      fetchDistricts();
    }
  }
);

watch(
  () => formState.rank_id,
  () => {
    if (formState.rank_id == 1) {
      roles.value = ["SUPERADMIN", "ADMIN", "WORKER", "HR_MANAGER"];
      rules.region_id[0].required = false;
      rules.district_id[0].required = false;
    } else if (formState.rank_id == 2) {
      roles.value = ["ADMIN", "WORKER", "HR_MANAGER"];
      rules.region_id[0].required = true;
      rules.district_id[0].required = false;
    } else {
      roles.value = ["ADMIN", "WORKER", "HR_MANAGER"];
      rules.region_id[0].required = true;
      rules.district_id[0].required = true;
    }
  }
);
</script>
<template>
  <a-modal v-model:open="open" :maskClosable="false" :width="980" centered>
    <template #title>
      <div class="text-lg">
        {{ type == "create" ? "Xodim qo'shish" : "Xodimni tahrirlash" }}
      </div>
    </template>

    <a-form
      class="mt-5 w-full"
      ref="formRef"
      :model="formState"
      :rules
      layout="vertical"
    >
      <div class="w-full grid grid-cols-3 gap-x-4">
        <a-form-item label="PINFL" name="pinfl">
          <a-input
            v-model:value="formState.pinfl"
            placeholder="PINFL"
            @input="debouncedFetchUserData"
          />
        </a-form-item>

        <a-form-item label="FISh" name="first_name">
          <a-input
            :value="`${formState.last_name} ${formState.first_name} ${formState.surname}`"
            placeholder="FISh"
            disabled
          />
        </a-form-item>

        <a-form-item label="Login" name="login">
          <a-input
            v-model:value="formState.login"
            placeholder="Login"
            :disabled="!formState.first_name"
          />
        </a-form-item>

        <a-form-item label="Daraja" name="rank_id">
          <a-select
            v-model:value="formState.rank_id"
            placeholder="Darajani tanlang"
            show-search
            :options="
              store.ranks.map((rank) => ({ value: rank.id, label: rank.title }))
            "
            :filter-option="filterOption"
            :disabled="!formState.first_name"
          />
        </a-form-item>        <a-form-item label="Viloyat" name="region_id">
          <a-select
            v-model:value="formState.region_id"
            placeholder="Viloyatni tanlang"
            show-search
            :options="
              regions.map((region) => ({
                value: region.id,
                label: region.title,
              }))
            "
            :filter-option="filterOption"
            :disabled="!formState.first_name || store.user?.role === 'HR_MANAGER'"
          />
        </a-form-item>

        <a-form-item label="Tuman" name="district_id">
          <a-select
            v-model:value="formState.district_id"
            placeholder="Tumanni tanlang"
            show-search
            :options="
              districts.map((district) => ({
                value: district.id,
                label: district.title,
              }))
            "
            :filter-option="filterOption"
            :disabled="!formState.first_name"
          />
        </a-form-item>

        <!-- <a-form-item label="Departament" name="department">
            <a-select
              v-model:value="formState.department"
              placeholder="Departamentni tanlang"
              show-search
              :options="
                departments.map((department) => ({
                  value: department.id,
                  label: department.title,
                }))
              "
              :filter-option="filterOption"
              :disabled="!formState.district"
            />
          </a-form-item>

          <a-form-item label="Boshqarma" name="office">
            <a-select
              v-model:value="formState.office"
              placeholder="Boshqarmani tanlang"
              show-search
              :options="
                offices.map((office) => ({
                  value: office.id,
                  label: office.title,
                }))
              "
              :filter-option="filterOption"
              :disabled="!formState.department"
            />
          </a-form-item> -->

        <a-form-item label="Bo'lim" name="office_unit_id">
          <a-select
            v-model:value="formState.office_unit_id"
            placeholder="Bo'limni tanlang"
            show-search
            :options="
              office_units.map((unit) => ({
                value: unit.id,
                label: unit.title,
              }))
            "
            :filter-option="filterOption"
            :disabled="!formState.first_name"
          />
        </a-form-item>

        <a-form-item label="Lavozim" name="position_id">
          <a-select
            v-model:value="formState.position_id"
            placeholder="Lavozimni tanlang"
            show-search
            :options="
              positions?.map((position) => ({
                value: position.id,
                label: position.title,
              }))
            "
            :filter-option="filterOption"
            :disabled="!formState.first_name"
          />
        </a-form-item>

        <a-form-item label="Rol" name="role">
          <a-select
            v-model:value="formState.role"
            placeholder="Rolni tanlang"
            :options="roles.map((item) => ({ value: item, label: item }))"
            :disabled="!formState.first_name"
          />
        </a-form-item>

        <a-form-item label="Avatar" name="image_url">
          <label for="avatar-inp">
            <input
              class="!hidden"
              id="avatar-inp"
              type="file"
              accept="image/*"
              @change="($event) => handleBeforeUpload($event)"
            />

            <div
              class="w-full flex items-center gap-2 border rounded-lg py-1 px-2 cursor-pointer"
            >
              <ImageUp class="size-4" />
              {{ avatar ? avatar.name.slice(0, 30) : "Rasmni yuklash" }}

              <Trash
                v-if="avatar"
                class="ml-auto size-4 text-red-500"
                @click="
                  () => {
                    avatar = null;
                    formState.image_url = null;
                  }
                "
              />
            </div>
          </label>
        </a-form-item>

        <a-form-item label="Tizimga kirgan sana" name="hired_at">
          <a-date-picker
            class="w-full"
            v-model:value="formState.hired_at"
            format="DD/MM/YYYY"
            :locale="locale"
            placeholder="Sanani tanlang"
            :disabled="!formState.first_name"
          />
        </a-form-item>

        <a-form-item
          label="Lavozimga tayinlangan sana"
          name="position_changed_at"
        >
          <a-date-picker
            class="w-full"
            v-model:value="formState.position_changed_at"
            format="DD/MM/YYYY"
            :locale="locale"
            placeholder="Sanani tanlang"
            :disabled="!formState.position_id"
          />
        </a-form-item>
      </div>
    </a-form>

    <template #footer>
      <div class="w-full flex items-center">
        <a-popconfirm
          title="Parolni o'chirmoqchimisiz?"
          placement="topLeft"
          ok-text="Ha"
          cancel-text="Yo'q"
          @confirm="deletePassword"
        >
          <a-button v-if="type == 'update'" danger>
            Xodim parolni o'chirish
          </a-button>
        </a-popconfirm>

        <div class="ml-auto flex items-center gap-3">
          <a-button @click="open = false">Bekor qilish</a-button>
          <a-button type="primary" @click="handleSubmit">Saqlash</a-button>
        </div>
      </div>
    </template>
  </a-modal>
</template>
