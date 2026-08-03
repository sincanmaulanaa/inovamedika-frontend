import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  amendMedicalRecord,
  createMedicalRecord,
  finalizeMedicalRecord,
  updateMedicalRecord,
} from './medical-record.api'
import { medicalRecordKeys } from './medical-record.queries'
import type {
  MedicalRecordAmendmentData,
  MedicalRecordFinalizeData,
  MedicalRecordMutationData,
  MedicalRecordUpdateData,
} from './medical-record.types'
import { registrationKeys } from '../registrations'

export const useCreateMedicalRecordMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: MedicalRecordMutationData) => createMedicalRecord(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: medicalRecordKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: registrationKeys.detail(data.registrationId),
      })
    },
  })
}

export const useUpdateMedicalRecordMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MedicalRecordUpdateData }) =>
      updateMedicalRecord(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: medicalRecordKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: medicalRecordKeys.detail(data.id),
      })
    },
  })
}

export const useAmendMedicalRecordMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: MedicalRecordAmendmentData
    }) => amendMedicalRecord(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: medicalRecordKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: medicalRecordKeys.detail(data.id),
      })
    },
  })
}

export const useFinalizeMedicalRecordMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: MedicalRecordFinalizeData
    }) => finalizeMedicalRecord(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: medicalRecordKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: medicalRecordKeys.detail(data.id),
      })
    },
  })
}
