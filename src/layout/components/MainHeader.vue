<template>
     <header
    class="bg-white z-20 border-b border-b-gray-100 sticky top-0 flex"
  >
    <div class="mx-auto w-full px-8 flex justify-between relative">
      <RouterLink to="/" class="flex gap-4 items-center">
        <img src="/gerb.png" alt="gerb" class="w-14" />
        <div class="flex flex-col">
          <span class="h-[18px] w-[1px] bg-[#087FFD]"></span>
          <span class="h-[18px] w-[1px] bg-white border-y border-y-cRed"></span>
          <span class="h-[18px] w-[1px] bg-[#07A920]"></span>
        </div>

        <h2 class="!m-0 uppercase text-sm font-medium max-w-[300px]">
          InvestFlow Platform
        </h2>
      </RouterLink>

      <div class="flex items-center gap-2">
        <div class="flex items-center flex-col gap-1">
          <span class="h-[20px] w-[1px] bg-cDarkBlue" />
          <PhoneFilled class="text-cDarkBlue rotate-90" />
          <span class="h-[20px] w-[1px] bg-cDarkBlue" />
        </div>
        <div class="mr-4">
          <p class="mb-1 text-black text-[10px] leading-none uppercase">
            Ishonch telefonlari:
          </p>
          <a href="tel:+998 (99) 123-45-67" class="text-black text-xs font-bold"
            >+998 (99) 123-45-67</a
          >
        </div>
        <div>
          <p class="mb-1 text-black text-[10px] leading-none uppercase">
            Ofis raqami:
          </p>
          <a href="tel:+998 (99) 123-45-67" class="text-black text-xs font-bold"
            >+998 (99) 123-45-67</a
          >
        </div>
      </div>
      <div class="flex items-center gap-2">
        <div class="flex items-center flex-col gap-1">
          <span class="h-[20px] w-[1px] bg-cDarkBlue" />
          <MailFilled class="text-cDarkBlue" />
          <span class="h-[20px] w-[1px] bg-cDarkBlue" />
        </div>
        <div class="mr-4">
          <p class="mb-1 text-black text-[10px] leading-none uppercase">
            Korparativ pochta:
          </p>
          <a href="mailto:info@miit.uz" class="text-black text-xs font-bold"
            >info@mail.ru </a
          >
        </div>
        <div>
          <p class="mb-1 text-black text-[10px] leading-none uppercase">
            Korparativ pochta:
          </p>
          <a href="mailto:info@exat.uz" class="text-black text-xs font-bold"
            >info@exat.uz</a
          >
        </div>
      </div>
      <img src="/building-bg.png" alt="Building bg" />

      <UserActions/>
    </div>
  </header>
</template>

<script setup lang="ts">
import UserActions from './UserActions.vue';

    const i18n = useI18n();

    const switchLocale = (e: any) => {
    localStorage.setItem("i18n_language", e);
    i18n.locale.value = e;
    location.reload();
    };
</script>

<style scoped>

</style>