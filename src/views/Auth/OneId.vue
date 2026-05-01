<script lang="ts" setup>
import axios from "axios";
import http from "@/libs/axios";
import { message } from "ant-design-vue";

const { setCookie } = useCookie();
const router = useRouter();
const route = useRoute();
const store = useStore();

const loginOneId = async (pinfl: string): Promise<void> => {
  if (!pinfl) {
    message.error("Error login");
    return;
  }

  try {
    const res = await http.post("/auth/one-id/login", { pinfl });
    setCookie("token", res.data.data.token);
    await store.getUser();
    router.push("/");
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};

const getInfo = async (token: string): Promise<void> => {
  if (!token) {
    message.error("Error in getting info");
    return;
  }

  try {
    const res = await axios.post(
      "https://sso.egov.uz/sso/oauth/Authorization.do",
      {},
      {
        params: {
          grant_type: "one_access_token_identify",
          client_id: "kpi_miit_uz",
          client_secret: "W4m81m8PDikRh15pGJn9FR9m",
          access_token: token,
          scope: "kpi_miit_uz",
        },
      }
    );

    loginOneId(res.data.pin);
  } catch (e) {
    console.error(e);
  }
};

const getToken = async (code: string): Promise<void> => {
  if (!code) {
    message.error("Error in getting token");
    return;
  }

  try {
    const res = await axios.post(
      "https://sso.egov.uz/sso/oauth/Authorization.do",
      {},
      {
        params: {
          grant_type: "one_authorization_code",
          client_id: "kpi_miit_uz",
          client_secret: "W4m81m8PDikRh15pGJn9FR9m",
          redirect_uri: "https://kpi.miit.uz/auth/one-id",
          code: code,
        },
      }
    );

    getInfo(res.data.access_token);
  } catch (e) {
    console.error(e);
  }
};

onMounted(() => getToken(route.query.code as string));
</script>

<template>
  <div class="h-svh flex justify-center items-center loading-container">
    <a-spin size="large" tip="Authenticating, please wait..."></a-spin>
  </div>
</template>
