export type Role = 'admin' | 'user'

export type CarStatus = 'available' | 'in_use' | 'maintenance'

export interface Car {
  id: number
  name: string
  license_plate: string
  capacity: number
  status: CarStatus
  total_mileage: number
}

export interface User {
  id: number
  email: string
  role: Role
}

export type ReservationStatus = 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled'

export interface Reservation {
  id: number
  car_id: number
  car: Car
  user_id: number
  user: User
  start_datetime: string
  end_datetime: string
  destination: string
  purpose: string
  status: ReservationStatus
  mileage_driven: number | null
  created_at: string
}

export interface LoginRequest {
  email: string
  password: string
  role: Role
}

export interface LoginResponse {
  access_token: string
  token_type: string
  role: Role
  email: string
}

export interface TodayReservation {
  id: number
  car_id: number
  car_name: string
  user_id: number
  user_name: string
  user_email: string
  destination: string
  purpose: string | null
  start_datetime: string
  end_datetime: string
  status: ReservationStatus
}

export interface ReservationDetail {
  id: number
  user_id: number
  car_id: number
  car_name: string
  user_name: string
  user_email: string
  destination: string
  purpose: string | null
  start_datetime: string
  end_datetime: string
  status: ReservationStatus
  mileage_used: number
  note: string | null
  rejection_reason: string | null
  created_at: string
}

export interface DashboardStats {
  total_cars: number
  available_cars: number
  in_use_cars: number
  completed_reservations_this_month: number
  pending_approvals: number
}

export interface CarOut {
  id: number
  name: string
  plate_number: string
  model: string | null
  capacity: number
  is_available: boolean
  total_mileage: number
  created_at: string
}

export interface ReservationCreateRequest {
  car_id: number
  start_datetime: string
  end_datetime: string
  destination: string
  purpose: string
  note?: string
}

export interface CarCreate {
  name: string
  plate_number: string
  model?: string
  capacity?: number
  total_mileage?: number
}

export interface CarUpdate {
  name?: string
  model?: string
  capacity?: number
  is_available?: boolean
}

export interface UserOut {
  id: number
  name: string
  email: string
  role: Role
  is_active: boolean
  created_at: string
}

export interface UserCreate {
  name: string
  email: string
  password: string
  role: Role
}
