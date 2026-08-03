export type MedicalRecordStatus = 'DRAFT' | 'FINAL' | 'AMENDED'

export interface MedicalRecordData {
  readonly id: string
  readonly patientId: string
  readonly patientName: string
  readonly patientMedicalRecordNumber: string
  readonly registrationId: string
  readonly doctorId: string
  readonly doctorName: string
  readonly polyclinicId: string
  readonly polyclinicName: string
  readonly visitDate: string
  readonly subjective: string | null
  readonly objective: string | null
  readonly assessment: string | null
  readonly plan: string | null
  readonly status: MedicalRecordStatus
  readonly amendmentReason: string | null
  readonly finalizedAt: string | null
  readonly rowVersion: number
  readonly createdAt: string
  readonly updatedAt: string
}

export interface MedicalRecordPagination {
  readonly page: number
  readonly limit: number
  readonly totalItems: number
  readonly totalPages: number
}

export interface MedicalRecordListData {
  readonly items: readonly MedicalRecordData[]
  readonly pagination: MedicalRecordPagination
}

export interface MedicalRecordListQuery {
  readonly page?: number
  readonly limit?: number
  readonly patientId: string
  readonly doctorId?: string
  readonly polyclinicId?: string
}

export interface MedicalRecordMutationData {
  readonly registrationId: string
  readonly subjective: string | null
  readonly objective: string | null
  readonly assessment: string | null
  readonly plan: string | null
}

export interface MedicalRecordUpdateData {
  readonly subjective?: string | null
  readonly objective?: string | null
  readonly assessment?: string | null
  readonly plan?: string | null
  readonly rowVersion: number
}

export interface MedicalRecordAmendmentData {
  readonly subjective: string | null
  readonly objective: string | null
  readonly assessment: string | null
  readonly plan: string | null
  readonly amendmentReason: string
  readonly rowVersion: number
}

export interface MedicalRecordFinalizeData {
  readonly rowVersion: number
}
