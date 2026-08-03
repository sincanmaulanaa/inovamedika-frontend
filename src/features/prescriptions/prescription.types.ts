export type PrescriptionStatus = 'DRAFT' | 'FINAL' | 'CANCELLED'

export interface PrescriptionItemData {
  readonly medicationId: string
  readonly medicationName: string
  readonly medicationCode: string
  readonly medicationDosageForm: string
  readonly medicationStrength: string
  readonly quantity: number
  readonly dosageInstructions: string
  readonly notes: string | null
}

export interface PrescriptionData {
  readonly id: string
  readonly medicalRecordId: string
  readonly patientId: string
  readonly patientName: string
  readonly patientMedicalRecordNumber: string
  readonly doctorId: string
  readonly doctorName: string
  readonly polyclinicId: string
  readonly polyclinicName: string
  readonly date: string
  readonly status: PrescriptionStatus
  readonly notes: string | null
  readonly rowVersion: number
  readonly createdAt: string
  readonly updatedAt: string
  readonly items: readonly PrescriptionItemData[]
}

export interface PrescriptionPagination {
  readonly page: number
  readonly limit: number
  readonly totalItems: number
  readonly totalPages: number
}

export interface PrescriptionListData {
  readonly items: readonly PrescriptionData[]
  readonly pagination: PrescriptionPagination
}

export interface PrescriptionListQuery {
  readonly page?: number
  readonly limit?: number
  readonly patientId: string
  readonly doctorId?: string
}

export interface PrescriptionItemMutationData {
  readonly medicationId: string
  readonly quantity: number
  readonly dosageInstructions: string
  readonly notes: string | null
}

export interface PrescriptionMutationData {
  readonly medicalRecordId: string
  readonly notes: string | null
  readonly items: readonly PrescriptionItemMutationData[]
}

export interface PrescriptionUpdateData {
  readonly notes?: string | null
  readonly rowVersion: number
  readonly items?: readonly PrescriptionItemMutationData[]
}

export interface PrescriptionFinalizeData {
  readonly rowVersion: number
}
