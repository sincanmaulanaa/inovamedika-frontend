export interface DoctorData {
  readonly id: string
  readonly name: string
  readonly sip: string
  readonly isActive: boolean
}

export interface PolyclinicData {
  readonly id: string
  readonly name: string
  readonly isActive: boolean
}

export interface PayerData {
  readonly id: string
  readonly name: string
  readonly type: 'BPJS' | 'INSURANCE' | 'CORPORATE' | 'PERSONAL'
  readonly isActive: boolean
}

export interface MedicationData {
  readonly id: string
  readonly code: string
  readonly name: string
  readonly dosageForm: string
  readonly strength: string
  readonly isActive: boolean
}
