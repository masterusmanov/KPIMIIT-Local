<template>
  <section class="relative bg-white">
    <div class="px-4 space-y-5">
      <!-- <TheFilter class="mt-5">
        <a-radio-group
          class="the-tabs"
          :value="$route.path.split('/')[2] || 'ministry'"
          button-style="solid"
        >
          <a-radio-button value="ministry" @click="$router.push('/info')">
            {{ $t("ministry") }}
          </a-radio-button>
          <a-radio-button value="region" @click="$router.push('/info/region')">
            {{ $t("region") }}
          </a-radio-button>
          <a-radio-button
            value="district"
            @click="$router.push('/info/district')"
          >
            {{ $t("district") }}
          </a-radio-button>
        </a-radio-group>
      </TheFilter> -->

      <div class="mt-5 text-lg font-bold py-2">
        <template v-if="Number($route.meta.rank_id) == 1">
          Viloyat hodimlari bo‘yicha reja ko‘rsatkichlari
        </template>
        <template v-else-if="Number($route.meta.rank_id) == 2">
          Tuman hodimlari bo‘yicha reja ko‘rsatkichlari
        </template>
        <template v-else-if="Number($route.meta.rank_id) == 3">
          Hodimlar bo‘yicha reja ko‘rsatkichlari
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
      name: 'info-region-district-employess',
      params: { region: store.user.region_id },
      query: { region: JSON.parse(store.user.region).uz }
    });
  }
});
</script>