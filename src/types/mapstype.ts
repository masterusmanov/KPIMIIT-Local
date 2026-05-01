export interface Filter {
  view: "map" | "district";
  year: number;
  region: string;
  district: string;
  mode: "rating" | "analitics";
}

export interface Region {
  id: number;
  name: string;
  order: number;
}

export interface District {
  id: number;
  name: string;
  region_id: number;
}

export interface Organization {
  id: number;
  name: string;
}

export interface RankData {
  id: number;
  name: string;
  value: number;
  region_id: number;
  districts?: DistrictRank[];
}

export interface DistrictRank {
  id: number;
  name: string;
  value: number;
  region_id: number;
}
