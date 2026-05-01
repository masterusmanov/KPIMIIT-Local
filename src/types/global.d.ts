export {};

declare global {
  interface Res<T = any> {
    data: {
      count: number;
      columns?: T;
      results?: T[];
      data?: T;
    };
    status: boolean;
  }

  interface User {
    id: number;
    pinfl: string;
    first_name: string;
    last_name: string | null;
    surname: string | null;
    login: string;
    region_id: number | null;
    region_title: string | null;
    district_id: number | null;
    district_title: string | null;
    department_id: number | null;
    department_title: string | null;
    office_id: number | null;
    office_title: string | null;
    office_unit_id: number | null;
    office_unit_title: string | null;
    role: "SUPERADMIN" | "ADMIN" | "WORKER" | "HR_MANAGER" | null;
    rank_id: number | null;
    position_id: number | null;
    position: string | null;
    image_id: number | null;
    image_url: string | null;
    joined_date: string | null;
    position_date: string | null;
    hired_at: string | null;
    position_changed_at: string | null;
    district: string; 
  }

  interface District {
    id: number;
    title: string;
    code: number;
    region_id: number;
    created_at: string;
  }

  interface Region {
    id: number;
    title: string;
    order: number;
    created_at: string;
  }

  interface Department {
    id: number;
    title: string;
    rank_id: number;
    created_at: string;
  }

  interface Office {
    id: number;
    title: string;
    department_name: string;
    department_id: number;
    rank_id: number;
    created_at: string;
  }

  interface OfficeUnit {
    id: number;
    title: string;
    office_id: number | null;
    office_name: number | null;
    rank_id: number;
    created_at: string;
  }

  interface Position {
    id: number;
    title: string;
    level: number | null;
    rank_ids: number[];
    created_at: string;
  }

  interface Criterion {
    id: number;
    title: string;
    rank_id: number;
    stage_id: number;
    stage_title: string;
    measurement_unit_id: number;
    measurement_unit_title: string;
    weight_r: number | null;
    weight_r1: number | null;
    weight_r2: number | null;
    weight_v: number | null;
    weight_v1: number | null;
    weight_v2: number | null;
    weight_h: number | null;
    weight_h1: number | null;
    weight_h2: number | null;
    director_position_id: number;
    allowed_user_ids: number[] | null;
    sub_criteria_ids: number[] | null;
    status: boolean;
    end_date: string | null;
    created_at: string | null;
    created_by: string | null;
    updated_at: string | null;
    updated_by: string | null;
    district_children_ids: number[] | null;
  }

  interface Stage {
    id: number;
    title: string;
    rank_ids: number[];
    end_date: string | null;
    status: boolean;
    director_id: number;
    responsible_user_name: string;
    created_at: string;
    created_by: string | null;
    updated_at: string | null;
    updated_by: string | null;
  }

  interface MeasurementUnit {
    id: number;
    title: string;
  }

  interface ExecutionDoc {
    id: number;
    file_id: number | null;
    file_url: string | null;
    status: "NEW" | "APPROVED" | "REJECTED" | string; // extend based on possible statuses
  }

  interface WorkerDetail {
    id: number;
    type: "DISTRICT" | string; // you can specify more types if needed
    region_id: number;
    district_id: number;
    district_title: string;
    responsible_user_id: number;
    responsible_user_name: string;
    criteria_id: number;
    criteria_title: string;
    year: number | null;
    month: number | null;
    plan_amount: number;
    execution_amount: number | null;
    execution_docs: ExecutionDoc[];
    status: boolean;
    end_date: string | null;
    created_at: string; // or Date if you parse it
    created_by: number | null;
    updated_at: string | null;
    updated_by: number | null;
  }

  interface StageMonthData {
    month: number;
    values: string[];
  }

  interface StageQuarterData {
    number: number;
    months: StageMonthData[];
    totals: string[];
  }

  interface StageData {
    id: number;
    title: string;
    quarters: StageQuarterData[];
    totals: string[];
  }

  interface UsersCount {
    total_count: number;
    vacant_count: number;
  }

  interface WorkerKPI {
    id: number;
    full_name: string;
    image_url: string | null;
    region_id: number;
    region_title: string;
    district_id: number;
    district_title: string;
    position_id: number;
    position_title: string;
    kpi: string;
  }

  interface MapData {
    id: number;
    title: string;
    share_percent: string;
    place: number;
  }
}
