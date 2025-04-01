import { create } from 'zustand'

export const useTripStore = create((set) => ({
    status: {},
    setStatus: (newValue) => set({status: newValue}),
    onDuty: false,
    setOnDuty: (newValue) => set({onDuty: newValue}),
    tripData: {},
    setTripData: (newValue) => set({tripData: newValue}),
    logEntries: [],
    setLogEntries: (newValue) => set({logEntries: newValue}),
}))