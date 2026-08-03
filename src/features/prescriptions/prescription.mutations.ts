import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  cancelPrescription,
  createPrescription,
  finalizePrescription,
  updatePrescription,
} from './prescription.api'
import { prescriptionKeys } from './prescription.queries'
import type {
  PrescriptionFinalizeData,
  PrescriptionMutationData,
  PrescriptionUpdateData,
} from './prescription.types'
import { medicalRecordKeys } from '../medical-records'

export const useCreatePrescriptionMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: PrescriptionMutationData) => createPrescription(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: medicalRecordKeys.detail(data.medicalRecordId),
      })
    },
  })
}

export const useUpdatePrescriptionMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PrescriptionUpdateData }) =>
      updatePrescription(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: prescriptionKeys.detail(data.id),
      })
    },
  })
}

export const useFinalizePrescriptionMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: PrescriptionFinalizeData
    }) => finalizePrescription(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: prescriptionKeys.detail(data.id),
      })
    },
  })
}

export const useCancelPrescriptionMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: PrescriptionFinalizeData
    }) => cancelPrescription(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: prescriptionKeys.detail(data.id),
      })
    },
  })
}
