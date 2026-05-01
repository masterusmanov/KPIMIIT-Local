// stores/regions.ts - TO'G'RILANGAN VERSIYA
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import http from '@/libs/axios'

interface Region {
  id: number
  name: string
  percentage?: number
}

interface District {
  id: number
  name: string
  region_id: number
}

export const useRegionsStore = defineStore('regions', () => {
  // State
  const regions = ref<Region[]>([])
  const districts = ref<District[]>([])
  const selectedRegion = ref<number | null>(null)
  const selectedDistrict = ref<number | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const currentRegion = computed(() => 
    regions.value.find(r => r.id === selectedRegion.value)
  )

  const currentDistrict = computed(() => 
    districts.value.find(d => d.id === selectedDistrict.value)
  )

  const currentRegionDistricts = computed(() => 
    districts.value.filter(d => d.region_id === selectedRegion.value)
  )

  // Actions
  const fetchRegions = async () => {
    loading.value = true
    error.value = null
    console.log('Fetching regions...')
    
    try {
      const response = await http.get('/region/list')
      console.log('Regions API response:', response)
      
      // API response parsing - sizning strukturangizga mos
      if (response.data && response.data.results) {
        regions.value = response.data.results
      } else if (response.data && response.data.data && response.data.data.results) {
        regions.value = response.data.data.results
      } else if (response.data && Array.isArray(response.data)) {
        regions.value = response.data
      }
      
      console.log('Parsed regions:', regions.value)
      
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Viloyatlarni yuklashda xatolik'
      console.error('Error fetching regions:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchDistricts = async (regionId: number) => {
    loading.value = true
    error.value = null
    console.log('Fetching districts for region:', regionId)
    
    try {
      const response = await http.get('/district/list', {
        params: { region_id: regionId }
      })
      console.log('Districts API response:', response)
      
      // API response parsing - sizning strukturangizga mos
      if (response.data && response.data.results) {
        districts.value = response.data.results
      } else if (response.data && response.data.data && response.data.data.results) {
        districts.value = response.data.data.results
      } else if (response.data && Array.isArray(response.data)) {
        districts.value = response.data
      }
      
      console.log('Parsed districts:', districts.value)
      
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Tumanlarni yuklashda xatolik'
      console.error('Error fetching districts:', err)
    } finally {
      loading.value = false
    }
  }

  const selectRegion = async (regionId: number | null) => {
    selectedRegion.value = regionId
    selectedDistrict.value = null
    
    if (regionId) {
      await fetchDistricts(regionId)
    } else {
      districts.value = []
    }
  }

  const selectDistrict = (districtId: number | null) => {
    selectedDistrict.value = districtId
  }

  const resetSelection = () => {
    selectedRegion.value = null
    selectedDistrict.value = null
    districts.value = []
  }

  return {
    // State
    regions,
    districts,
    selectedRegion,
    selectedDistrict,
    loading,
    error,
    
    // Getters
    currentRegion,
    currentDistrict,
    currentRegionDistricts,
    
    // Actions
    fetchRegions,
    fetchDistricts,
    selectRegion,
    selectDistrict,
    resetSelection
  }
})
