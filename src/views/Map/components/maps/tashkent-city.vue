<template>
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 480 518"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Bektemir tumani -->
    <path
      :class="getPathStyle(1726264)"
      @mouseover="hoveredRegion = 1726264"
      @mouseleave="hoveredRegion = null"
      @click="emit('changeDistrict', 1726264)"
      d="M205.938 516.908L201.791 517.501H195.868L200.014 512.762V509.8L198.83 507.431V505.062H202.384L210.084 494.4V487.885L216.599 483.738L221.338 483.146L226.669 475.446V466.561L247.4 449.384L262.208 439.315L271.092 431.022L272.869 428.061V422.137L271.685 415.622V410.883L277.016 408.514L290.047 397.852L297.154 388.375H300.116V396.668H304.855L313.739 389.56L320.255 383.044H323.809V384.229H326.77L332.101 380.675H335.063L336.247 379.491H339.209L340.394 383.044H343.947V375.937L348.686 370.606L350.463 367.644L355.201 363.498V362.906H359.348L361.125 361.721L374.748 345.136H383.04L387.187 343.952L398.441 330.921L415.025 301.305V297.751L414.433 294.197H424.503L436.349 282.351H441.087V292.42L444.049 298.935H468.334V301.897L446.418 323.22V328.551L463.595 343.952V350.467L460.634 352.244L455.303 358.167H452.341L448.195 349.282H443.457H433.387L432.203 343.359H428.649L427.464 345.729L421.541 352.244L414.433 353.429L403.179 358.167L395.479 368.237L383.04 384.229V390.152H380.671L379.486 387.191H375.34L367.64 391.337L365.271 390.745H358.755L356.978 394.891L354.017 396.668L345.724 404.368H342.763L342.17 400.222L341.578 396.668H336.247L332.101 401.999L324.401 412.068L306.039 422.73L290.047 431.022L281.162 438.722L273.462 439.907L268.131 442.276L249.177 456.492L229.038 469.523V473.077L232 476.038L237.33 484.681V492.031L235.553 501.508L233.776 512.762L233.184 516.908H205.938Z"
      fill="currentColor"
      stroke="#284847"
    >
      <title>{{ getName(1726264) }}</title>
    </path>

    <!-- Yunusobod tumani -->
    <path
      :class="getPathStyle(1726266)"
      @mouseover="hoveredRegion = 1726266"
      @mouseleave="hoveredRegion = null"
      @click="emit('changeDistrict', 1726266)"
      d="M187.589 1L175.742 9.88476L190.55 30.6159L191.735 38.9083L245.043 96.9554L280.582 109.986L269.328 168.626L240.305 192.911L245.043 195.28L243.859 203.572L239.12 216.011H242.674L246.228 208.903L251.559 205.349L256.297 203.572L247.413 200.019V196.465H250.374L256.297 198.834L265.774 191.134L272.882 188.764L275.844 181.657H284.729V172.772L289.467 163.887L291.244 155.002L300.129 150.264L301.906 141.971L308.421 137.233L312.567 129.533L316.714 130.717L323.229 149.079H326.191V141.971V133.679L331.522 130.717V123.017L338.037 114.133L343.96 105.248H355.807L370.615 92.8091L338.037 62.0087L326.191 30.6159H266.367L224.905 1H187.589Z"
      fill="currentColor"
      stroke="#284847"
    >
      <title>{{ getName(1726266) }}</title>
    </path>

    <!-- Mirzo Ulug‘bek tumani -->
    <path
      :class="getPathStyle(1726269)"
      @mouseover="hoveredRegion = 1726269"
      @mouseleave="hoveredRegion = null"
      @click="emit('changeDistrict', 1726269)"
      d="M394.299 96.9561L370.606 92.8099L370.014 93.4022L355.661 105.249H343.952L331.513 123.018V130.718L326.183 133.68V149.08H323.221L316.706 130.718L312.559 129.534L308.413 137.234L301.898 141.972L300.121 150.265L291.236 155.003L289.459 163.888L284.72 172.773V181.657H275.836L272.874 188.765L265.766 191.135L263.397 192.911L262.805 195.281L271.689 198.835L282.351 203.573L295.382 207.719L298.936 198.835L304.859 195.281L311.375 194.096L319.075 181.657H323.221L336.844 188.173H348.691L356.391 192.911L369.422 208.904L383.045 194.096L410.884 167.442L431.023 143.749L432.8 133.087L435.761 125.98L444.646 128.941L449.977 125.98L454.123 124.203H460.639L464.193 127.164L468.931 128.941L474.854 125.98L479 122.426V117.095V109.987L476.631 104.656L471.3 96.9561L461.823 95.1792V86.2944V68.5249L432.8 82.7405L409.699 78.5943L394.299 96.9561Z"
      fill="currentColor"
      stroke="#284847"
    >
      <title>{{ getName(1726269) }}</title>
    </path>

    <!-- Olmazor tumani -->
    <path
      :class="getPathStyle(1726280)"
      @mouseover="hoveredRegion = 1726280"
      @mouseleave="hoveredRegion = null"
      @click="emit('changeDistrict', 1726280)"
      d="M172.179 9.8844H175.733L190.541 30.6155L191.725 38.9079L245.034 96.955L236.742 109.394L232.003 114.725L236.742 118.278V120.648L220.157 144.933L210.68 158.556L206.533 154.41H199.426L196.464 155.594L189.949 158.556L183.433 167.441H181.656L162.702 152.633L146.709 140.786L134.863 131.309L137.825 125.979L138.417 121.24L136.64 120.648L123.017 116.501L110.578 112.948H91.6239L82.7391 115.317H69.7081L67.3389 113.54L72.0774 98.1396L80.9622 88.0703L172.179 9.8844Z"
      fill="currentColor"
      stroke="#284847"
    >
      <title>{{ getName(1726280) }}</title>
    </path>

    <!-- Shayxontoxur tumani -->
    <path
      :class="getPathStyle(1726277)"
      @mouseover="hoveredRegion = 1726277"
      @mouseleave="hoveredRegion = null"
      @click="emit('changeDistrict', 1726277)"
      d="M67.3407 134.272V114.133L69.71 115.317H82.741L91.6257 112.948H110.58L138.419 121.241L137.826 125.979L134.865 131.31L181.658 167.441H183.435L189.95 158.557L199.427 154.41H206.535L210.681 158.557L236.743 120.648V118.279L232.005 114.725L236.743 109.394L245.036 96.9556L280.575 109.987L269.321 168.626L240.297 192.911L223.712 210.68H220.159V218.973L202.389 232.004H199.427L181.658 224.896L168.627 218.973L163.888 223.119H128.349C125.388 222.132 119.228 219.921 118.28 218.973C117.332 218.025 116.306 184.618 115.911 168.034L114.134 163.295L86.8872 162.703L70.3023 161.518L69.1177 155.595H65.5638L62.0099 159.149H59.6406L60.2329 155.595L65.5638 147.303L67.3407 134.272Z"
      fill="currentColor"
      stroke="#284847"
    >
      <title>{{ getName(1726277) }}</title>
    </path>

    <!-- Uchtepa tumani -->
    <path
      :class="getPathStyle(1726262)"
      @mouseover="hoveredRegion = 1726262"
      @mouseleave="hoveredRegion = null"
      @click="emit('changeDistrict', 1726262)"
      d="M49.57 172.181L59.6394 159.15H62.0087L65.5626 155.596H69.1165L70.3011 161.519L85.7013 162.704L114.133 163.296L115.91 168.035L118.279 218.382V221.935L118.871 268.729L124.794 274.652L118.279 281.167L109.986 283.536L93.4015 289.46L82.7398 297.16L81.5551 294.79H78.0012L73.2627 299.529L65.5626 298.344L44.2391 314.337H41.8699L39.5006 303.083V280.575L42.4622 273.467L40.6852 268.729H34.7621L32.3928 273.467L21.1388 285.906L6.92317 298.344H1V288.867L3.96159 285.906L15.2156 268.136L16.9926 263.398L14.031 257.474V253.921L24.6927 246.22L25.285 240.89C26.4696 238.915 28.8389 234.848 28.8389 234.374C28.8389 233.9 34.7621 225.884 37.7237 221.935L41.8699 217.789V208.312L40.0929 201.797L41.8699 194.689L48.3854 182.25L49.57 172.181Z"
      fill="currentColor"
      stroke="#284847"
    >
      <title>{{ getName(1726262) }}</title>
    </path>

    <!-- Chilonzor tumani -->
    <path
      :class="getPathStyle(1726294)"
      @mouseover="hoveredRegion = 1726294"
      @mouseleave="hoveredRegion = null"
      @click="emit('changeDistrict', 1726294)"
      d="M43.0576 318.482V314.336H44.2423L65.5657 298.344L73.2658 299.528L78.0043 294.79H81.5582L82.7429 297.159L93.4046 289.459L118.282 281.166L124.797 274.651L118.874 268.728L118.282 218.973L128.351 223.119H163.89L168.629 218.973L199.429 232.004H200.614L200.022 235.558L198.245 239.112L193.506 243.258V247.997L192.914 255.104L188.768 256.881V266.951L180.475 272.874L170.406 287.682L160.336 309.005L152.636 324.406V326.775L155.006 329.736V332.698L139.605 345.137L123.02 358.76L104.659 377.714L88.0737 400.814H85.1121L82.7429 395.484L81.5582 388.968L78.5966 378.899L73.2658 375.937L72.0812 370.606L72.6735 364.091V356.983L69.7119 347.506L68.5273 339.214L61.4194 333.883L43.0576 318.482Z"
      fill="currentColor"
      stroke="#284847"
    >
      <title>{{ getName(1726294) }}</title>
    </path>

    <!-- Yakkasaroy tumani -->
    <path
      :class="getPathStyle(1726287)"
      @mouseover="hoveredRegion = 1726287"
      @mouseleave="hoveredRegion = null"
      @click="emit('changeDistrict', 1726287)"
      d="M157.371 332.105H155.002V329.736L152.633 326.774V324.405L170.402 287.681L180.472 272.873L188.764 266.95V256.881L192.91 255.104L193.503 248.269V243.258L198.241 239.111L200.018 235.557L200.61 232.004H202.387L220.157 218.973V210.68H223.711L240.296 192.911L245.034 195.28L243.85 203.572L239.111 216.011H242.665L245.034 223.119L249.773 237.334V242.665L242.665 250.958V259.842L251.55 272.873L245.627 287.089L240.296 295.974L222.526 301.897L201.203 306.636L189.356 310.782L169.218 323.813L157.371 332.105Z"
      fill="currentColor"
      stroke="#284847"
    >
      <title>{{ getName(1726287) }}</title>
    </path>

    <!-- Mirobod tumani -->
    <path
      :class="getPathStyle(1726273)"
      @mouseover="hoveredRegion = 1726273"
      @mouseleave="hoveredRegion = null"
      @click="emit('changeDistrict', 1726273)"
      d="M251.552 295.974H240.298C242.075 293.21 245.629 287.563 245.629 287.089C245.629 286.615 249.577 277.415 251.552 272.873L242.667 259.842V250.958L249.775 242.665V237.334L242.667 216.011L246.221 208.903L251.552 205.349L256.29 203.572L247.406 200.018V196.465H250.367L256.29 198.834L263.398 192.911L262.806 195.28L265.767 196.465L266.36 198.834L273.468 209.496L287.683 226.673L305.453 251.55L310.191 265.766L315.522 272.873L330.33 310.189L355.207 363.498L350.469 367.644L346.323 368.236L339.807 363.498L326.184 351.059H304.86V332.697L306.045 331.513V322.628L319.668 313.743V311.374L317.299 304.859L311.968 305.451L306.045 308.412L298.937 306.636L297.16 297.751H287.683L284.129 294.197L275.245 286.497H271.098L261.621 293.012L253.329 294.197L251.552 295.974Z"
      fill="currentColor"
      stroke="#284847"
    >
      <title>{{ getName(1726273) }}</title>
    </path>

    <!-- Yashnobod tumani -->
    <path
      :class="getPathStyle(1726290)"
      @mouseover="hoveredRegion = 1726290"
      @mouseleave="hoveredRegion = null"
      @click="emit('changeDistrict', 1726290)"
      d="M384.821 195.872H381.267L369.421 208.903L356.39 192.91L348.69 188.171H336.844L323.22 181.656H319.074L311.374 194.095L304.859 195.279L298.935 198.833L295.381 207.718L282.351 203.572L265.766 196.464L266.358 198.833L273.466 209.495L287.681 226.672L305.451 251.549L310.189 265.765L315.52 272.873L323.813 295.381L333.882 318.481L354.613 362.313L355.205 362.905H359.352L361.129 361.72L367.644 354.02L374.752 345.136H378.306H383.044L387.191 343.951L398.445 330.92L410.883 309.004L415.03 301.304V297.75L414.437 294.196L409.699 287.681L407.922 282.35L406.737 275.834L407.329 270.504L406.145 262.211L404.368 258.657V250.365L409.106 247.403L411.476 244.442L419.176 243.849L421.545 243.257V240.295L420.953 236.149L419.176 232.003L416.214 230.226V225.487L412.66 222.526L408.514 221.341L406.145 217.787L404.96 212.456L403.183 210.087H398.445L394.891 209.495L389.56 208.31L383.044 207.126V203.572L384.821 202.387V195.872Z"
      fill="currentColor"
      stroke="#284847"
    >
      <title>{{ getName(1726290) }}</title>
    </path>

    <!-- Yangihayot tumani -->
    <path
      :class="getPathStyle(1726292)"
      @mouseover="hoveredRegion = 1726292"
      @mouseleave="hoveredRegion = null"
      @click="emit('changeDistrict', 1726292)"
      xmlns="http://www.w3.org/2000/svg"
      d="M89.4756 405.128V399.205H90.0679L106.653 376.104L123.5 358.39L150.5 336.39L154.5 339.89L160 334.89V355.39L136 387.5V392.5L140 395.5V399L135 409.5V415.5L117.996 436.89L106.06 425.859L104.283 424.082L101.322 422.305V418.751L102.506 416.974V411.051L97.768 407.497L95.3988 405.128H89.4756Z"
      fill="currentColor"
      stroke="#284847"
    >
      <title>{{ getName(1726292) }}</title>
    </path>

    <!-- Sirg‘ali tumani -->
    <path
      :class="getPathStyle(1726283)"
      @mouseover="hoveredRegion = 1726283"
      @mouseleave="hoveredRegion = null"
      @click="emit('changeDistrict', 1726283)"
      xmlns="http://www.w3.org/2000/svg"
      d="M159.995 335.268L159.742 355.799L136.049 387.784V392.522L140.196 395.484V399.038L134.865 409.7V415.623L118.872 435.169L115.911 439.315V443.462H119.465L130.126 436.946H134.273L135.457 440.5V451.162L136.642 455.9V458.862L109.988 474.854L107.026 479.593L104.657 482.555V486.108H112.357L123.611 483.739L130.126 479.001H137.826H150.857L153.819 481.962H165.665L168.035 477.816H183.435L185.804 475.447H189.358V491.439L179.881 504.47V507.432L186.989 512.17L194.097 517.501H195.874L200.02 512.763V509.801L198.835 507.432V505.063H202.389L210.089 494.401V487.885L216.605 483.739L221.343 483.147L226.674 475.447V470.116V466.562L247.405 449.385L262.213 439.315L271.098 431.023L272.875 428.061V422.138L271.69 415.623V410.884L277 408.5L290 398L297 388.5H300V396.5H305L314 389.5L320 383H324V384.5H327L332.189 380.858H335L336 379.5H339L340.5 383H344V376L349 370L350 368H346L326.178 351.06H304.86V332.698L306.045 331.514V322.629L319.668 313.744V311.375L317.299 304.859L311.968 305.452L306.045 308.413L298.937 306.636L297.16 297.752H287.683L275.244 286.498H271.098L261.621 293.013L253.328 294.198L251.551 295.975H240.297L222.528 301.898L201.204 306.636L189.358 310.783L170.996 322.629L157.373 332.106H155.004L150.623 336.748L154.5 340L159.995 335.268Z"
      fill="currentColor"
      stroke="#284847"
    >
      <title>{{ getName(1726283) }}</title>
    </path>
  </svg>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from "vue";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  active: {
    type: [String, Number],
    default: null,
  },
});
const emit = defineEmits(["changeDistrict"]);

