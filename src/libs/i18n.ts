import { createI18n } from "vue-i18n";
import messages from "../locale";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("i18n_language") || "uz",
  fallbackLocale: "uz",
  messages,
});

export default i18n;
