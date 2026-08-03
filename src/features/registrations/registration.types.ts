export type RegistrationStatus =
  | 'WAITING'
  | 'CHECKED_IN'
  | 'IN_EXAM'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW'

export type FinancingType =
  | 'SELF_PAY'
  | 'BPJS_KESEHATAN'
  | 'COMPANY'
  | 'PRIVATE_INSURANCE'

export interface RegistrationData {
  readonly id: string
  readonly patientId: string
  readonly patientName: string
  readonly patientMedicalRecordNumber: string
  readonly doctorId: string
  readonly doctorName: string
  readonly polyclinicId: string
  readonly polyclinicName: string
  readonly payerId: string | null
  readonly payerName: string | null
  readonly serviceDate: string
  readonly financingType: FinancingType
  readonly payerMemberNumber: string | null
  readonly visitReason: string
  readonly repeatVisitReason: string | null
  readonly status: RegistrationStatus
  readonly checkedInAt: string | null
  readonly completedAt: string | null
  readonly cancelledAt: string | null
  readonly cancelledReason: string | null
  readonly noShowAt: string | null
  readonly noShowReason: string | null
  readonly queueNumber: string | null
  readonly rowVersion: number
  readonly createdAt: string
  readonly updatedAt: string
}

export interface RegistrationPagination {
  readonly page: number
  readonly limit: number
  readonly totalItems: number
  readonly totalPages: number
}

export interface RegistrationListData {
  readonly items: readonly RegistrationData[]
  readonly pagination: RegistrationPagination
}

export interface RegistrationListQuery {
  readonly page?: number
  readonly limit?: number
  readonly date?: string
  readonly status?: RegistrationStatus
  readonly doctorId?: string
  readonly polyclinicId?: string
  readonly search?: string
}

export interface CreateRegistrationData {
  readonly patientId: string
  readonly doctorId: string
  readonly polyclinicId: string
  readonly serviceDate: string
  readonly financingType: FinancingType
  readonly payerId: string | null
  readonly payerMemberNumber: string | null
  readonly visitReason: string
  readonly repeatVisitReason: string | null
}

export interface UpdateRegistrationData {
  readonly financingType?: FinancingType
  readonly payerId?: string | null
  readonly payerMemberNumber?: string | null
  readonly visitReason?: string
  readonly status?: RegistrationStatus
  readonly cancelledReason?: string
  readonly noShowReason?: string
  readonly rowVersion: number
}
