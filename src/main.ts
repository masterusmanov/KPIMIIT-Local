import "./assets/input.css";
import "./assets/main.css";
import "ant-design-vue/dist/reset.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import i18n from "./libs/i18n";

import App from "./App.vue";
import router from "./router";

import dayjs from "dayjs";
import "dayjs/locale/ru";

dayjs.locale("ru");

const app = createApp(App);

app.use(createPinia());
app.use(i18n);
app.use(router);

app.config.globalProperties.$t = i18n.global.t;

app.mount("#app");
