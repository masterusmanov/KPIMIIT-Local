<script lang="ts" setup>
import { ChevronDown } from "lucide-vue-next";

const route = useRoute();

const isOpen = ref(false);
const container = ref();
const content = ref();

const toggle = async () => {
  isOpen.value = !isOpen.value;
  await nextTick(); // wait for DOM update

  const el = container.value;
  const inner = content.value;

  if (isOpen.value) {
    el.style.maxHeight = inner.scrollHeight + "px";

    // Allow smooth animation then reset for dynamic content
    const transitionDone = () => {
      if (isOpen.value) el.style.maxHeight = "none";
      el.removeEventListener("transitionend", transitionDone);
    };
    el.addEventListener("transitionend", transitionDone);
  } else {
    el.style.maxHeight = inner.scrollHeight + "px"; // set to full height first
    requestAnimationFrame(() => {
      el.style.maxHeight = "0px";
    });
  }
};

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
      const map = new ymaps.Map("ymap", {
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
    });
  };
});
</script>

<template>
  <footer class="mt-5 w-full">
    <button class="ml-5 mb-4 flex items-center gap-2" @click="toggle">
      <div class="p-1 border rounded-md">
        <ChevronDown
          class="size-6 text-cBlue"
          :class="{ 'rotate-180': isOpen }"
        />
      </div>
      <span class="text-sm font-medium">Aloqa uchun</span>
    </button>

    <div
      ref="container"
      class="max-h-[0px] overflow-hidden transition-[max-height] duration-300 ease-in-out"
    >
      <div ref="content" class="container grid grid-cols-2">
        <div class="relative py-12 pr-6 flex flex-col gap-12">
          <div
            class="absolute top-0 right-0 -z-10 w-[50vw] h-full bg-[url('/auth-bg.png')] bg-cover bg-no-repeat bg-center"
          ></div>

          <div class="mb-5 flex items-center justify-between gap-4">
            <router-link to="/" class="flex gap-4 items-center">
              <img src="/gerb.png" alt="gerb" class="size-14" />

              <svg
                width="2"
                height="56"
                viewBox="0 0 2 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="0.0664062" width="1" height="18.6667" fill="#087FFD" />
                <mask id="path-2-inside-1_5212_25492" fill="white">
                  <path
                    d="M0.0664062 18.6666H1.06641V37.3333H0.0664062V18.6666Z"
                  />
                </mask>
                <path
                  d="M0.0664062 18.6666H1.06641V37.3333H0.0664062V18.6666Z"
                  fill="white"
                />
                <path
                  d="M0.0664062 19.6666H1.06641V17.6666H0.0664062V19.6666ZM1.06641 36.3333H0.0664062V38.3333H1.06641V36.3333Z"
                  fill="#C60E0E"
                  mask="url(#path-2-inside-1_5212_25492)"
                />
                <rect
                  x="0.0664062"
                  y="37.3334"
                  width="1"
                  height="18.6667"
                  fill="#07A920"
                />
              </svg>

              <h2
                class="uppercase text-white text-sm font-medium max-w-[300px]"
              >
                {{ $t("ministry_name") }}
              </h2>
            </router-link>

            <div class="bg-white/10 py-3 px-6 text-2xl text-white font-bold">
              © {{ new Date().getFullYear() }}
            </div>
          </div>

          <div class="flex flex-1 flex-col justify-between">
            <div class="flex items-center gap-6 mb-12">
              <div class="flex items-center flex-col gap-1">
                <span class="h-[68px] w-[1px] bg-white" />
                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_5212_25503)">
                    <path
                      d="M20.01 15.88C18.78 15.88 17.59 15.68 16.48 15.32C16.13 15.2 15.74 15.29 15.47 15.56L13.9 17.53C11.07 16.18 8.42 13.63 7.01 10.7L8.96 9.04C9.23 8.76 9.31 8.37 9.2 8.02C8.83 6.91 8.64 5.72 8.64 4.49C8.64 3.95 8.19 3.5 7.65 3.5H4.19C3.65 3.5 3 3.74 3 4.49C3 13.78 10.73 21.5 20.01 21.5C20.72 21.5 21 20.87 21 20.32V16.87C21 16.33 20.55 15.88 20.01 15.88Z"
                      fill="white"
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
                <span class="h-[68px] w-[1px] bg-white" />
              </div>

              <div class="flex h-[168px] flex-col justify-between">
                <div>
                  <p class="mb-1 text-white text-xs leading-none uppercase">
                    {{ $t("helpline") }}:
                  </p>
                  <a
                    href="tel:+998 (71) 238-50-05"
                    class="text-white text-base font-bold"
                    >+998 (71) 238-50-05</a
                  >
                </div>

                <div>
                  <p class="mb-1 text-white text-xs leading-none uppercase">
                    {{ $t("ministry_phone") }}:
                  </p>
                  <a
                    href="tel:+998 (71) 238-50-00"
                    class="text-white text-base font-bold"
                    >+998 (71) 238-50-00</a
                  >
                </div>

                <div>
                  <p class="mb-1 text-white text-xs leading-none uppercase">
                    {{ $t("cabinet_phone") }}:
                  </p>
                  <a
                    href="tel:+998 (71) 238-50-90"
                    class="text-white text-base font-bold"
                    >+998 (71) 238-50-90</a
                  >
                </div>
              </div>
            </div>

            <div class="flex items-center gap-6 mb-12">
              <div class="flex items-center flex-col gap-1">
                <span class="h-[24px] w-[1px] bg-white" />
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_5212_25521)">
                    <path
                      d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_5212_25521">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>

                <span class="h-[24px] w-[1px] bg-white" />
              </div>

              <div class="flex h-full flex-col justify-center">
                <div>
                  <p class="mb-1 text-white text-sm leading-none">
                    {{ $t("corporate_email") }}:
                  </p>
                  <div class="flex items-center gap-4">
                    <a
                      href="mailto:info@miit.uz"
                      class="text-white text-base font-bold"
                      >info@miit.uz</a
                    >
                    <a
                      href="mailto:miit@exat.uz"
                      class="text-white text-base font-bold"
                      >miit@exat.uz</a
                    >
                  </div>
                </div>
              </div>
            </div>

            <div class="flex gap-2">
              <a href="https://facebook.com/">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="32" height="32" rx="16" fill="white" />
                  <path
                    d="M19.9476 16.932L20.3883 14.0583H17.6311V12.1942C17.6311 11.408 18.0163 10.6408 19.2513 10.6408H20.5049V8.19417C20.5049 8.19417 19.3672 8 18.2794 8C16.0085 8 14.5243 9.37631 14.5243 11.868V14.0583H12V16.932H14.5243V23.8792C15.5536 24.0403 16.6017 24.0403 17.6311 23.8792V16.932H19.9476Z"
                    fill="#003894"
                  />
                </svg>
              </a>
              <a href="https://instagram.com/">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="32" height="32" rx="16" fill="white" />
                  <g clip-path="url(#clip0_5212_25533)">
                    <path
                      d="M16 9.44062C18.1375 9.44062 18.3906 9.45 19.2312 9.4875C20.0125 9.52187 20.4344 9.65312 20.7156 9.7625C21.0875 9.90625 21.3562 10.0812 21.6344 10.3594C21.9156 10.6406 22.0875 10.9062 22.2312 11.2781C22.3406 11.5594 22.4719 11.9844 22.5062 12.7625C22.5437 13.6062 22.5531 13.8594 22.5531 15.9937C22.5531 18.1312 22.5437 18.3844 22.5062 19.225C22.4719 20.0062 22.3406 20.4281 22.2312 20.7094C22.0875 21.0812 21.9125 21.35 21.6344 21.6281C21.3531 21.9094 21.0875 22.0812 20.7156 22.225C20.4344 22.3344 20.0094 22.4656 19.2312 22.5C18.3875 22.5375 18.1344 22.5469 16 22.5469C13.8625 22.5469 13.6094 22.5375 12.7687 22.5C11.9875 22.4656 11.5656 22.3344 11.2844 22.225C10.9125 22.0812 10.6437 21.9062 10.3656 21.6281C10.0844 21.3469 9.9125 21.0812 9.76875 20.7094C9.65937 20.4281 9.52812 20.0031 9.49375 19.225C9.45625 18.3812 9.44687 18.1281 9.44687 15.9937C9.44687 13.8562 9.45625 13.6031 9.49375 12.7625C9.52812 11.9812 9.65937 11.5594 9.76875 11.2781C9.9125 10.9062 10.0875 10.6375 10.3656 10.3594C10.6469 10.0781 10.9125 9.90625 11.2844 9.7625C11.5656 9.65312 11.9906 9.52187 12.7687 9.4875C13.6094 9.45 13.8625 9.44062 16 9.44062ZM16 8C13.8281 8 13.5562 8.00937 12.7031 8.04687C11.8531 8.08437 11.2687 8.22187 10.7625 8.41875C10.2344 8.625 9.7875 8.89687 9.34375 9.34375C8.89687 9.7875 8.625 10.2344 8.41875 10.7594C8.22187 11.2687 8.08437 11.85 8.04687 12.7C8.00937 13.5562 8 13.8281 8 16C8 18.1719 8.00937 18.4437 8.04687 19.2969C8.08437 20.1469 8.22187 20.7312 8.41875 21.2375C8.625 21.7656 8.89687 22.2125 9.34375 22.6562C9.7875 23.1 10.2344 23.375 10.7594 23.5781C11.2687 23.775 11.85 23.9125 12.7 23.95C13.5531 23.9875 13.825 23.9969 15.9969 23.9969C18.1687 23.9969 18.4406 23.9875 19.2937 23.95C20.1437 23.9125 20.7281 23.775 21.2344 23.5781C21.7594 23.375 22.2062 23.1 22.65 22.6562C23.0937 22.2125 23.3687 21.7656 23.5719 21.2406C23.7687 20.7312 23.9062 20.15 23.9437 19.3C23.9812 18.4469 23.9906 18.175 23.9906 16.0031C23.9906 13.8312 23.9812 13.5594 23.9437 12.7062C23.9062 11.8562 23.7687 11.2719 23.5719 10.7656C23.375 10.2344 23.1031 9.7875 22.6562 9.34375C22.2125 8.9 21.7656 8.625 21.2406 8.42187C20.7312 8.225 20.15 8.0875 19.3 8.05C18.4437 8.00938 18.1719 8 16 8Z"
                      fill="#003894"
                    />
                    <path
                      d="M16 11.8906C13.7313 11.8906 11.8906 13.7313 11.8906 16C11.8906 18.2688 13.7313 20.1094 16 20.1094C18.2688 20.1094 20.1094 18.2688 20.1094 16C20.1094 13.7313 18.2688 11.8906 16 11.8906ZM16 18.6656C14.5281 18.6656 13.3344 17.4719 13.3344 16C13.3344 14.5281 14.5281 13.3344 16 13.3344C17.4719 13.3344 18.6656 14.5281 18.6656 16C18.6656 17.4719 17.4719 18.6656 16 18.6656Z"
                      fill="#003894"
                    />
                    <path
                      d="M21.2312 11.7282C21.2312 12.2594 20.8 12.6876 20.2719 12.6876C19.7406 12.6876 19.3125 12.2563 19.3125 11.7282C19.3125 11.1969 19.7437 10.7688 20.2719 10.7688C20.8 10.7688 21.2312 11.2 21.2312 11.7282Z"
                      fill="#003894"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_5212_25533">
                      <rect
                        width="16"
                        height="16"
                        fill="white"
                        transform="translate(8 8)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </a>
              <a href="https://linkedin.com/">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="32" height="32" rx="16" fill="white" />
                  <g clip-path="url(#clip0_5212_25535)">
                    <path
                      d="M22.8189 8H9.18111C8.86786 8 8.56744 8.12444 8.34594 8.34594C8.12444 8.56744 8 8.86786 8 9.18111V22.8189C8 23.1321 8.12444 23.4326 8.34594 23.6541C8.56744 23.8756 8.86786 24 9.18111 24H22.8189C23.1321 24 23.4326 23.8756 23.6541 23.6541C23.8756 23.4326 24 23.1321 24 22.8189V9.18111C24 8.86786 23.8756 8.56744 23.6541 8.34594C23.4326 8.12444 23.1321 8 22.8189 8ZM12.7689 21.63H10.3633V13.9889H12.7689V21.63ZM11.5644 12.93C11.2916 12.9285 11.0253 12.8461 10.7992 12.6934C10.573 12.5407 10.3972 12.3244 10.2939 12.0718C10.1906 11.8192 10.1644 11.5417 10.2187 11.2743C10.2729 11.0069 10.4052 10.7615 10.5988 10.5692C10.7923 10.3769 11.0385 10.2462 11.3063 10.1936C11.5741 10.1411 11.8514 10.1691 12.1033 10.274C12.3552 10.3789 12.5704 10.5561 12.7216 10.7832C12.8729 11.0103 12.9535 11.2771 12.9533 11.55C12.9559 11.7327 12.9217 11.914 12.8527 12.0832C12.7837 12.2524 12.6813 12.4059 12.5517 12.5347C12.4221 12.6635 12.2679 12.7649 12.0983 12.8328C11.9287 12.9007 11.7471 12.9337 11.5644 12.93ZM21.6356 21.6367H19.2311V17.4622C19.2311 16.2311 18.7078 15.8511 18.0322 15.8511C17.3189 15.8511 16.6189 16.3889 16.6189 17.4933V21.6367H14.2133V13.9944H16.5267V15.0533H16.5578C16.79 14.5833 17.6033 13.78 18.8444 13.78C20.1867 13.78 21.6367 14.5767 21.6367 16.91L21.6356 21.6367Z"
                      fill="#003894"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_5212_25535">
                      <rect
                        width="16"
                        height="16"
                        fill="white"
                        transform="translate(8 8)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div id="ymap" class="h-full min-w-[50vw]"></div>
      </div>
    </div>
  </footer>
</template>
