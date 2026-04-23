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

export interface DashboardToday {
  reservations: Reservation[]
}

export interface CarStat {
  car_id: number
  car_name: string
  reservation_count: number
  total_mileage: number
}

export interface DashboardStats {
  car_stats: CarStat[]
}
