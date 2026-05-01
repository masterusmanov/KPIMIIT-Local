<template>
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 375 553"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >    <!-- Qo'shko'pir -->
    <path
      :class="getPathStyle(1733212)"
      @mouseover="hoveredRegion = 1733212"
      @mouseleave="hoveredRegion = null"
      @click="emit('changeDistrict', 1733212)"
      d="M39.1691 87.4007V72.9023L40.6486 73.4941L53.3716 79.4118L57.2181 81.7789L63.1358 89.7678L65.207 94.2061L66.0947 99.532L67.87 103.083L70.2371 106.041L74.0836 108.704L85.6231 112.847L83.256 118.469L82.3683 119.356V121.132H81.1848V124.978L82.3683 126.753H87.6943V130.304L85.6231 133.855V139.772L95.979 148.649L97.1626 151.608H96.8667L95.0914 153.679V158.117H91.5408L88.286 155.158L84.4395 151.608L81.4807 151.016L78.2259 155.158H74.9712L72.0124 153.679L68.1659 151.608L60.7687 143.027H58.6975L57.514 143.915L54.851 149.537L51.3004 148.945L45.9745 146.282H39.1691L37.9856 145.394L35.3226 142.435L33.5473 134.151H31.772L28.8132 135.63H25.2626L22.3037 133.559H18.7531L14.0189 140.364L11.9477 140.956L7.21358 144.802L6.32593 143.915L1 133.855V123.795L1.88765 123.203L7.21358 115.214L11.9477 107.225L18.4572 99.2361L21.1202 97.7567L25.8543 95.9814H31.4761V94.5019H34.1391L37.9856 88.8801L39.1691 87.4007Z"
      fill="currentColor"
      stroke="#284847"
    >
      <title>{{ getName(1733212) }}</title>
    </path>    <!-- Xiva tuman -->
    <path
      :class="getPathStyle(1733226)"
      @mouseover="hoveredRegion = 1733226"
      @mouseleave="hoveredRegion = null"
      @click="emit('changeDistrict', 1733226)"
      d="M17.8597 164.331L8.39139 147.761L7.04688 144.802L7.50373 144.506L11.942 140.956L14.0132 140.364L18.7474 133.559H22.298L25.2568 135.63H28.8074L31.7663 134.15H33.5416L35.3169 142.435L37.9799 145.394L39.1634 146.282H45.9688L51.2947 148.945L54.8453 149.536L57.5083 143.915L58.6918 143.027H60.763L68.1601 151.608L74.9655 155.158H78.2202L81.4749 151.016L84.4338 151.608L91.535 158.117H95.0856V153.679L96.8609 151.608L112.247 161.076L110.472 164.922L109.88 174.687L105.442 175.574L102.779 174.687L96.8609 173.207L90.0556 173.799H82.6585L72.8943 179.717H67.8642L62.2424 184.155L59.8754 190.96L57.5083 193.327H55.733V190.96L53.6618 187.706L50.7029 189.481L47.4482 193.919L39.7552 202.5L38.8675 204.275L36.7963 208.122L34.7251 203.387L31.7663 193.919L29.6951 188.297L24.3692 177.35L17.8597 164.331Z"
      fill="currentColor"
      stroke="#284847"
    >
      <title>{{ getName(1733226) }}</title>
    </path>    <!-- Urganch shahar -->
    <path
      :class="getPathStyle(1733401)"
      @mouseover="hoveredRegion = 1733401"
      @mouseleave="hoveredRegion = null"
      @click="emit('changeDistrict', 1733401)"
      d="M157.513 131.779V121.708L138.196 138.592L128.028 153.139L115.101 163.176L126.011 169.397L132.549 175.024H135.818L139.088 171.47L140.276 169.397L138.196 165.546L137.899 163.473H141.465L155.136 170.581H156.622L157.216 171.766H159.594L169.401 165.546V161.399L164.052 157.549L161.674 154.586V146.293L164.943 140.961V138.592L159.594 134.741L157.513 131.779Z"
      fill="currentColor"
      stroke="#284847"
    >
      <title>{{ getName(1733401) }}</title>
    </path>

    <!-- Urganch tuman -->
    <path      :class="getPathStyle(1733217)"
      @mouseover="hoveredRegion = 1733217"
      @mouseleave="hoveredRegion = null"
      @click="emit('changeDistrict', 1733217)"
      d="M161.082 104.824L155.138 98.0117V109.86L152.167 110.452L149.789 106.009L148.303 108.379L147.709 109.86V115.191L143.548 119.635V121.116L147.709 124.374V127.336L143.548 129.705H137.901L136.118 127.336V122.004L132.255 118.746H128.985L123.636 123.189H120.664L112.937 112.526L107.201 106.898L101.776 109.267H97.8966L96.5914 110.156H92.3911L89.429 112.526H85.0009L82.6233 118.153L81.7317 119.042V120.819H80.543V124.67L81.7317 126.447H87.0812V130.002L85.0009 133.556V139.48L95.4026 148.366L96.5914 151.624L115.1 163.176L128.335 153.124L137.901 138.777L157.516 121.708L160.488 116.08V113.71H161.677V105.713L161.082 104.824Z"
      fill="currentColor"
      stroke="#284847"
    >
      <title>{{ getName(1733217) }}</title>
    </path>

    <!-- Shavot -->
    <path      :class="getPathStyle(1733230)"
      @mouseover="hoveredRegion = 1733230"
      @mouseleave="hoveredRegion = null"
      @click="emit('changeDistrict', 1733230)"
      d="M88.2907 65.2054L89.7701 63.1342V64.0218H99.2385L104.86 70.5313H108.115V75.2654L106.931 75.8572V83.5502L111.37 90.0597V91.5391L106.044 102.191L107.227 107.221L103.381 108.7L101.606 109.588H98.0549L96.5755 110.476H92.4331L88.8825 112.843H85.3319L82.9648 111.955L78.8224 110.476L74.0883 108.7L70.2417 106.037L67.8747 103.079L66.0994 99.528L65.2117 94.2021L63.1405 89.7638L57.2228 81.7749L53.3763 79.4078L39.1738 72.8984V65.5012H37.9903L37.6944 57.5124L36.8068 55.737L37.6944 46.5646V40.6469H38.5821L45.9792 33.5457L50.4175 28.8115H52.4887L58.1105 35.0251L59.8858 35.6169L69.65 47.1564L72.3129 54.2576L81.4854 64.3177L84.4442 63.7259L88.2907 65.2054Z"
      fill="currentColor"
      stroke="#284847"
    >
      <title>{{ getName(1733230) }}</title>
    </path>

    <!-- Gurlan -->
    <path      :class="getPathStyle(1733208)"
      @mouseover="hoveredRegion = 1733208"
      @mouseleave="hoveredRegion = null"
      @click="emit('changeDistrict', 1733208)"
      d="M151.308 73.7877L154.267 79.1136H151.308H149.237L145.686 75.8589L142.431 72.3083L145.686 68.4617V64.0235H144.207L142.431 64.9111H139.472L127.045 58.1058H123.199L115.802 63.1358L108.405 70.5329H104.854L99.2321 64.0235H89.7638V63.1358L88.2843 58.1058L86.509 53.0757L85.3255 47.4539L83.2543 43.0156L74.9695 35.3226L70.5312 27.6296V16.386L72.8983 14.6107H83.2543L88.2843 13.4272L93.6103 16.386L95.3856 21.4161H96.5691L99.2321 19.3449L101.007 16.386V7.80535L108.405 1L111.659 3.66296V8.98889L113.73 11.356H115.802L119.648 8.98889L127.045 10.1724L128.525 8.98889L131.779 4.8465H133.555L138.881 8.98889L141.544 4.8465H145.686V6.03004L144.798 8.98889L145.686 14.6107L155.45 23.1914H161.96L164.327 25.8543V29.7008L157.817 39.465V47.4539H156.634V50.7087L151.308 58.1058V73.7877Z"
      fill="currentColor"
      stroke="#284847"
    >
      <title>{{ getName(1733208) }}</title>
    </path>

    <!-- Yangibozor -->
    <path      :class="getPathStyle(1733236)"
      @mouseover="hoveredRegion = 1733236"
      @mouseleave="hoveredRegion = null"
      @click="emit('changeDistrict', 1733236)"
      d="M153.386 82.9578V79.1113H149.243L142.438 72.306L145.693 68.4595V64.0212H144.213L142.438 64.9089H139.479L127.052 58.1035H123.205L115.808 63.1336L108.115 70.5307V75.2648L106.932 75.8566V83.5496L111.37 90.0591V91.5385L109.89 94.4973L106.044 101.894L106.932 106.925L113.441 112.842L121.134 123.494H124.093L129.419 119.056H132.674L136.52 122.311V127.636L138.295 130.004H143.917L148.06 127.636V124.678L143.917 121.423V119.943L148.06 115.505V110.179L148.651 108.7L150.131 106.333L152.498 110.771L155.457 110.179V100.711V98.048L148.651 93.6097V87.1002L153.386 82.9578Z"
      fill="currentColor"
      stroke="#284847"
    >
      <title>{{ getName(1733236) }}</title>
    </path>

    <!-- Yangiariq -->
    <path      :class="getPathStyle(1733233)"
      @mouseover="hoveredRegion = 1733233"
      @mouseleave="hoveredRegion = null"
      @click="emit('changeDistrict', 1733233)"
      d="M41.8367 215.81L36.8066 208.117L39.7655 202.495L47.1626 194.21L50.7132 189.476L53.6721 187.701L55.7433 190.955V193.322H57.5186L59.8857 190.955L62.2527 184.15L67.8745 179.712H72.9046L82.6688 173.794H90.3618L96.8713 173.202L102.789 174.682L105.748 175.569V180.895L121.43 192.731L122.317 196.281L121.43 200.128L114.624 207.821H111.961L108.115 205.454H103.085L101.901 206.341L86.5153 218.473H84.74L79.1182 222.615V227.941L72.9046 232.379L64.6198 228.533L48.3461 222.023L41.8367 215.81Z"
      fill="currentColor"
      stroke="#284847"
    >
      <title>{{ getName(1733233) }}</title>
    </path>

    <!-- Bog'ot -->
    <path      :class="getPathStyle(1733204)"
      @mouseover="hoveredRegion = 1733204"
      @mouseleave="hoveredRegion = null"
      @click="emit('changeDistrict', 1733204)"
      d="M94.1945 243.33L72.8907 232.383L79.1043 227.944V222.618L84.7261 218.476H86.5014L103.071 205.457H108.101L111.948 207.824H114.611L115.498 209.599L118.161 210.783L123.783 211.966L124.079 211.079H128.813L130.884 211.671L147.75 219.364L153.076 220.547L158.401 219.66L161.952 216.109V210.783H164.911L168.757 212.558L178.226 218.476H181.185L190.949 214.038L192.132 214.925V216.997L190.357 220.547V227.648L184.439 232.678H180.297L177.93 230.015H176.155V236.821L175.267 237.413L172.604 238.892L165.799 245.106L156.626 249.84L151.3 252.503L139.465 265.226L128.517 259.9L111.652 251.615L94.1945 243.33Z"
      fill="currentColor"
      stroke="#284847"
    >
      <title>{{ getName(1733204) }}</title>
    </path>

    <!-- Xonqa -->
    <path      :class="getPathStyle(1733223)"
      @mouseover="hoveredRegion = 1733223"
      @mouseleave="hoveredRegion = null"
      @click="emit('changeDistrict', 1733223)"
      d="M169.646 165.808L169.942 165.572M169.942 165.572L171.126 166.992V176.756L169.646 180.603L179.411 194.805L181.778 201.315V205.457L185.032 207.824H190.95V211.079V214.038L182.37 217.884L181.186 218.476H178.227L168.759 212.558L164.912 210.783H161.953V216.109L158.403 219.659L153.077 220.547L147.751 219.364L140.946 216.109L130.886 211.671L128.814 211.079H124.08L123.784 211.966L118.163 210.783L115.5 209.599L114.612 207.824L121.417 200.131L122.305 196.285L121.417 192.734L105.735 180.899V175.573L109.878 174.685L110.47 164.921L112.245 161.37L126.151 169.359L132.957 175.277H136.211L139.466 171.726L140.65 169.655L138.579 165.808L138.283 163.737H141.833L155.444 170.838H156.923L157.515 172.022H159.882L168.759 166.4L169.942 165.572Z"
      fill="currentColor"
      stroke="#284847"
    >
      <title>{{ getName(1733223) }}</title>
    </path>

    <!-- Xazorasp -->
    <path      :class="getPathStyle(1733220)"
      @mouseover="hoveredRegion = 1733220"
      @mouseleave="hoveredRegion = null"
      @click="emit('changeDistrict', 1733220)"
      d="M190.892 240.427V228L184.679 233.03H180.832L178.465 230.367H176.69V237.172L173.139 239.244L166.334 245.457L151.835 252.854L140 265.577L142.071 267.057L144.734 267.944L149.468 271.791L154.794 275.046V279.484L156.274 283.626L158.345 284.81L164.558 286.881L165.742 289.544L168.109 294.87V298.125L171.956 306.114L182.016 317.949L196.514 325.938L200.952 327.713H205.391L208.645 325.938L215.451 319.428V316.47L213.675 313.511L211.308 308.777L209.533 304.634L204.503 298.125V290.136H205.391L215.451 278.005V270.903L213.675 269.72L205.391 259.956L201.84 255.221V251.967L197.402 243.978L192.963 241.315V240.427H190.892Z"
      fill="currentColor"
      stroke="#284847"
    >
      <title>{{ getName(1733220) }}</title>
    </path>

    <!-- Tuproqqala -->
    <path      :class="getPathStyle(1733221)"
      @mouseover="hoveredRegion = 1733221"
      @mouseleave="hoveredRegion = null"
      @click="emit('changeDistrict', 1733221)"
      d="M214.5 312.5L216.5 316L221.368 311.735L222.552 309.664L224.327 305.818L227.582 302.563L231.724 299.9H235.571L238.826 302.563L245.631 309.96L255.395 320.02L264.272 320.908L266.935 324.163V336.886L276.995 347.242L279.066 354.343L279.658 362.036L288.534 375.055V378.014L294.452 391.624V399.909L290.901 405.531L290.605 408.786L298.298 418.55L298.89 423.284L296.227 432.752L297.707 436.895L295.635 441.629L290.901 450.801L286.463 461.749L279.362 473.584L277.882 478.91L276.995 491.337V499.326L272.556 508.499L270.781 513.233L272.852 520.038L271.373 530.69V538.087L268.414 543.413L268.118 552.29H269.302L271.965 551.698L284.096 549.035L301.553 545.484L316.347 542.526L328.183 540.454L338.243 539.271L348.303 538.087L355.404 537.2L356.588 536.016L361.914 531.578L374.045 522.109V518.855H373.157V517.375L372.27 514.417L370.79 507.611L368.423 499.326L364.281 479.502L363.393 472.697L362.21 471.217V466.187L361.322 465.596V461.749L359.842 455.24L358.363 451.097H338.539L334.396 441.925L331.733 429.202L327.591 407.01L322.857 386.89L318.123 367.954L315.46 350.792L313.684 343.099V336.294L309.246 327.713L305.696 322.091L295.635 315.286L275.219 301.084L256.579 288.065L252.732 286.881L251.253 288.065H243.856L243.56 288.952H234.387L231.133 291.615L227.582 294.87L221.96 301.084L218.705 306.114L214.5 312.5Z"
      fill="currentColor"
      stroke="#284847"
    >
      <title>{{ getName(1733221) }}</title>
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
  // 1. Xorazm tumanlarining nomlari
  const districtNames = {
    1733212: { uz: "Qo'shko'pir tumani", ru: "Кушкупырский район", en: "Qoshkopir District" },
    1733226: { uz: "Xiva tumani", ru: "Хивинский район", en: "Khiva District" },
    1733401: { uz: "Urganch shahri", ru: "город Ургенч", en: "Urgench City" },
    1733217: { uz: "Urganch tumani", ru: "Ургенчский район", en: "Urgench District" },
    1733230: { uz: "Shavot tumani", ru: "Шаватский район", en: "Shavat District" },
    1733208: { uz: "Gurlan tumani", ru: "Гурленский район", en: "Gurlan District" },
    1733236: { uz: "Yangibozor tumani", ru: "Янгибазарский район", en: "Yangibozor District" },
    1733233: { uz: "Yangiariq tumani", ru: "Янгиарыкский район", en: "Yangiariq District" },
    1733204: { uz: "Bog'ot tumani", ru: "Багатский район", en: "Bogot District" },
    1733223: { uz: "Xonqa tumani", ru: "Ханкинский район", en: "Khonqa District" },
    1733220: { uz: "Xazorasp tumani", ru: "Хазараспский район", en: "Khazarasp District" },
    1733221: { uz: "Tuproqqala tumani", ru: "Турткульский район", en: "Tuproqqala District" }
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
