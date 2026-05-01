<script lang="ts" setup>
// import { ref, onMounted } from "vue";
// import dayjs from "dayjs";

// import { useAuthStore } from "@/stores/auth";
// import { useEIMZO } from "vue-eimzo";
// import { notification } from "ant-design-vue";
// import { useI18n } from "vue-i18n";
// import axios from "axios";

// const authStore = useAuthStore();

// defineProps({
//   open: {
//     type: Boolean,
//     default: false,
//     required: true,
//   },
// });

// const emit = defineEmits(["close"]);

// const { t } = useI18n();
// const certs = ref("");
// const eimzo = useEIMZO();
// const customCert = ref("");
// const certInfo = ref("");
// const locationInfo = ref("");
// const opened = ref(false);

// const baseURL = "https://e-imzo.miit.uz/api/e-imzo-backend/v1";

// const login = (pinfl) => {
//   authStore.pinflLogin(pinfl).then(() => {
//     emit("close");
//     notification.success({
//       message: t("enter_successfully"),
//       description: t("welcome"),
//     });
//   });
// };

// const getChallenge = async () => {
//   try {
//     const res = await axios.get(`${baseURL}/generate-challenge`);

//     return res.data.data.challenge;
//   } catch (e) {
//     console.error(e);
//   }
// };

// function getLocation() {
//   locationInfo.value = customCert.value?.alias
//     ?.split(",")
//     .reduce((acc, item) => {
//       const [key, value] = item.split("=").map((str) => str.trim());
//       if (key === "l") acc.tumani = value;
//       if (key === "st") acc.viloyati = value;
//       return acc;
//     }, {});
// }

// async function showVersion() {
//   await eimzo.install();
//   eimzo.addApiKey("reyting.miit.uz", "");
//   certs.value = await eimzo.listAllUserKeys();
//   // console.log(certs.value);
//   customCert.value = certs.value[0];
//   getLocation();
// }

// async function Elogin() {
//   try {
//     const loadKeyResult = await eimzo.loadKey(customCert.value);
//     const mainCert = await eimzo.getMainCertificate(loadKeyResult.id);
//     certInfo.value = await eimzo.getCertInfo(mainCert);

//     const challenge = await getChallenge();
//     const pkcs7 = await eimzo.createPkcs7(loadKeyResult.id, challenge, null);

//     const auth = await axios.post(`${baseURL}/auth`, {
//       keyId: loadKeyResult.id,
//       pkcs: pkcs7,
//     });

//     await login(loadKeyResult.cert.PINFL);

//     console.log(auth);
//   } catch (error) {
//     console.error(error);
//     alert(error);
//   }
// }

// onMounted(showVersion);
</script>

<template>
  <!-- <a-modal
    @opened="opened"
    @cancel="emit('close')"
    :open="open"
    :footer="null"
  >
    <ul v-if="certs?.length > 0" class="certificate-list">
      <li v-for="cert in certs" :key="cert.PINFL">
        <h3 class="text-base font-semibold">{{ cert?.CN }}</h3>

        <ul class="flex items-center justify-between gap-2 mt-4">
          <li class="flex flex-col">
            <span>{{ $t("login.pinfl") }}</span>
            <p class="text-base font-medium">{{ cert?.PINFL }}</p>
          </li>
          <li class="flex flex-col">
            <span>{{ $t("certificate_number") }}</span>
            <p class="text-base font-medium">{{ cert?.serialNumber }}</p>
          </li>
        </ul>

        <ul class="flex items-center justify-between gap-2 mt-4">
          <li class="flex flex-col">
            <span>{{ $t("certificate_deadline_date") }}</span>
            <p class="text-base font-medium">
              {{ dayjs(cert?.validFrom).format("DD.MM.YYYY") }} -
              {{ dayjs(cert?.validTo).format("DD.MM.YYYY") }}
            </p>
          </li>
          <li class="flex flex-col">
            <span>STIR</span>
            <p class="text-base font-medium">
              {{ cert?.UID ? cert?.UID : $t("not_found") }}
            </p>
          </li>
        </ul>

        <a-button
          type="primary"
          class="w-full mt-4 flex justify-center primary"
          @click="Elogin()"
        >
          {{ $t("login.login") }}
        </a-button>
      </li>
    </ul>
    <div v-else class="h-80 flex items-center justify-center">
      <p class="font-bold text-2xl">
        {{ $t("eimzo.not_found") }}
      </p>
    </div>
  </a-modal> -->
</template>

<style>
.certificate-list {
  margin-top: 28px !important;
  border: 1px solid #0561f5;
  padding: 20px 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