const hoveredRegion = ref(null);

const getName = (id) => {
  // 1. Toshkent shahri tumanlarining nomlari
  const districtNames = {
    1726264: { uz: "Bektemir tumani", ru: "Бектемирский район", en: "Bektemir District" },
    1726266: { uz: "Yunusobod tumani", ru: "Юнусабадский район", en: "Yunusabad District" },
    1726269: { uz: "Mirzo Ulug'bek tumani", ru: "Мирзо-Улугбекский район", en: "Mirzo Ulugbek District" },
    1726280: { uz: "Olmazor tumani", ru: "Алмазарский район", en: "Olmazor District" },
    1726277: { uz: "Shayxontoxur tumani", ru: "Шайхантахурский район", en: "Shaykhantakhur District" },
    1726262: { uz: "Uchtepa tumani", ru: "Учтепинский район", en: "Uchtepa District" },
    1726294: { uz: "Chilonzor tumani", ru: "Чиланзарский район", en: "Chilanzar District" },
    1726287: { uz: "Yakkasaroy tumani", ru: "Яккасарайский район", en: "Yakkasaray District" },
    1726273: { uz: "Mirobod tumani", ru: "Мирабадский район", en: "Mirabad District" },
    1726290: { uz: "Yashnobod tumani", ru: "Яшнабадский район", en: "Yashnabad District" },
    1726292: { uz: "Yangihayot tumani", ru: "Янгихаётский район", en: "Yangihayot District" },
    1726283: { uz: "Sirg'ali tumani", ru: "Сергелийский район", en: "Sergeli District" }
  };

  // 2. API dan kelgan ma'lumotni tekshirish
  const district = props.data.find((district) => district.id == id);
  
  if (district) {
    // API dan nom kelgan bo'lsa
    if (district.district_name && district.district_name[locale.value]) {
      return district.district_name[locale.value];
    }
    // Yoki boshqa nom field'lari
    if (district.name && typeof district.name === 'object') {
      return district.name[locale.value];
    }
    if (district.name && typeof district.name === 'string') {
      return district.name;
    }
  }

  // 3. Qo'lda belgilangan nomlardan olish
  if (districtNames[id] && districtNames[id][locale.value]) {
    return districtNames[id][locale.value];
  }

  // 4. Fallback
  return `Tuman ${id}`;
};

const getPathStyle = (id) => {
  const district = props.data.find((district) => district.id == id);

  let className = "";

  if (district) {
    if (district.status == "good") {
      className += "text-ratingGood";
    } else if (district.status == "bad") {
      className += "text-ratingBad";
    } else {
      className += "text-ratingNormal";
    }
  }

  className += props.active == id ? " active" : "";

  if (hoveredRegion.value == id || props.active == id) {
    className += " active-path";
  } else if (hoveredRegion.value != null && props.active != id) {
    className += " inactive-path";
  }

  return className.trim();
};

watch(
  () => props.active,
  () => (hoveredRegion.value = null),
  { immediate: true }
);
</script>
