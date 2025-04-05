import { create } from 'zustand'

export const useModalStore = create((set) => ({
    newTripOpen: false,
    setNewTripOpen: (newValue) => set({newTripOpen: newValue}),
    startTripOpen: false,
    setStartTripOpen: (newValue) => set({startTripOpen: newValue}),
    statusOpen: false,
    setStatusOpen: (newValue) => set({statusOpen: newValue}),
    endStatusOpen: false,
    setEndStatusOpen: (newValue) => set({endStatusOpen: newValue}),
    fsLoader: false,
    setFsLoader: (newValue) => set({fsLoader: newValue}),
}))