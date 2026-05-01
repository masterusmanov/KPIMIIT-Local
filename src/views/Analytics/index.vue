<template>
  <section class="relative">
    <div class="container space-y-5">
      <!-- <TheFilter class="mt-5">
        <a-radio-group
          :value="$route.path.split('/')[2]"
          button-style="solid"
          class="the-tabs"
        >
          <a-radio-button value="ministry" @click="$router.push('/analytics')">
            {{ $t("ministry") }}
          </a-radio-button>
          <a-radio-button
            value="region"
            @click="$router.push('/analytics/region')"
          >
            {{ $t("region") }}
          </a-radio-button>
          <a-radio-button
            value="district"
            @click="$router.push('/analytics/district')"
          >
            {{ $t("district") }}
          </a-radio-button>
        </a-radio-group>
      </TheFilter> -->

      <router-view />
    </div>
  </section>
</template>
