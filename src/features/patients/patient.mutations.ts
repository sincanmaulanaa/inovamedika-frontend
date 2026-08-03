import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createPatient,
  deletePatient,
  updatePatient,
} from '@/features/patients/patient.api'
import { patientKeys } from '@/features/patients/patient.keys'

export function useCreatePatientMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPatient,
    onSuccess: async (patient) => {
      queryClient.setQueryData(patientKeys.detail(patient.id), patient)
      await queryClient.invalidateQueries({ queryKey: patientKeys.lists() })
    },
  })
}

export function useUpdatePatientMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updatePatient,
    onSuccess: async (patient) => {
      queryClient.setQueryData(patientKeys.detail(patient.id), patient)
      await queryClient.invalidateQueries({ queryKey: patientKeys.lists() })
    },
  })
}

export function useDeletePatientMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePatient,
    onSuccess: async (_data, patientId) => {
      queryClient.removeQueries({ queryKey: patientKeys.detail(patientId) })
      await queryClient.invalidateQueries({ queryKey: patientKeys.lists() })
    },
  })
}
