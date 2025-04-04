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
    locationForRouteDistanceCalculation: '',
    setLocationForRouteDistanceCalculation: (newValue) => set({locationForRouteDistanceCalculation: newValue}),
    routeDistanceFromStartPoint: null,
    setRouteDistanceFromStartPoint: (newValue) => set({routeDistanceFromStartPoint: newValue}),
    cycleHoursUsed: 0,
    setCycleHoursUsed: (newValue) => set({cycleHoursUsed: newValue}),
}))