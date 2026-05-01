import { defineStore } from 'pinia'

export interface StatData {
  id: number
  title: string
  share_percent: string
  previous_month_share_percent: string
  difference_share_percent: string
  place: number
}

export const useKpiStore = defineStore('kpiStore', {
  state: () => ({
    selectedKpi: null as StatData | null
  }),
  actions: {
    setKpi(data: StatData) {
      this.selectedKpi = data
    }
  }
})
