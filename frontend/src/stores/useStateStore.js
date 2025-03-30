import { create } from 'zustand'

export const useStateStore = create((set) => ({
    status: '',
    setStatus: (newValue) => set({status: newValue}),
    onDuty: false,
    setOnDuty: (newValue) => set({onDuty: newValue}),
}))