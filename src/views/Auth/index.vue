<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
// import http from "../../libs/axios";
// import { useCookie } from "../../composables/useCookie";
// import { useStore } from "../../stores/index.store";

// const { setCookie } = useCookie();
const router = useRouter();
// const store = useStore();

const loginForm = ref();
const form = ref({
  login: null,
  password: null,
  // confirmPassword: null,
});

// const loginChecked = ref<boolean>(false);
// const showConfirmPassword = ref<boolean>(false);
// const user = ref<{ is_password_set: boolean; user_id: number } | null>(null);

const rules = {
  login: [{ required: true, message: "Loginni kiriting", trigger: "blur" }],
  password: [{ required: true, message: "Parolni kiriting", trigger: "blur" }],
  // confirmPassword: [
  //   {
  //     validator: (_rule: any, value: string) => {
  //       if (!value) {
  //         return Promise.reject("Parolni tasdiqlang"); // if empty
  //       }
  //       if (value !== form.value.password) {
  //         return Promise.reject("Parollar mos emas"); // if not matching
  //       }
  //       return Promise.resolve(); // if valid
  //     },
  //     trigger: "blur",
  //   },
  // ],
};

const oneIdLogin = async (): Promise<void> => {
  const client_id = "kpi_miit_uz";
  const redirectUrl = "https://kpi.miit.uz/auth/one-id";
  const oneIdUrl = `https://sso.egov.uz/sso/oauth/Authorization.do?response_type=one_code&client_id=${client_id}&redirect_uri=${redirectUrl}&scope=${client_id}&state=one_id`;
  window.location.replace(oneIdUrl);
};

// const checkLogin = async (login: string): Promise<void> => {
//   try {
//     const res = await http.get(`/auth/user-exists?login=${login}`);
//     user.value = res.data.data;
//   } catch (e) {
//     console.log(e);
//   }
// };

const handleSubmit = async () => {
  try {
    await loginForm.value.validateFields();

    // if (!loginChecked.value) {
    //   await checkLogin(values.login);
    //   if (!user.value) {
    //     loginChecked.value = false;
    //     return;
    //   }
    //   loginChecked.value = true;
    //   showConfirmPassword.value = !user.value.is_password_set;
    //   return;
    // }

    // if (values.confirmPassword) {
    //   await http.patch(`/auth/set-password/${user.value?.user_id}`, {
    //     password: values.confirmPassword,
    //   });
    // }

    // const { data } = await http.post("/auth/login", values);
    // setCookie("token", data.data.token);
    // await store.getUser();

    // // Foydalanuvchi roli SUPERADMIN bo'lsa /ministry sahifasiga yo'naltirish
    // if (store.user?.role === "SUPERADMIN") {
    //   router.push("/ministry");
    // } else {
    // }
    console.log("Muvaffaqiyatli:", form.value);
    router.push("/");
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <div
    class="pb-[50px] h-[calc(100vh-135px)] w-full flex items-center justify-between gap-5"
  >
    <div class="flex items-center gap-8">
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="100"
          width="100"
          height="100"
          rx="50"
          transform="rotate(90 100 0)"
          fill="#178BF1"
        />
        <rect
          x="70"
          y="30"
          width="40"
          height="40"
          rx="20"
          transform="rotate(90 70 30)"
          fill="white"
          fill-opacity="0.5"
        />
        <rect
          x="80"
          y="20"
          width="60"
          height="60"
          rx="30"
          transform="rotate(90 80 20)"
          fill="white"
          fill-opacity="0.5"
        />
        <rect
          x="90"
          y="10"
          width="80"
          height="80"
          rx="40"
          transform="rotate(90 90 10)"
          fill="white"
          fill-opacity="0.5"
        />
      </svg>

      <div class="text-2xl font-medium uppercase">
        Xodimlar faoliyati samaradorligini <br />
        KPI asosida baholash axborot tizimi
      </div>
    </div>

    <div class="flex flex-col items-center gap-10">
      <div class="text-3xl text-cDarkBlue font-bold">Tizimga kirish</div>

      <div class="flex items-center gap-6">
        <img
          class="cursor-pointer"
          src="/oneid.svg"
          alt=""
          title="OneID bilan Kirish"
          @click="oneIdLogin"
        />
        <img src="/e-imzo.svg" alt="" />
      </div>

      <a-form
        :model="form"
        :rules="rules"
        ref="loginForm"
        @finish="handleSubmit"
      >
        <a-form-item name="login">
          <a-input
            v-model:value="form.login"
            class="the-input"
            size="large"
            placeholder="Login"
          />
        </a-form-item>

        <a-form-item name="password">
          <a-input-password
            v-model:value="form.password"
            class="the-input"
            size="large"
            placeholder="Parol"
            :visibilityToggle="true"
          />
        </a-form-item>
        
        <!-- <template v-if="loginChecked">
          <a-form-item v-if="showConfirmPassword" name="confirmPassword">
            <a-input-password
              v-model:value="form.confirmPassword"
              class="the-input"
              size="large"
              placeholder="Parolni tasdiqlang"
              :visibilityToggle="true"
            />
          </a-form-item>
        </template> -->

        <a-button
          class="the-button min-w-[320px] bg-primary"
          size="large"
          type="primary"
          html-type="submit"
        >
          <strong class="text-sm">Kirish</strong>
        </a-button>
      </a-form>
    </div>
  </div>
</template>

<style scoped>
:deep(.ant-form-item-explain-error) {
  font-size: 12px; /* smaller font size */
  margin-top: 2px;
  color: #ff4d4f; /* or any color you want */
}
</style>
