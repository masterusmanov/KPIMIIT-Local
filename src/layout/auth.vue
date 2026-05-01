<script lang="ts" setup>
import MainHeader from './components/MainHeader.vue';

const i18n = useI18n();

const switchLocale = (e: any) => {
  localStorage.setItem("i18n_language", e);
  i18n.locale.value = e;
  location.reload();
};
</script>

<style>
main {
  flex-grow: 1;
}
</style>

<template>
  <MainHeader/>

  <main>
    <section class="relative">
      <div class="container">
        <RouterView />
      </div>
    </section>
  </main>
</template>
