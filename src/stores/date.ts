// stores/date.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDateStore = defineStore('date', () => {
  // State
  const selectedYear = ref<number>(new Date().getFullYear())
  const selectedMonth = ref<number>(new Date().getMonth() + 1)
  
  // Getters
  const currentYear = computed(() => new Date().getFullYear())
  const currentMonth = computed(() => new Date().getMonth() + 1)
  const currentQuarter = computed(() => Math.ceil(selectedMonth.value / 3))
  
  // Yillar ro'yxati (oxirgi 5 yil)
  const years = computed(() => {
    return Array.from({ length: 5 }, (_, i) => currentYear.value - i)
  })
  
  // Default month logic (agar bugun 5-kundan kam bo'lsa, oldingi oy)
  const defaultMonth = computed(() => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const day = today.getDate()

    if (day <= 5) {
      return month === 0 ? 12 : month
    } else {
      return month + 1
    }
  })
  
  // Actions
  const setYear = (year: number) => {
    selectedYear.value = year
  }
  
  const setMonth = (month: number) => {
    selectedMonth.value = month
  }
  
  const setDate = (year: number, month: number) => {
    selectedYear.value = year
    selectedMonth.value = month
  }
  
  // URL query dan ma'lumotlarni tiklash
  const initFromQuery = (query: any) => {
    if (query.year) {
      selectedYear.value = Number(query.year)
    }
    if (query.month) {
      selectedMonth.value = Number(query.month)
    }
  }
  
  // Reset to current date
  const resetToCurrentDate = () => {
    selectedYear.value = currentYear.value
    selectedMonth.value = currentMonth.value
  }
  
  // Ma'lumotlarni URL query format uchun qaytarish
  const getQueryParams = () => {
    return {
      year: selectedYear.value,
      month: selectedMonth.value
    }
  }

  return {
    // State
    selectedYear,
    selectedMonth,
    
    // Getters
    currentYear,
    currentMonth,
    currentQuarter,
    years,
    defaultMonth,
    
    // Actions
    setYear,
    setMonth,
    setDate,
    initFromQuery,
    resetToCurrentDate,
    getQueryParams
  }
})