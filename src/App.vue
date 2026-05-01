<script lang="ts" setup>
import { watch, ref } from "vue";
import uzUZ from "@/locale/uzUZ";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

const localeMap: any = {
  // en: enUS,
  uz: uzUZ,
  // ru: ruRu,
};

const antdLocale = ref(localeMap[locale.value] || uzUZ);

watch(locale, (newLocale) => {
  localStorage.setItem("locale", newLocale);
  antdLocale.value = localeMap[newLocale] || uzUZ;
});
</script>

<template>
  <RouterView />
</template>
