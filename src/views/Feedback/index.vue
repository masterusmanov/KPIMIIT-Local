<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'

let map: any = null;

onMounted(() => {
  const script = document.createElement("script");
  script.src =
    "https://api-maps.yandex.ru/2.1/?apikey=70556d07-49e2-4f6c-9918-e83de8874955&lang=en_US";
  script.async = true;
  document.head.appendChild(script);

  script.onload = () => {
    // @ts-ignore
    ymaps.ready(() => {
      // @ts-ignore
      map = new ymaps.Map("ymap", {
        center: [41.30588, 69.276864],
        zoom: 17,
        controls: ["zoomControl"],
      });

      // @ts-ignore
      const placeMark = new ymaps.Placemark(
        [41.30588, 69.276864],
        {},
        {
          preset: "islands#redDotIcon",
        }
      );

      map.geoObjects.add(placeMark);
      
      // Xarita o'lchamini yangilash
      map.container.fitToViewport();
    });
  };
});

// Cleanup
onUnmounted(() => {
  if (map) {
    map.destroy();
  }
});
</script>

<template>
  <div class="flex items-center py-10">
    <div class="w-full px-6 sm:px-10 lg:px-20">
      <div class="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12">
        <!-- Left Content -->
        <div class="w-full lg:w-1/2 flex flex-col justify-center space-y-8">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <router-link to="/" class="flex gap-3 items-center">
              <img src="/gerb.png" alt="gerb" class="w-12 h-12 sm:w-16 sm:h-16" />

              <svg
                class="hidden sm:block"
                width="2"
                height="64"
                viewBox="0 0 2 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="0.0664062" width="1" height="21.333" fill="#087FFD" />
                <mask id="path-2-inside-1_5212_25492" fill="white">
                  <path d="M0.0664062 21.333H1.06641V42.666H0.0664062V21.333Z" />
                </mask>
                <path
                  d="M0.0664062 21.333H1.06641V42.666H0.0664062V21.333Z"
                  fill="white"
                />
                <path
                  d="M0.0664062 22.333H1.06641V20.333H0.0664062V22.333ZM1.06641 41.666H0.0664062V43.666H1.06641V41.666Z"
                  fill="#C60E0E"
                  mask="url(#path-2-inside-1_5212_25492)"
                />
                <rect
                  x="0.0664062"
                  y="42.666"
                  width="1"
                  height="21.333"
                  fill="#07A920"
                />
              </svg>

              <h2 class="uppercase text-sm sm:text-base font-medium max-w-[250px] sm:max-w-[350px]">
                {{ $t("ministry_name") }}
              </h2>
            </router-link>

            <div class="bg-black/5 py-3 px-6 text-lg sm:text-xl font-bold rounded-lg">
              © {{ new Date().getFullYear() }}
            </div>
          </div>

          <!-- Phone Numbers -->
          <div class="space-y-8">
            <div class="flex items-center gap-6">
              <div class="flex items-center flex-col gap-1">
                <span class="h-[80px] w-[2px] bg-black/20" />
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_5212_25503)">
                    <path
                      d="M20.01 15.88C18.78 15.88 17.59 15.68 16.48 15.32C16.13 15.2 15.74 15.29 15.47 15.56L13.9 17.53C11.07 16.18 8.42 13.63 7.01 10.7L8.96 9.04C9.23 8.76 9.31 8.37 9.2 8.02C8.83 6.91 8.64 5.72 8.64 4.49C8.64 3.95 8.19 3.5 7.65 3.5H4.19C3.65 3.5 3 3.74 3 4.49C3 13.78 10.73 21.5 20.01 21.5C20.72 21.5 21 20.87 21 20.32V16.87C21 16.33 20.55 15.88 20.01 15.88Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_5212_25503">
                      <rect
                        width="24"
                        height="24"
                        fill="white"
                        transform="translate(0 0.5)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <span class="h-[80px] w-[2px] bg-black/20" />
              </div>

              <div class="flex-1 space-y-6">
                <div>
                  <p class="mb-1 text-sm text-gray-600 uppercase">
                    {{ $t("helpline") }}:
                  </p>
                  <a href="tel:+998712385005" class="text-lg sm:text-lg font-bold hover:text-blue-600 transition">
                    +998 (71) 238-50-05
                  </a>
                </div>

                <div>
                  <p class="mb-1 text-sm text-gray-600 uppercase">
                    {{ $t("ministry_phone") }}:
                  </p>
                  <a href="tel:+998712385000" class="text-lg sm:text-lg font-bold hover:text-blue-600 transition">
                    +998 (71) 238-50-00
                  </a>
                </div>

                <div>
                  <p class="mb-1 text-sm text-gray-600 uppercase">
                    {{ $t("cabinet_phone") }}:
                  </p>
                  <a href="tel:+998712385090" class="text-lg sm:text-lg font-bold hover:text-blue-600 transition">
                    +998 (71) 238-50-90
                  </a>
                </div>
              </div>
            </div>

            <!-- Email -->
            <div class="flex items-center gap-6">
              <div class="flex items-center flex-col gap-1">
                <span class="h-[30px] w-[2px] bg-black/20" />
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_5212_25521)">
                    <path
                      d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_5212_25521">
                      <rect width="24" height="24" fill="black" />
                    </clipPath>
                  </defs>
                </svg>
                <span class="h-[30px] w-[2px] bg-black/20" />
              </div>

              <div class="flex-1">
                <p class="mb-2 text-sm text-gray-600">
                  {{ $t("corporate_email") }}:
                </p>
                <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
                  <a href="mailto:info@miit.uz" class="text-lg sm:text-lg font-bold hover:text-blue-600 transition">
                    info@miit.uz
                  </a>
                  <a href="mailto:miit@exat.uz" class="text-lg sm:text-lg font-bold hover:text-blue-600 transition">
                    miit@exat.uz
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Map Container -->
        <div class="w-full lg:w-1/2 h-[400px] sm:h-[500px] lg:h-[600px]">
          <div id="ymap" class="w-full h-full rounded-xl overflow-hidden shadow-2xl"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Xarita container stillar */
#ymap {
  position: relative;
  width: 100%;
  height: 100%;
  background: #f0f0f0;
}

/* Yandex xarita kontrollari uchun */
:deep(.ymaps-2-1-79-controls__control) {
  margin: 10px !important;
}

/* Hover effects */
a {
  transition: color 0.3s ease;
}

/* Full height layout */
.min-h-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .min-h-screen {
    padding: 40px 0;
  }
}
</style>