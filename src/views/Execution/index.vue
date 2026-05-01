<template>
  <section class="relative">
    <div class="px-4 space-y-5">
      <!-- <TheFilter class="mt-5">
        <a-radio-group
          :value="$route.path.split('/')[2]"
          button-style="solid"
          class="the-tabs"
        >
          <a-radio-button value="ministry" @click="$router.push('/execution')">
            {{ $t("ministry") }}
          </a-radio-button>
          <a-radio-button
            value="region"
            @click="$router.push('/execution/region')"
          >
            {{ $t("region") }}
          </a-radio-button>
          <a-radio-button
            value="district"
            @click="$router.push('/execution/district')"
          >
            {{ $t("district") }}
          </a-radio-button>
        </a-radio-group>
      </TheFilter> -->

      <div class="text-lg font-bold">
        <template v-if="$route.meta.rank_id == 1">
         Viloyat hodimlari bo‘yicha tahlil ko‘rsatkichlari
        </template>
        <template v-else-if="$route.meta.rank_id == 2">
          Tuman hodimlari bo‘yicha tahlil ko‘rsatkichlari
        </template>
        <template v-else>
          Hodimlar bo‘yicha tahlil ko‘rsatkichlari
        </template>
      </div>

      <router-view />
    </div>
  </section>
</template>


<script setup>
const store = useStore();
const router = useRouter();

// WORKER bo'lsa, birdaniga viloyat darajasiga yo'naltirish
onMounted(() => {
  if (store.user?.role === 'WORKER'  || store.user?.role === 'ADMIN') {
    router.push({
      name: 'execution-region-district-employess',
      params: { region: store.user.region_id },
      query: { region: JSON.parse(store.user.region).uz }
    });
  }
});
</script>